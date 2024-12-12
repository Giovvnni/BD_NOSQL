"use client";

import React, { useState, useEffect } from "react";

const SubeTuMeme: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [category, setCategory] = useState<string>("");
    const [tags, setTags] = useState<string>("");
    const [modalMessage, setModalMessage] = useState<string>(""); // Mensaje del modal
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Control del modal
    const [usuarioId, setUsuarioId] = useState<string | null>(null); // Estado para el ID del usuario

    useEffect(() => {
        // Solo acceder a localStorage en el cliente
        const storedUsuarioId = localStorage.getItem("usuarioId");
        if (storedUsuarioId) {
            setUsuarioId(storedUsuarioId);
        } else {
            console.error("ID de usuario no encontrado");
        }
    }, []); // Este efecto solo se ejecuta en el cliente

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile)); // Previsualización
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setPreviewUrl(null);
    };

    const openModal = (message: string) => {
        setModalMessage(message);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones
        if (!file) {
            openModal("Por favor, selecciona un archivo para subir.");
            return;
        }

        if (!category) {
            openModal("Por favor, selecciona una categoría.");
            return;
        }

        if (!tags.trim()) {
            openModal("Por favor, añade al menos una etiqueta.");
            return;
        }

        if (!usuarioId) {
            openModal("No se ha encontrado el ID de usuario.");
            return;
        }

        // Verifica el ID antes de enviarlo
        console.log("ID de usuario:", usuarioId);

        const formData = new FormData();
        formData.append("usuario_id", usuarioId);
        formData.append("categoria", category);
        formData.append("etiquetas", JSON.stringify(tags.split(","))); // Convertir las etiquetas a un array
        formData.append("archivo", file);

        try {
            const response = await fetch("http://localhost:8000/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                openModal(errorData.detail || "Error desconocido al subir el meme.");
                return;
            }

            const data = await response.json();
            openModal(data.mensaje || "Meme subido exitosamente.");
            setFile(null);
            setPreviewUrl(null);
            setCategory("");
            setTags("");
        } catch (error) {
            openModal("Hubo un problema al conectarse con el servidor.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-8">
            <h2 className="text-3xl font-bold mb-8">Sube tu meme</h2>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <div
                    className={`w-72 h-72 bg-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-400 relative`}
                    onClick={() => {
                        if (!file) document.getElementById("fileInput")?.click();
                    }}
                >
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="rounded-lg w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-500">Haz clic aquí para cargar tu archivo</span>
                    )}
                    {file && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation(); // Evita que se active el clic en el área de previsualización
                                handleRemoveFile();
                            }}
                            className="absolute top-2 right-2 text-gray-800 hover:text-black text-xl font-bold"
                            aria-label="Quitar archivo"
                        >
                            ×
                        </button>
                    )}
                </div>
                <input
                    type="file"
                    accept=".gif,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileInput"
                />
                <div className="flex flex-col space-y-4 w-full mt-4">
                    <div>
                        <label htmlFor="category" className="text-base font-medium">Categoría</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="border rounded p-3 mt-2 w-full"
                        >
                            <option value="">Selecciona categoría</option>
                            <option value="boomer">Boomer</option>
                            <option value="gatos">Gatos</option>
                            <option value="humor_negro">Humor Negro</option>
                            <option value="random">Random</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tags" className="text-base font-medium">Etiquetas</label>
                        <textarea
                            id="tags"
                            placeholder="Ej: #meme, #divertido, #gatos"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="border rounded p-3 mt-2 w-full resize-none"
                        />
                    </div>
                </div>
                {file && (
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white p-3 rounded hover:bg-blue-600 w-full"
                    >
                        Subir
                    </button>
                )}
            </form>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <p className="text-center text-gray-800">{modalMessage}</p>
                        <button
                            onClick={closeModal}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubeTuMeme;

