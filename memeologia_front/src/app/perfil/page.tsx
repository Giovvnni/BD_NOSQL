"use client";

import React, { useState, useEffect } from "react";

const PerfilUsuario: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeme, setSelectedMeme] = useState<string | null>(null);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<any>(null);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    const id = localStorage.getItem("usuarioId");
    if (id) {
      setUsuarioId(id);
    }
  }, []);

  useEffect(() => {
    if (usuarioId) {
      const fetchUsuario = async () => {
        try {
          const response = await fetch(`https://memeologia.duckdns.org/api/api/usuario/${usuarioId}`);
          if (!response.ok) {
            throw new Error("No se pudo obtener el usuario");
          }
          const data = await response.json();
          setUsuario(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchUsuario();
    }
  }, [usuarioId]);

  if (!usuario) {
    return <div>Cargando perfil...</div>;
  }

  const defaultProfileImage = "";
  const profileImageUrl = usuario.foto_perfil || defaultProfileImage;

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewProfileImage(event.target.files[0]);
    }
  };

  const uploadProfileImage = async () => {
    const usuarioId = localStorage.getItem("usuarioId");
    if (!usuarioId) {
      console.error("Usuario no encontrado en el almacenamiento local");
      return;
    }

    if (!newProfileImage) {
      console.error("No se ha seleccionado una nueva imagen");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("archivo", newProfileImage);

    try {
      const response = await fetch(`https://memeologia.duckdns.org/api/api/usuario/${usuarioId}/photo`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("No se pudo actualizar la foto de perfil");
      }

      const data = await response.json();
      if (data && data.foto_perfil) {
        setUsuario((prevUsuario: any) => ({
          ...prevUsuario,
          foto_perfil: data.foto_perfil,
        }));
        setNewProfileImage(null);
        window.location.reload();
      } else {
        console.error("No se recibió la URL de la foto de perfil");
      }
    } catch (error) {
      console.error("Error al subir la foto:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const openModal = (memeSrc: string) => {
    setSelectedMeme(memeSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMeme(null);
  };

  const handleModalClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-200 p-8">
      {/* Sección de perfil */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <img
            src={profileImageUrl}
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full bg-gray-400 mb-4 cursor-pointer"
            onClick={() => document.getElementById("file-input")?.click()}
          />

          {/* Icono de editar */}
          <div
            className="absolute bottom-0 right-0 w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-900"
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182l-10.5 10.5a.75.75 0 0 1-.277.172l-4.5 1.5a.75.75 0 0 1-.949-.949l1.5-4.5a.75.75 0 0 1 .172-.277l10.5-10.5zM15.75 6.75l1.5 1.5"
              />
            </svg>
          </div>

          <input
            id="file-input"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
        </div>

        {newProfileImage && !isUploading && (
          <button
            onClick={uploadProfileImage}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Subir nueva foto
          </button>
        )}

        {isUploading && <div>Subiendo...</div>}

        <h2 className="text-2xl font-semibold">{usuario.nombre}</h2>
      </div>

      {/* Galería de memes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl">
        {usuario.memes.map((meme: any) => (
          <div
            key={meme.url_s3}
            className="w-full h-auto bg-gray-300 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => openModal(meme.url_s3)}
          >
            <img
              src={meme.url_s3}
              alt="Meme"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Modal para ver el meme en grande */}
      {isModalOpen && selectedMeme && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleModalClick}
        >
          <div className="relative bg-white rounded-lg p-4 max-w-3xl">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 font-bold text-xl"
            >
              &times;
            </button>
            <img
              src={selectedMeme}
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
