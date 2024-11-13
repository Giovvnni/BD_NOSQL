"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null); // Para manejar errores
  const [isLoading, setIsLoading] = useState(false); // Para mostrar un indicador de carga

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpiar error previo
    setIsLoading(true); // Activar el estado de carga

    const requestBody = {
      email: email,
      contraseña: password,
    };

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login exitoso:", data);
        router.push("/");
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          // Error de autenticación (usuario/contraseña incorrecta)
          setError("Usuario y/o contraseña incorrecta");
        } else {
          // Otro tipo de error
          setError(errorData.detail || "Error desconocido en el inicio de sesión");
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Error de conexión al servidor");
    } finally {
      setIsLoading(false); // Desactivar el estado de carga
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-8 text-gray-500 hover:text-gray-700"
              aria-label="Toggle password visibility"
            >
              {isPasswordVisible ? "🙈" : "👁️"}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>} {/* Mostrar error si hay */}
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading} // Deshabilitar botón mientras carga
          >
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link href="/registro" className="text-blue-500 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
