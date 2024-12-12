"use client";

import React, { useState, useEffect } from "react";

const PerfilUsuario: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMeme, setSelectedMeme] = useState<string | null>(null);
    const [usuarioId, setUsuarioId] = useState<string | null>(null);
    const [usuario, setUsuario] = useState<any>(null);  // Estado para almacenar los datos del usuario

    useEffect(() => {
        // Obtener el id del usuario desde localStorage
        const id = localStorage.getItem("usuarioId");
        if (id) {
            setUsuarioId(id);
        }
    }, []);

    useEffect(() => {
        // Si tenemos un usuarioId, hacemos una solicitud al backend para obtener los datos del usuario
        if (usuarioId) {
            const fetchUsuario = async () => {
                try {
                    const response = await fetch(`http://localhost:8000/api/usuario/${usuarioId}`);  // Cambié el puerto aquí
                    if (!response.ok) {
                        throw new Error("No se pudo obtener el usuario");
                    }
                    const data = await response.json();
                    setUsuario(data);  // Guardamos los datos del usuario en el estado
                } catch (error) {
                    console.error(error);
                }
            };
            fetchUsuario();
        }
    }, [usuarioId]);  // Se ejecuta cada vez que usuarioId cambia

    // Si aún no hemos cargado los datos del usuario, mostramos un mensaje de carga
    if (!usuario) {
        return <div>Cargando perfil...</div>;
    }

    // Imagen por defecto en caso de que no haya una foto de perfil
    const defaultProfileImage = "";
    const profileImageUrl = usuario.foto_perfil || defaultProfileImage;  // Si no tiene foto de perfil, usa la predeterminada

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
                    src={profileImageUrl}  // Usa la imagen de perfil o la por defecto
                    alt="Foto de perfil"
                    className="w-24 h-24 rounded-full bg-gray-400 mb-4"
                />
                <h2 className="text-2xl font-semibold">{usuario.nombre}</h2>
            </div>

            {/* Galería de memes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl">
                {usuario.memes.map((meme: any) => (
                    <div
                        key={meme.url_s3}  // Usamos url_s3 como clave única
                        className="w-full h-auto bg-gray-300 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => openModal(meme.url_s3)}  // Pasa la url del meme al modal
                    >
                        <img
                            src={meme.url_s3}  // Usa url_s3 para mostrar la imagen
                            alt="Meme"
                            className="w-full h-full object-cover"
                        />
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
                        <img
                            src={selectedMeme}  // Muestra el meme en grande
                            alt="Meme grande"
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PerfilUsuario;
