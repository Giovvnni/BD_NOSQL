"use client";

import React, { useState } from "react";

// Datos de prueba
const memes = [
  { id: 1, imageUrl: "https://via.placeholder.com/600x400", title: "Meme Gracioso", category: "Oficial", tags: ["divertido", "meme"] },
  { id: 2, imageUrl: "https://via.placeholder.com/600x400", title: "Meme de Animales", category: "Será Oficial", tags: ["animales", "gatos"] },
  { id: 3, imageUrl: "https://via.placeholder.com/600x400", title: "Meme Tecnológico", category: "Dejó de ser Oficial", tags: ["tecnología", "programación"] },
];

const categories = [
  { label: "Oficial", count: 583 },
  { label: "Será Oficial", count: 22 },
  { label: "Dejó de ser Oficial", count: 289 },
  { label: "Nunca fue Oficial", count: 18 },
];

const Categorias: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempSelectedCategories, setTempSelectedCategories] = useState<string[]>([]);
  const [tempTagSearch, setTempTagSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState("");

  const toggleCategory = (category: string) => {
    setTempSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const applyFilters = () => {
    setSelectedCategories(tempSelectedCategories);
    setTagSearch(tempTagSearch);
    setIsFilterOpen(false); // Cerrar el menú
  };

  const resetFilters = () => {
    setTempSelectedCategories([]);
    setTempTagSearch("");
  };

  const closeFilterMenu = () => {
    setIsFilterOpen(false);
  };

  const filteredMemes = memes.filter((meme) => {
    const matchesCategory = selectedCategories.length
      ? selectedCategories.includes(meme.category)
      : true;
    const matchesTag = tagSearch
      ? meme.tags.some((tag) => tag.toLowerCase().includes(tagSearch.toLowerCase()))
      : true;
    return matchesCategory && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-8">
      {/* Botón para abrir los filtros */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none"
        >
          Filtros
        </button>
      </div>

      {/* Menú de filtros */}
      {isFilterOpen && (
        <div className="absolute top-20 right-4 bg-white border border-gray-300 rounded-lg shadow-lg w-64 p-4 z-10">
          {/* Botón "Cerrar" */}
          <button
            onClick={closeFilterMenu}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
          >
            ✕
          </button>

          <h2 className="font-semibold text-lg mb-4">Filtrar por:</h2>

          {/* Filtro por categorías */}
          <div className="mb-4">
            <h3 className="font-medium text-sm mb-2">Categorías</h3>
            {categories.map((category) => (
              <div key={category.label} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={tempSelectedCategories.includes(category.label)}
                  onChange={() => toggleCategory(category.label)}
                  className="mr-2"
                />
                <span>
                  {category.label} ({category.count})
                </span>
              </div>
            ))}
          </div>

          {/* Filtro por etiquetas */}
          <div className="mb-4">
            <h3 className="font-medium text-sm mb-2">Etiquetas</h3>
            <input
              type="text"
              placeholder="Buscar por etiqueta..."
              value={tempTagSearch}
              onChange={(e) => setTempTagSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between items-center">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none"
            >
              Borrar
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg shadow-md hover:bg--600 focus:outline-none"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}

      {/* Listado de memes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMemes.length > 0 ? (
          filteredMemes.map((meme) => (
            <div
              key={meme.id}
              className="relative flex flex-col bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Imagen del meme */}
              <div className="flex justify-center bg-gray-100 p-4">
                <img
                  src={meme.imageUrl}
                  alt={meme.title}
                  className="max-w-full h-auto rounded-lg"
                />
              </div>

              {/* Título y categoría */}
              <div className="p-4">
                <h3 className="font-semibold text-lg">{meme.title}</h3>
                <p className="text-sm text-gray-500">{meme.category}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-700">
            No se encontraron memes con los filtros seleccionados.
          </p>
        )}
      </div>
    </div>
  );
};

export default Categorias;

