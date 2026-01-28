import axios from 'axios';

export const createTestDrive = async (data: {
  vehiculoId: number;
  nombre: string;
  email: string;
  telefono: string;
  fecha: string;
  hora: string;
}) => {
  const response = await axios.post(
    'http://localhost:3000/test-drives',
    data
  );
  return response.data;
};
