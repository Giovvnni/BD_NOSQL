// src/app/page.tsx
"use client";

import React, { useState } from "react";
import CommentModal from "./components/CommentModal";

// Ejemplo de datos de memes y comentarios
const memes = [
  { id: 1, imageUrl: "https://via.placeholder.com/150" },
  { id: 2, imageUrl: "https://via.placeholder.com/150" },
  { id: 3, imageUrl: "https://via.placeholder.com/150" },
];

const Inicio: React.FC = () => {
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

  return (
    <div className="space-y-8">
      {memes.map((meme) => (
        <div key={meme.id} className="relative flex flex-col items-start space-y-4 p-4 bg-white rounded-lg shadow-md">
          {/* Meme */}
          <div className="flex items-start space-x-4">
            <img src="/icons/user.png" alt="Usuario" className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <div className="font-semibold">Usuario</div>
              <img src="/icons/meme.png" alt="Meme" className="ml-[200px] mb-4 rounded-lg w-790 h-790" />
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => openComments(meme.id)}
                  className="focus:outline-none hover:bg-gray-300 p-2 rounded flex items-center"
                >
                  <img src="/icons/comments.png" alt="Comentario" className="w-6 h-6" />
                  <span className="ml-2">Comentar</span>
                </button>
                <button className="focus:outline-none hover:bg-gray-300 p-2 rounded flex items-center">
                  <img src="/icons/like.png" alt="Like" className="w-6 h-6" />
                  <span className="ml-2">Me gusta</span>
                </button>
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button className="focus:outline-none hover:bg-gray-300 p-2 rounded flex items-center">
              <img src="/icons/share.png" alt="Compartir" className="w-6 h-6" />
            </button>
            <button className="focus:outline-none hover:bg-gray-300 p-2 rounded flex items-center">
              <img src="/icons/report.png" alt="Reportar" className="w-6 h-6" />
            </button>
          </div>
        </div>
      ))}

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
