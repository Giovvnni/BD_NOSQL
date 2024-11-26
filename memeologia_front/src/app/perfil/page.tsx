"use client";

import React, { useState } from "react";

const PerfilUsuario: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMeme, setSelectedMeme] = useState<string | null>(null);

    const usuario = {
        nombre: "Nombre de usuario",
        fotoPerfil: "/icons/user.png", // Ruta de la foto de perfil
        memes: [
            { id: 1, src: "https://via.placeholder.com/150" }, // Reemplaza con URLs reales de los memes
            { id: 2, src: "https://via.placeholder.com/150" },
            { id: 3, src: "https://via.placeholder.com/150" },
            { id: 4, src: "https://via.placeholder.com/150" },
            { id: 5, src: "https://via.placeholder.com/150" },
            { id: 6, src: "https://via.placeholder.com/150" },
            { id: 7, src: "https://via.placeholder.com/150" },
            { id: 8, src: "https://via.placeholder.com/150" },
            // Agrega más memes aquí para probar
        ],
    };

    const openModal = (memeSrc: string) => {
        setSelectedMeme(memeSrc);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMeme(null);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-200 p-8">
            {/* Sección de perfil */}
            <div className="flex flex-col items-center mb-8">
                <img
                    src={usuario.fotoPerfil}
                    alt="Foto de perfil"
                    className="w-24 h-24 rounded-full bg-gray-400 mb-4"
                />
                <h2 className="text-2xl font-semibold">{usuario.nombre}</h2>
            </div>

            {/* Galería de memes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl">
                {usuario.memes.map((meme) => (
                    <div
                        key={meme.id}
                        className="w-full h-auto bg-gray-300 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => openModal(meme.src)}
                    >
                        <img src={meme.src} alt="Meme" className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>

            {/* Modal para ver el meme en grande */}
            {isModalOpen && selectedMeme && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="relative bg-white rounded-lg p-4 max-w-3xl">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 font-bold text-xl"
                        >
                            &times;
                        </button>
                        <img src={selectedMeme} alt="Meme grande" className="w-full h-auto rounded-lg" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PerfilUsuario;

