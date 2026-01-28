import api from '../api/axios';
import type { Vehiculo } from '../types';

export const getVehicles = async (): Promise<Vehiculo[]> => {
  const res = await api.get('/vehiculos');
  return res.data;
};

// 🔥 NUEVA FUNCIÓN
export const getVehicleById = async (id: number): Promise<Vehiculo> => {
  const res = await api.get(`/vehiculos/${id}`);
  return res.data;
};
