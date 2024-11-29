"use client";

import React, { useState } from "react";

const SubeTuMeme: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [category, setCategory] = useState<string>("");
    const [tags, setTags] = useState<string>("");
    const [error, setError] = useState<string>(""); // Para manejar errores
    const [successMessage, setSuccessMessage] = useState<string>(""); // Para manejar mensajes de éxito

    const usuarioId = "64f7c2b9a1b2c2d789123456"; // Reemplazar con el ID del usuario logueado

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile)); // Previsualización
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTags(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            setError("Por favor, selecciona un archivo para subir.");
            return;
        }

        if (!category) {
            setError("Por favor, selecciona una categoría.");
            return;
        }

        if (!tags) {
            setError("Por favor, añade al menos una etiqueta.");
            return;
        }

        setError(""); // Reiniciar mensaje de error
        setSuccessMessage(""); // Reiniciar mensaje de éxito

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
                setError(errorData.detail || "Error desconocido al subir el meme.");
                return;
            }

            const data = await response.json();
            setSuccessMessage(data.mensaje || "Meme subido exitosamente.");
            setFile(null);
            setPreviewUrl(null);
            setCategory("");
            setTags("");
        } catch (error) {
            setError("Hubo un problema al conectarse con el servidor.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-8">
            <h2 className="text-3xl font-bold mb-8">Sube tu meme</h2>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                {error && <p className="text-red-500">{error}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}
                <div className="flex flex-col items-center space-y-4">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="rounded-lg w-72 h-72 object-cover" />
                    ) : (
                        <div className="w-72 h-72 bg-gray-300 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">Previsualización</span>
                        </div>
                    )}
                    <div className="flex w-full justify-between">
                        <label htmlFor="fileInput" className="bg-gray-300 p-3 rounded cursor-pointer hover:bg-gray-400 flex items-center mr-3">
                            <span>Examinar</span>
                        </label>
                        <input type="file" accept=".gif,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" id="fileInput" />
                        <button type="submit" className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
                            Subir
                        </button>
                    </div>
                </div>
                <div className="flex flex-col space-y-4 w-full mt-4">
                    <div>
                        <label htmlFor="category" className="text-base font-medium">Elige la categoría</label>
                        <select id="category" value={category} onChange={handleCategoryChange} className="border rounded p-3 mt-2 w-full">
                            <option value="">Sin Categoría</option>
                            <option value="boomer">Boomer</option>
                            <option value="gatos">Gatos</option>
                            <option value="humor_negro">Humor Negro</option>
                            <option value="random">Random</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tags" className="text-base font-medium">Agrega etiquetas</label>
                        <textarea
                            id="tags"
                            placeholder="Ej: meme, divertido, gatos"
                            value={tags}
                            onChange={handleTagsChange}
                            className="border rounded p-3 mt-2 w-full resize-none"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SubeTuMeme;
