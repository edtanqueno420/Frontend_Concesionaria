import api from "../api/axios";

// Interfaz para el usuario (ajusta según tu backend)
export interface User {
  id?: number;
  nombre: string;
  email: string;
  rol: 'cliente' | 'vendedor' | 'administrador';
  cedula?: string;
  telefono?: string;
  direccion?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Petición de Inicio de Sesión
export const loginRequest = async (credentials: any): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// Petición de Registro
export const registerRequest = async (userData: any): Promise<User> => {
  // Enviamos los datos al endpoint de tu backend
  const response = await api.post("/auth/register", userData);
  return response.data;
};