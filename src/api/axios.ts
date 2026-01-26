import axios from "axios";

const api = axios.create({
  baseURL: "https://yec-concesionaria-api.desarrollo-software.xyz", // Cambia esto al puerto de tu backend local
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;






