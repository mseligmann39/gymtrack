// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  // CAMBIO 1: Leer de sessionStorage al iniciar
  const [authTokens, setAuthTokens] = useState(() =>
    sessionStorage.getItem("authTokens")
      ? JSON.parse(sessionStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    sessionStorage.getItem("authTokens")
      ? jwtDecode(sessionStorage.getItem("authTokens"))
      : null
  );
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: e.target.username.value,
          password: e.target.password.value,
        }),
      });
      const data = await response.json();

      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        // CAMBIO 2: Guardar en sessionStorage
        sessionStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/");
      } else {
        alert("¡Algo salió mal! Verifica tu usuario y contraseña.");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      alert("Ocurrió un error al intentar iniciar sesión.");
    }
  };

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: e.target.username.value,
          password: e.target.password.value,
        }),
      });
      if (response.status === 201) {
        navigate("/login");
        alert("¡Usuario registrado con éxito! Por favor, inicia sesión.");
      } else {
        // ¡MEJORA! Lee el error del backend y lo muestra de forma clara.
        const data = await response.json();
        if (data.username) {
          alert(`Error: ${data.username[0]}`);
        } else {
          alert(`Error: ${JSON.stringify(data)}`);
        }
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Ocurrió un error al intentar registrarse.");
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    // CAMBIO 3: Eliminar de sessionStorage
    sessionStorage.removeItem("authTokens");
    navigate("/login");
  };

  const contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    registerUser: registerUser,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
