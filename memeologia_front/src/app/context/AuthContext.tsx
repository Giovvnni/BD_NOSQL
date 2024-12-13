"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  usuarioId: string | null;
  login: (token: string, usuarioId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  const login = (token: string, usuarioId: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuarioId", usuarioId);
    setToken(token);
    setUsuarioId(usuarioId);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioId");
    setToken(null);
    setUsuarioId(null);
    setIsAuthenticated(false);
  };

  const checkAuthentication = () => {
    const storedToken = localStorage.getItem("token");
    const storedUsuarioId = localStorage.getItem("usuarioId");
    setIsAuthenticated(!!storedToken);
    setToken(storedToken);
    setUsuarioId(storedUsuarioId);
  };

  useEffect(() => {
    checkAuthentication();

    // Escuchar cambios en localStorage cuando el token o usuarioId cambien
    const handleStorageChange = () => checkAuthentication();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, usuarioId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
