import api from '../api/axios';
import type { Vehiculo } from '../types';

export const getVehicles = async (): Promise<Vehiculo[]> => {
  const res = await api.get('/vehiculos'); // Endpoint en tu backend
  return res.data;
};
