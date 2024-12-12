"use client"

import React, { useState, useEffect } from "react";
import CommentModal from "./components/CommentModal";

// Tipado para los memes
interface Meme {
  id: string;
  imageUrl: string;
  likes: number;
  comments: { id: number; text: string; author: string; authorAvatar: string; likes: number }[];
  reports: number; // Añadido para el contador de reportes
  reported: boolean; // Añadido para controlar si está reportado
}

const Inicio: React.FC = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [selectedMemeId, setSelectedMemeId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [page, setPage] = useState(1);
  const [showReportModal, setShowReportModal] = useState(false); // Estado para mostrar el modal de reporte

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch(`http://localhost:8000/memes?page=${page}&limit=20`);
        if (response.ok) {
          const memeData = await response.json();
          setMemes(memeData.reverse());
        } else {
          console.error("Error al obtener los memes");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    };

    fetchMemes();
  }, [page]);

  const openComments = (memeId: string) => {
    setSelectedMemeId(memeId);
  };

  const closeComments = () => {
    setSelectedMemeId(null);
  };

  const addComment = async (memeId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/memes/${memeId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newComment }),
      });
  
      if (response.ok) {
        const updatedMeme = await response.json();
        setMemes((prevMemes) =>
          prevMemes.map((meme) =>
            meme.id === memeId ? { ...meme, comments: updatedMeme.comments } : meme
          )
        );
        setNewComment("");
      } else {
        console.error("Error al agregar el comentario");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };  

  const likeMeme = async (memeId: string) => {
    const token = localStorage.getItem("token"); // Asegúrate de obtener el token del localStorage
  
    if (!token) {
      console.error("No token found");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8000/like-meme/${memeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Asegúrate de incluir el token aquí
        },
      });
  
      if (response.ok) {
        const updatedMeme = await response.json();
        setMemes((prevMemes) =>
          prevMemes.map((meme) =>
            meme.id === memeId ? { ...meme, likes: updatedMeme.likes } : meme
          )
        );
      } else {
        const errorData = await response.json();
        console.error("Error al dar like al meme:", errorData.detail || "Error desconocido");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  }; 

  const reportMeme = async (memeId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/memes/${memeId}/report`, {
        method: "POST",
      });

      if (response.ok) {
        const updatedMeme = await response.json();
        setMemes((prevMemes) =>
          prevMemes.map((meme) =>
            meme.id === memeId ? { ...meme, reported: true } : meme
          )
        );
        setShowReportModal(true); // Mostrar el modal de éxito al reportar
      } else {
        console.error("Error al reportar el meme");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-8 p-4">
      {memes.map((meme: Meme) => (
        <div key={meme.id} className="relative flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
          <div className="text-center text-white py-4">
            <img src="/icons/user.png" alt="Usuario" className="w-12 h-12 rounded-full ml-5" />
          </div>

          <div className="flex justify-center bg-gray-100 p-4 h-[400px]">
            <img
              src={meme.imageUrl}
              alt="Meme"
              className="w-full h-full object-contain rounded-lg" // La imagen ajusta su altura al contenedor
            />
          </div>

          <div className="p-4 flex justify-between items-center">
            <button
              onClick={() => openComments(meme.id)}
              className="focus:outline-none hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <img src="/icons/comments.png" alt="Comentario" className="w-6 h-6" />
              <span className="font-semibold">Comentar</span>
            </button>
            <button
              onClick={() => likeMeme(meme.id)}
              className="focus:outline-none hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <img src="/icons/like.png" alt="Like" className="w-6 h-6" />
              <span className="font-semibold">{meme.likes} Me gusta</span>
            </button>
            <button
              onClick={() => reportMeme(meme.id)}
              className="focus:outline-none hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <img src="/icons/report.png" alt="Reportar" className="w-7 h-7" />
              <span className="font-semibold">
                Reportar {meme.reports > 0 && `(${meme.reports})`}
              </span>
            </button>
          </div>
        </div>
      ))}

      {/* Paginación */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="mx-4">{`Página ${page}`}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          className="px-4 py-2 bg-gray-300 rounded-lg"
        >
          Siguiente
        </button>
      </div>

      {/* Modal para comentarios */}
      {selectedMemeId && (
        <CommentModal
          isOpen={Boolean(selectedMemeId)}
          onClose={closeComments}
          comments={memes.find((meme: Meme) => meme.id === selectedMemeId)?.comments || []}
          newComment={newComment}
          onNewCommentChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value)}
          onAddComment={() => addComment(selectedMemeId!)}
        />
      )}

      {/* Modal de éxito al reportar */}
      {showReportModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Meme Reportado Exitosamente</h2>
            <p className="mt-4">El meme ha sido reportado y será revisado.</p>
            <button
              onClick={() => setShowReportModal(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inicio;
