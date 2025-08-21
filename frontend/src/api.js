import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// ¡ESTA ES LA PARTE CLAVE!
// Este interceptor se ejecuta antes de cada petición.
api.interceptors.request.use(
  (config) => {
    // Busca los tokens guardados en el sessionStorage.
    const tokenData = JSON.parse(sessionStorage.getItem("authTokens"));

    // Si existen, añade el token de acceso a la cabecera 'Authorization'.
    if (tokenData) {
      config.headers["Authorization"] = "Bearer " + tokenData.access;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
