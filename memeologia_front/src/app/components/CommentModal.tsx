"use client";

import React from "react";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: { id: number; text: string; author: string; authorAvatar: string; likes: number }[];
  newComment: string; // Propiedad para manejar el nuevo comentario
  onNewCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Función para manejar el cambio de texto
  onAddComment: () => void; // Función para agregar el comentario
}

const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  comments,
  newComment,
  onNewCommentChange,
  onAddComment,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-lg p-4 rounded-lg shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
        <h2 className="text-lg font-semibold mb-4">Comentarios</h2>
        
        {/* Lista de comentarios con ajuste automático de texto */}
        <div className="h-64 overflow-y-auto space-y-4 border-t border-gray-300 pt-2">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3 p-2 border-b border-gray-200">
              <img src={comment.authorAvatar} alt={comment.author} className="w-8 h-8 rounded-full" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium">{comment.author}</p>
                <p className="text-sm text-gray-700 break-words whitespace-normal">{comment.text}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <button className="flex items-center focus:outline-none hover:bg-gray-300 p-2 rounded">
                    <img src="/icons/like.png" alt="Like" className="w-5 h-5" />
                    <span className="ml-1 text-sm">{comment.likes}</span>
                  </button>
                  <button className="text-gray-500 hover:underline text-sm">Reportar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Barra de entrada para nuevos comentarios */}
        <div className="flex items-center mt-4 border-t pt-4">
          <input
            type="text"
            value={newComment}
            onChange={onNewCommentChange} // Actualización del comentario
            placeholder="Escribe un comentario..."
            className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none resize-none overflow-hidden"
          />
          <button
            onClick={onAddComment} // Llamar a la función para agregar el comentario
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
