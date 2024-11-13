"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Estados para los requisitos de la contraseña
  const [isLongEnough, setIsLongEnough] = useState<boolean>(false);
  const [hasUpperCase, setHasUpperCase] = useState<boolean>(false);
  const [hasNumber, setHasNumber] = useState<boolean>(false);

  const handleRegister = async () => {
    // Validar que las contraseñas coinciden
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Validar la contraseña
    if (!validatePassword(password)) {
      setError("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
      return;
    }

    try {
      // Enviar la solicitud de registro al backend de FastAPI
      const response = await fetch("http://localhost:8000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: username,
          email: email,
          contraseña: password,
        }),
      });

      if (response.ok) {
        // Si el registro es exitoso, redirigir a la página principal
        router.push("/");
      } else {
        // Si la respuesta no es ok, mostrar el error
        const errorData = await response.json();
        setError(errorData.detail || "Error en el registro");
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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Registro</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        
        {/* Re quisitos de la contraseña */}
        <div className="mb-4 text-gray-600">
          <p className="text-sm">La contraseña debe cumplir con los siguientes requisitos:</p>
          <ul className="list-disc list-inside text-sm">
            <li className={isLongEnough ? "text-green-500" : "text-red-500"}>
              Al menos 8 caracteres
            </li>
            <li className={hasUpperCase ? "text-green-500" : "text-red-500"}>
              Al menos 1 mayúscula
            </li>
            <li className={hasNumber ? "text-green-500" : "text-red-500"}>
              Al menos 1 número
            </li>
          </ul>
        </div>

        <button
          onClick={handleRegister}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Registrarse
        </button>
        <p className="text-center text-gray-600 mt-4">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Inicia Sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
