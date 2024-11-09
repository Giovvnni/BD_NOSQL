// app/layout.tsx
"use client";

import React, { useState } from "react";
import "./globals.css";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <html lang="es">
      <body className="flex min-h-screen bg-gray-500 font-sans">
        {/* Barra lateral (visible en pantallas medianas y grandes) */}
        <aside
          className={`fixed top-0 left-0 h-full shadow-lg transition-all duration-300 ${
            isSidebarExpanded ? "w-48" : "w-16"
          } bg-gray-900 text-white flex-col items-center py-6 hidden sm:flex z-50`}
          onMouseEnter={() => setIsSidebarExpanded(true)}
          onMouseLeave={() => setIsSidebarExpanded(false)}
        >
          <button className="mb-6 hover:bg-gray-700 p-5 rounded flex justify-start items-center w-full">
            <img src="/icons/user_bar.png" alt="Perfil" className="w-6 h-6" />
            {isSidebarExpanded && <span className="ml-4">Usuario</span>}
          </button>
          <button className="mb-6 hover:bg-gray-700 p-5 rounded flex justify-start items-center w-full">
                <img src="/icons/home.png" alt="Inicio" className="w-6 h-6" />
            {isSidebarExpanded && <span className="ml-4">Inicio</span>}
          </button>
          <button className="mb-6 hover:bg-gray-700 p-5 rounded flex justify-start items-center w-full">
            <img src="/icons/list.png" alt="Categorías" className="w-6 h-6" />
            {isSidebarExpanded && <span className="ml-4">Categorías</span>}
          </button>
          <button className="mb-6 hover:bg-gray-700 p-5 rounded flex justify-start items-center w-full">
            <img src="/icons/star.png" alt="Populares" className="w-6 h-6" />
            {isSidebarExpanded && <span className="ml-4">Populares</span>}
          </button>
        </aside>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col ml-0 sm:ml-16">
          {/* Encabezado */}
          <header className="fixed left-0 sm:left-16 right-0 p-2 bg-white shadow-lg z-40 flex items-center justify-between sm:justify-center">
            {/* Botón de menú para pantallas pequeñas */}
            <button
              className="flex sm:hidden bg-gray-900 text-white font-semibold py-2 px-4 rounded-full shadow hover:bg-gray-700 focus:outline-none flex items-center transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <img src="/icons/menu.png" alt="Menu" className="w-5 h-5 mr-2" />
              Menú
            </button>

            {/* Título que se oculta en pantallas pequeñas */}
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-500 drop-shadow-lg hidden sm:block">
              MEMEOLOGÍA
            </h1>

            {/* Botón de subir meme (siempre visible) */}
            <button className="bg-gray-900 text-white font-semibold py-2 px-4 rounded-full shadow hover:bg-gray-700 focus:outline-none flex items-center transition-colors duration-300 sm:absolute sm:right-4 sm:mr-4">
              <img src="/icons/upload2.png" alt="Upload" className="w-5 h-5 mr-2" />
              Sube tu meme
            </button>
          </header>

          {/* Menú móvil (solo visible cuando isMobileMenuOpen es true) */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex flex-col items-center z-50 p-4 sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="self-end text-white mb-4"
              >
                Cerrar
              </button>
              <button className="text-white py-2 px-4 rounded flex items-center w-full mb-2">
                <img src="/icons/user_bar.png" alt="Perfil" className="w-6 h-6 mr-2" />
                Usuario
              </button>
              <button className="text-white py-2 px-4 rounded flex items-center w-full mb-2">
                <img src="/icons/home.png" alt="Inicio" className="w-6 h-6 mr-2" />
                Inicio
              </button>
              <button className="text-white py-2 px-4 rounded flex items-center w-full mb-2">
                <img src="/icons/list.png" alt="Categorías" className="w-6 h-6 mr-2" />
                Categorías
              </button>
              <button className="text-white py-2 px-4 rounded flex items-center w-full mb-2">
                <img src="/icons/star.png" alt="Populares" className="w-6 h-6 mr-2" />
                Populares
              </button>
            </div>
          )}

          {/* Contenido principal */}
          <main className="flex-1 p-8 bg-gray-300 rounded-lg shadow-lg m-4 mt-28 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
};

export default Layout;
