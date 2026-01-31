import axios from 'axios';

const API_URL = 'https://yec-concesionario-api.desarrollo-software.xyz/solicitudes';

export const solicitudService = {
  // 1. El cliente envía su propuesta
  crear: async (data: any) => {
    const token = localStorage.getItem('token');
    const res = await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },
  // 2. El admin ve todas las propuestas
  obtenerTodas: async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },
  // 3. El admin cambia el estado (Aceptada/Rechazada)
  cambiarEstado: async (id: string, nuevoEstado: string) => {
    const token = localStorage.getItem('token');
    const res = await axios.put(`${API_URL}/${id}/estado/${nuevoEstado}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
};