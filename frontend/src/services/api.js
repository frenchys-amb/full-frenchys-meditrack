import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 🔹 Interceptor para añadir el token en cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Interceptor para manejar tokens expirados (refresh automático)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Evitar loop infinito si falla el refresh
    if (originalRequest.url.includes("token/refresh/")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await api.post("token/refresh/", { refresh: refreshToken });
          localStorage.setItem("accessToken", res.data.access);

          // Reintenta la solicitud original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return api.request(originalRequest);
        } catch (refreshError) {
          console.error("El token ha expirado o no es válido.");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
