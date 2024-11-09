// app/page.tsx
import React from "react";

const Page: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Ejemplo de meme */}
      <div className="relative flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md">
        <img src="/icons/user.png" alt="Usuario" className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <img src="https://via.placeholder.com/150" alt="Meme" className="mb-4 rounded-lg w-36 h-36" />
          <div className="flex space-x-4 mt-4">
            <button className="focus:outline-none hover:bg-gray-300 p-2 rounded flex items-center">
              <img src="/icons/like.png" alt="Like" className="w-6 h-6" />
            </button>
            <button className="focus:outline-none hover:bg-gray-300 p-2 rounded flex items-center">
              <img src="/icons/comments.png" alt="Comentario" className="w-6 h-6" />
            </button>
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
      {/* Añade más memes aquí */}
    </div>
  );
};

export default Page;
