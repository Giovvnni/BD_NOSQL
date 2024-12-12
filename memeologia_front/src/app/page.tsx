"use client";

import React, { useState, useEffect } from "react";
import CommentModal from "./components/CommentModal";

// Tipado para los memes
interface Meme {
  id: number;
  imageUrl: string;
}

const Inicio: React.FC = () => {
  const [memes, setMemes] = useState<Meme[]>([]); // Estado para los memes
  const [selectedMemeId, setSelectedMemeId] = useState<number | null>(null);
  const [comments, setComments] = useState<{
    [key: number]: { id: number; text: string; author: string; authorAvatar: string; likes: number }[];
  }>({
    1: [
      { id: 1, text: "Me gusta este meme!", author: "Usuario1", authorAvatar: "/icons/user.png", likes: 5 },
      { id: 2, text: "Muy divertido!", author: "Usuario2", authorAvatar: "/icons/user.png", likes: 2 },
    ],
    2: [{ id: 1, text: "Este está genial!", author: "Usuario3", authorAvatar: "/icons/user.png", likes: 3 }],
    3: [],
  });
  const [page, setPage] = useState(1); // Estado para la página actual

  // Realizar la llamada a la API para obtener los memes
  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch(`http://localhost:8000/memes?page=${page}&limit=20`);
        if (response.ok) {
          const memeData = await response.json();
          // Actualizar el estado con las URLs de los memes
          setMemes(memeData);
        } else {
          console.error("Error al obtener los memes");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    };

    fetchMemes();
  }, [page]); // Cuando la página cambie, se vuelve a cargar los memes

  const openComments = (memeId: number) => {
    setSelectedMemeId(memeId);
  };

  const closeComments = () => {
    setSelectedMemeId(null);
  };

  const addComment = (memeId: number, comment: string) => {
    setComments((prevComments) => ({
      ...prevComments,
      [memeId]: [
        ...prevComments[memeId],
        {
          id: prevComments[memeId].length + 1,
          text: comment,
          author: "Nuevo Usuario",
          authorAvatar: "/icons/user.png",
          likes: 0,
        },
      ],
    }));
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-8 p-4">
      {memes.map((meme) => (
        <div
          key={meme.id}
          className="relative flex flex-col bg-white rounded-lg shadow-md overflow-hidden"
        >
          {/* Encabezado del meme */}
          <div className="bg- text-center text-white py-4">
            <img src="/icons/user.png" alt="Usuario" className="w-12 h-12 rounded-full ml-5" />
          </div>
          <div className="absolute top-2 right-2 flex flex-row space-x-5 space-y-2">
            <button className="focus:outline-none hover:bg-gray-300 p-2 rounded flex items-center">
              <img src="/icons/share.png" alt="Compartir" className="w-6 h-6" />
            </button>
            <button className="focus:outline-none hover:bg-gray-300 p-2 rounded flex items-center">
              <img src="/icons/report.png" alt="Reportar" className="w-7 h-7" />
            </button>
          </div>

          {/* Imagen del meme */}
          <div className="flex justify-center bg-gray-100 p-4">
            <img
              src={meme.imageUrl}
              alt="Meme"
              className="max-w-full h-auto rounded-lg"
            />
          </div>

          {/* Opciones de interacción */}
          <div className="p-4 flex justify-between items-center">
            <button
              onClick={() => openComments(meme.id)}
              className="focus:outline-none hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <img src="/icons/comments.png" alt="Comentario" className="w-6 h-6" />
              <span className="font-semibold">Comentar</span>
            </button>
            <button className="focus:outline-none hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2">
              <img src="/icons/like.png" alt="Like" className="w-6 h-6" />
              <span className="font-semibold">Me gusta</span>
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
          comments={comments[selectedMemeId] || []}
          onAddComment={(comment) => addComment(selectedMemeId, comment)}
        />
      )}
    </div>
  );
};

export default Inicio;
