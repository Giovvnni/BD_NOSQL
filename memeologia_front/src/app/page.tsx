"use client";

import React, { useState } from 'react';

const App: React.FC = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-500 font-sans">
            {/* Barra lateral */}
            <aside 
                className={`fixed top-0 left-0 h-full shadow-lg transition-all duration-300 ${
                    isSidebarExpanded ? "w-48" : "w-16"
                } bg-gray-900 text-white flex flex-col items-center py-6 z-50`}
                onMouseEnter={() => setIsSidebarExpanded(true)}
                onMouseLeave={() => setIsSidebarExpanded(false)}
            >
                <button className="mb-6 hover:bg-gray-700 p-5 rounded flex justify-start items-center w-full">
                    <img src="/icons/user_bar.png" alt="Perfil" className="w-6 h-6" />
                    {isSidebarExpanded && <span className="ml-4">Usuario</span>}
                </button>
                <button className="focus:outline-none hover:bg-gray-700 p-5 rounded flex justify-start items-center w-full">
                    <img src="/icons/home.png" alt="Inicio" className="w-6 h-6" />
                    {isSidebarExpanded && <span className="ml-4">Inicio</span>}
                </button>
                <button className="focus:outline-none hover:bg-gray-700 p-5 rounded flex justify-start items-center w-full">
                    <img src="/icons/list.png" alt="Categorías" className="w-6 h-6" />
                    {isSidebarExpanded && <span className="ml-4">Categorías</span>}
                </button>
                <button className="focus:outline-none hover:bg-gray-700 p-5 rounded flex justify-start items-center w-full">
                    <img src="/icons/star.png" alt="Populares" className="w-6 h-6" />
                    {isSidebarExpanded && <span className="ml-4">Populares</span>}
                </button>
            </aside>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col ml-16">
                {/* Encabezado */}
                <header className="fixed left-16 right-0 p-2 bg-white shadow-lg z-40">
                    {/* Botón de subir meme */}
                    <button className="absolute top-4 right-4 bg-gray-900 text-white font-semibold py-2 px-4 rounded-full shadow hover:bg-gray-700 focus:outline-none flex items-center transition-colors duration-300">
                        <img src="/icons/upload2.png" alt="Upload" className="w-5 h-5 mr-2" />
                        Sube tu meme
                    </button>

                    {/* Título */}
                    <h1 className="text-5xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-500 drop-shadow-lg">
                        MEMEOLOGÍA
                    </h1>
                </header>

                {/* Sección de memes */}
                <main className="flex-1 p-8 bg-gray-300 rounded-lg shadow-lg m-4 mt-28 overflow-y-auto">
                    <div className="space-y-8">
                        {/* Meme */}
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
                        {/* Puedes agregar más memes aquí */}
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
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
