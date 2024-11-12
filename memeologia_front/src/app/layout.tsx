"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./globals.css";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Simulación de verificación de autenticación (actualiza esto según tu lógica de autenticación)
  useEffect(() => {
    // Aquí iría una lógica real de autenticación, por ejemplo, verificando un token en localStorage
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

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
          <Link href="/perfil" className="mb-6 hover:bg-gray-700 p-5 rounded flex justify-start items-center w-full">
            <img src="/icons/user_bar.png" alt="Perfil" className="w-6 h-6" />
            {isSidebarExpanded && <span className="ml-4">Perfil</span>}
          </Link>
          <Link href="/" className="mb-6 hover:bg-gray-700 p-5 rounded flex justify-start items-center w-full">
            <img src="/icons/home.png" alt="Inicio" className="w-6 h-6" />
            {isSidebarExpanded && <span className="ml-4">Inicio</span>}
          </Link>
          <Link href="/categorias" className="mb-6 hover:bg-gray-700 p-5 rounded flex justify-start items-center w-full">
            <img src="/icons/list.png" alt="Categorías" className="w-6 h-6" />
            {isSidebarExpanded && <span className="ml-4">Categorías</span>}
          </Link>
          <Link href="/populares" className="mb-6 hover:bg-gray-700 p-5 rounded flex justify-start items-center w-full">
            <img src="/icons/star.png" alt="Populares" className="w-6 h-6" />
            {isSidebarExpanded && <span className="ml-4">Populares</span>}
          </Link>
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

            {/* Botones de autenticación */}
            <div className="flex items-center space-x-4 sm:absolute sm:right-4 sm:mr-4">
              {!isAuthenticated ? (
                <>
                  <Link href="/login" className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-full shadow hover:bg-blue-600 focus:outline-none">
                    Iniciar Sesión
                  </Link>
                  <Link href="/registro" className="bg-green-500 text-white font-semibold py-2 px-4 rounded-full shadow hover:bg-green-600 focus:outline-none">
                    Registrarse
                  </Link>
                </>
              ) : (
                <Link href="/sube_tu_meme" className="bg-gray-900 text-white font-semibold py-2 px-4 rounded-full shadow hover:bg-gray-700 focus:outline-none flex items-center transition-colors duration-300">
                  <img src="/icons/upload2.png" alt="Upload" className="w-5 h-5 mr-2" />
                  Sube tu meme
                </Link>
              )}
            </div>
          </header>

          {/* Menú móvil (visible en pantallas pequeñas) */}
          {isMobileMenuOpen && (
            <div className="fixed top-0 left-0 h-full w-full bg-gray-900 bg-opacity-75 text-white flex flex-col items-center py-6 sm:hidden z-50">
              <button
                className="self-end text-white mb-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                X
              </button>
              <Link href="/perfil" className="text-white py-2 px-4 rounded flex items-center w-full mb-2 hover:bg-gray-700" onClick={handleMenuClose}>
                <img src="/icons/user_bar.png" alt="Perfil" className="w-6 h-6 mr-2" />
                Perfil
              </Link>
              <Link href="/" className="text-white py-2 px-4 rounded flex items-center w-full mb-2 hover:bg-gray-700" onClick={handleMenuClose}>
                <img src="/icons/home.png" alt="Inicio" className="w-6 h-6 mr-2" />
                Inicio
              </Link>
              <Link href="/categorias" className="text-white py-2 px-4 rounded flex items-center w-full mb-2 hover:bg-gray-700" onClick={handleMenuClose}>
                <img src="/icons/list.png" alt="Categorías" className="w-6 h-6 mr-2" />
                Categorías
              </Link>
              <Link href="/populares" className="text-white py-2 px-4 rounded flex items-center w-full mb-2 hover:bg-gray-700" onClick={handleMenuClose}>
                <img src="/icons/star.png" alt="Populares" className="w-6 h-6 mr-2" />
                Populares
              </Link>
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
