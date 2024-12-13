"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Meme {
  id: string;
  imageUrl: string;
  likes: number;
  reports: number;
  usuario_id: string;
  usuario_nombre: string;
  usuario_foto: string;
}

const Inicio: React.FC = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch(`http://200.104.72.42:8000/memes?page=${page}&limit=20`);
        if (response.ok) {
          const memeData = await response.json();
          setMemes(memeData.reverse()); // Invertimos para que los memes más recientes estén primero
          setLoading(false);
        } else {
          console.error("Error al obtener los memes");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    };

    fetchMemes();
  }, [page]);

  const likeMeme = async (memeId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`http://200.104.72.42:8000/like-meme/${memeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`http://200.104.72.42:8000/memes/${memeId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedMeme = await response.json();
        setMemes((prevMemes) =>
          prevMemes.map((meme) =>
            meme.id === memeId ? { ...meme, reports: updatedMeme.reports } : meme
          )
        );
      } else {
        const errorData = await response.json();
        console.error("Error al reportar el meme:", errorData.detail || "Error desconocido");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) {
    return <div>Cargando...</div>; // Mensaje de carga mientras obtenemos los memes
  }

  return (
    <div className="space-y-8 p-4">
      {memes.length === 0 ? (
        <div>No hay memes para mostrar.</div> // Mensaje si no hay memes
      ) : (
        memes.map((meme) => (
          <div key={meme.id} className="relative flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
            <div className="text-center text-black py-4 flex items-center">
              <img
                src={meme.usuario_foto}
                alt={meme.usuario_nombre}
                className="w-12 h-12 rounded-full ml-5"
              />
              <span className="ml-4 text-lg font-medium">{meme.usuario_nombre}</span>
            </div>

            <div className="flex justify-center bg-gray-100 p-4 h-[400px]">
              <img
                src={meme.imageUrl}
                alt="Meme"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            <div className="p-4 flex justify-between items-center">
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
        ))
      )}

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
    </div>
  );
};

export default Inicio;
