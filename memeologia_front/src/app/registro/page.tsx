"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // Importa el contexto de autenticación

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth(); // Obtén la función login del contexto
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [isLongEnough, setIsLongEnough] = useState<boolean>(false);
  const [hasUpperCase, setHasUpperCase] = useState<boolean>(false);
  const [hasNumber, setHasNumber] = useState<boolean>(false);

  const handleRegister = async () => {
    // Verifica si las contraseñas coinciden
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
  
    // Valida la contraseña
    if (!validatePassword(password)) {
      setError("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
      return;
    }
  
    try {
      const requestBody = {
        nombre: username,
        email: email,
        contraseña: password,
      };
  

  
      const response = await fetch("http://200.104.72.42:8000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        const data = await response.json();
        login(data.token, String(data.id)); // Convierte el id a string
        router.push("/");
      } else {
        const errorData = await response.json();
  
        // Si errorData.detail es un array, mostramos todos los mensajes de error
        if (Array.isArray(errorData.detail)) {
          // Extraemos solo los mensajes (msg) y los unimos en una cadena
          setError(errorData.detail.map((error: { msg: string }) => error.msg).join(", "));
        } else {
          // Si no es un array, mostramos el mensaje directamente
          setError(errorData.detail || "Error en el registro");
        }
      }
    } catch (err) {
      console.error("Error al registrar:", err);
      setError("Error de conexión al servidor");
    }
  };
  

  const validatePassword = (password: string): boolean => {
    const longEnough = password.length >= 8;
    const upperCase = /[A-Z]/.test(password);
    const number = /\d/.test(password);

    setIsLongEnough(longEnough);
    setHasUpperCase(upperCase);
    setHasNumber(number);

    return longEnough && upperCase && number;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md sm:w-96">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Registro</h2>
      
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
      />
      
      <input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
      />
      
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          validatePassword(e.target.value);
        }}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
      />
      
      <input
        type="password"
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
      />
      
      <div className="mb-6 text-gray-600">
        <p className="text-sm">La contraseña debe cumplir con los siguientes requisitos:</p>
        <ul className="list-disc list-inside text-sm">
          <li className={isLongEnough ? "text-green-500" : "text-red-500"}>Al menos 8 caracteres</li>
          <li className={hasUpperCase ? "text-green-500" : "text-red-500"}>Al menos 1 mayúscula</li>
          <li className={hasNumber ? "text-green-500" : "text-red-500"}>Al menos 1 número</li>
        </ul>
      </div>
      
      <button
        onClick={handleRegister}
        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition duration-200"
      >
        Registrarse
      </button>
    </div>
  </div>

  );
};

export default RegisterPage;
