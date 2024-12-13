"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./globals.css";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Importa el AuthProvider y el hook useAuth

const LayoutComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth(); // Usa useAuth para manejar el estado de autenticación
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login"); // Redirigir al login después de cerrar sesión
  };

  return (
    <html lang="es">
      <body className="flex min-h-screen bg-gray-500 font-sans">
        <aside
          className={`fixed top-0 left-0 h-full shadow-lg transition-all duration-300 ${
            isSidebarExpanded ? "w-48" : "w-16"
          } bg-gray-900 text-white flex flex-col items-center py-6 hidden sm:flex z-50`}
          onMouseEnter={() => setIsSidebarExpanded(true)}
          onMouseLeave={() => setIsSidebarExpanded(false)}
        >
         <Link href="/" className="mb-6 hover:bg-gray-700 p-5 rounded flex justify-start items-center w-full">
            <img src="/icons/home.png" alt="Inicio" className="w-6 h-6" />
            {isSidebarExpanded && <span className="ml-4">Inicio</span>}
          </Link>
          {isAuthenticated && (
            <>
              <Link href="/perfil" className="mb-6 hover:bg-gray-700 p-5 rounded flex justify-start items-center w-full">
                <img src="/icons/user_bar.png" alt="Perfil" className="w-6 h-6" />
                {isSidebarExpanded && <span className="ml-4">Perfil</span>}
              </Link>
            </>
          )}
         
  

          {/* Botón de Cerrar Sesión en la parte inferior de la barra lateral */}
          {isAuthenticated && (
            <button
            onClick={handleLogout}
            className="mt-auto mb-6 hover:bg-red-700 p-5 rounded flex justify-start items-center w-full text-left"
          >
            <img src="/icons/logout.png" alt="Cerrar Sesión" className="w-6 h-6" />
            {isSidebarExpanded && (
              <span className="ml-4 whitespace-nowrap">
                Cerrar Sesión
              </span>
            )}
          </button>
          
          )}
        </aside>

        <div className="flex-1 flex flex-col ml-0 sm:ml-16">
          <header className="fixed left-0 sm:left-16 right-0 p-2 bg-white shadow-lg z-40 flex items-center justify-between sm:justify-center">
            <button
              className="flex sm:hidden bg-gray-900 text-white font-semibold py-2 px-4 rounded-full shadow hover:bg-gray-700 focus:outline-none flex items-center transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <img src="/icons/menu.png" alt="Menu" className="w-5 h-5 mr-2" />
              Menú
            </button>

            {/* Título con enlace a la página principal */}
            <Link href="/">
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-500 drop-shadow-lg hidden sm:block cursor-pointer">
                MEMEOLOGÍA
              </h1>
            </Link>

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

          {isMobileMenuOpen && (
            <div className="fixed top-0 left-0 h-full w-full bg-gray-900 bg-opacity-75 text-white flex flex-col py-6 sm:hidden z-50">
              <button
                className="self-end text-white -mt-4 p-4 rounded-full hover:bg-gray-700 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="flex-1 flex flex-col items-center w-full">
              <Link
              
                href="/"
                className="text-white py-2 px-4 rounded flex items-center w-full mb-2 hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <img src="/icons/home.png" alt="Inicio" className="w-6 h-6 mr-2" />
                Inicio
              </Link>
              {isAuthenticated && (
                <Link
                  href="/perfil"
                  className="text-white py-2 px-4 rounded flex items-center w-full mb-2 hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <img src="/icons/user_bar.png" alt="Perfil" className="w-6 h-6 mr-2" />
                  Perfil
                </Link>
              )}
                
              
              </div>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white py-2 px-4 rounded flex items-center w-full mb-2 hover:bg-red-700"
                >
                  <img src="/icons/logout.png" alt="Cerrar Sesión" className="w-6 h-6 mr-2" />
                  Cerrar Sesión
                </button>   
              )}
            </div>
          )}


          <main className="flex-1 p-8 bg-gray-300 mx-auto rounded-lg shadow-lg m-4 mt-28 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    <LayoutComponent>{children}</LayoutComponent>
  </AuthProvider>
);

export default Layout;
