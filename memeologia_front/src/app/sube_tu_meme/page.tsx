"use client";

import React, { useState } from "react";

const SubeTuMeme: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [category, setCategory] = useState<string>('');
    const [tags, setTags] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTags(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Archivo:", file);
        console.log("Categoría:", category);
        console.log("Etiquetas:", tags);

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-8">
            <h2 className="text-3xl font-bold mb-8">Sube tu meme</h2>
            <form onSubmit={handleSubmit} className="flex flex-row bg-white p-8 rounded-lg shadow-lg space-x-6 w-full max-w-2xl">
                {/* Sección de imagen y botones */}
                <div className="flex flex-col items-center space-y-4">
                    {/* Imagen de previsualización */}
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="rounded-lg w-72 h-72 object-cover" />
                    ) : (
                        <div className="w-72 h-72 bg-gray-300 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">Previsualización</span>
                        </div>
                    )}

                    {/* Botones debajo de la imagen */}
                    <div className="flex w-full justify-between">
                        <label htmlFor="fileInput" className="bg-gray-300 p-3 rounded cursor-pointer hover:bg-gray-400 flex items-center mr-3">
                            <span>Examinar</span>
                            <img src="/icons/device.png" alt="device Icon" className="ml-2 w-4 h-4" />
                        </label>
                        <input type="file" accept=".gif,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" id="fileInput" />
                        <button type="submit" className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 flex items-center">
                            <span>Subir</span>
                            <img src="/icons/upload.png" alt="Upload Icon" className="ml-2 w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Sección de categoría y etiquetas */}
                <div className="flex flex-col space-y-4 w-full">
                    <div>
                        <label htmlFor="category" className="text-base font-medium">Elige la categoría!</label>
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
                            placeholder="#Tag"
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
