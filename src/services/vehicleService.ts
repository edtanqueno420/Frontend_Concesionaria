import axios from 'axios';
import type { Vehiculo } from '../types';

const API_URL = 'http://localhost:3000';

export const vehicleService = {
  getAll: async (): Promise<Vehiculo[]> => {
    const res = await axios.get(`${API_URL}/vehiculos`);
    return res.data;
  },

  // Obtener vehículo por ID
  getById: async (id: number): Promise<Vehiculo> => {
    const res = await axios.get(`${API_URL}/vehiculos/${id}`);
    return res.data;
  },

  // Crear nuevo vehículo
  create: async (data: Omit<Vehiculo, 'id'>): Promise<Vehiculo> => {
    const res = await axios.post(`${API_URL}/vehiculos`, data);
    return res.data;
  },

  // Eliminar vehículo
  delete: async (id: number) => {
    await axios.delete(`${API_URL}/vehiculos/${id}`);
  },

  // Cambiar estado (Disponible/Vendido)
  updateStatus: async (id: number, nuevoEstado: string): Promise<Vehiculo> => {
    const res = await axios.patch(`${API_URL}/vehiculos/${id}`, { estado: nuevoEstado });
    return res.data;
  }
};

// Exportar la función getVehicleById para compatibilidad con el import existente
export const getVehicleById = vehicleService.getById;