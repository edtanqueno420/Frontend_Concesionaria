import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getVehicleById } from '../services/vehicleService';
import { TestDriveForm } from '../components/TestDriveForm';
//import type { Vehiculo } from '../types';

export function TestDrivePage() {
  const { id } = useParams();
  const [vehiculo, setVehiculo] = useState<any| null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehiculo() {
      try {
        if (!id) return;
        const data = await getVehicleById(Number(id));
        setVehiculo(data);
      } catch (error) {
        console.error('Error cargando vehículo', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVehiculo();
  }, [id]);

  if (loading) {
    return <p className="text-center py-20">Cargando...</p>;
  }

  if (!vehiculo) {
    return <p className="text-center py-20">Vehículo no encontrado</p>;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <TestDriveForm vehiculo={vehiculo} />
    </div>
  );
}
