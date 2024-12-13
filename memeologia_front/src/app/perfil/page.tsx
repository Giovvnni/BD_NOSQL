"use client";

import React, { useState, useEffect } from "react";

const PerfilUsuario: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeme, setSelectedMeme] = useState<string | null>(null);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<any>(null); // Estado para almacenar los datos del usuario
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null); // Para almacenar la nueva imagen de perfil
  const [isUploading, setIsUploading] = useState<boolean>(false); // Para manejar el estado de carga

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
          const response = await fetch(`http://200.104.72.42:8000/api/usuario/${usuarioId}`);
          if (!response.ok) {
            throw new Error("No se pudo obtener el usuario");
          }
          const data = await response.json();
          setUsuario(data); // Guardamos los datos del usuario en el estado
        } catch (error) {
          console.error(error);
        }
      };
      fetchUsuario();
    }
  }, [usuarioId]);

  // Si aún no hemos cargado los datos del usuario, mostramos un mensaje de carga
  if (!usuario) {
    return <div>Cargando perfil...</div>;
  }

  // Imagen por defecto en caso de que no haya una foto de perfil
  const defaultProfileImage = "";
  const profileImageUrl = usuario.foto_perfil || defaultProfileImage;

  // Función para manejar la carga de una nueva foto de perfil
  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewProfileImage(event.target.files[0]);
    }
  };

  // Función para subir la nueva imagen de perfil
  const uploadProfileImage = async () => {
    const usuarioId = localStorage.getItem("usuarioId");
    console.log("Usuario ID:", usuarioId); // Verifica el ID del usuario
    
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
    console.log("Imagen seleccionada:", newProfileImage); // Verifica la imagen seleccionada
    
    try {
      const response = await fetch(`http://200.104.72.42:8000/api/usuario/${usuarioId}/photo`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("No se pudo actualizar la foto de perfil");
      }
  
      const data = await response.json();
      console.log("Datos recibidos:", data); // Verifica la respuesta del servidor
  
      if (data && data.foto_perfil) {
        // Asegúrate de que se actualice el estado de usuario
        setUsuario((prevUsuario: any) => ({
          ...prevUsuario,
          foto_perfil: data.foto_perfil, // Nueva URL de la foto
        }));
  
        console.log("Usuario actualizado con la nueva foto:", data.foto_perfil); // Verifica el estado actualizado
        setNewProfileImage(null); // Resetear la imagen seleccionada
        
        // Forzar recarga de la página
        window.location.reload(); // Recargar la página para que se actualicen los datos
      } else {
        console.error("No se recibió la URL de la foto de perfil");
      }
    } catch (error) {
      console.error("Error al subir la foto:", error);
    } finally {
      setIsUploading(false);
    }
  };
  

  // Función para abrir el modal con el meme seleccionado
  const openModal = (memeSrc: string) => {
    setSelectedMeme(memeSrc);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMeme(null);
  };

  // Función para cerrar el modal si el usuario hace clic fuera del contenido
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
            src={profileImageUrl} // Usa la imagen de perfil o la por defecto
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full bg-gray-400 mb-4 cursor-pointer"
            onClick={() => document.getElementById("file-input")?.click()} // Abre el selector de archivo al hacer clic en la imagen
          />
          {/* Campo de entrada para cambiar la foto de perfil */}
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleProfileImageChange} // Actualiza el estado con la nueva imagen seleccionada
          />
        </div>

        {/* Mostrar un botón para subir la imagen */}
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
            onClick={() => openModal(meme.url_s3)} // Pasa la url del meme al modal
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
          onClick={handleModalClick} // Detecta clic fuera del modal
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
