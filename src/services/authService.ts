import api from "../api/axios"; // Importamos tu configuración de Axios

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    nombre: string;
    email: string;
    rol: 'cliente' | 'vendedor' | 'administrador';
  };
}

export const loginRequest = async (credentials: any): Promise<LoginResponse> => {
  // Usamos la instancia 'api' que ya tiene la URL base y los interceptores
  const response = await api.post("/auth/login", credentials);
  return response.data;
};