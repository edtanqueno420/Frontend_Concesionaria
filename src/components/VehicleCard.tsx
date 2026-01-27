import type { Vehiculo } from '../types';

interface VehicleCardProps {
  vehiculo: Vehiculo;
}

export function VehicleCard({ vehiculo }: VehicleCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition">
      <h3 className="font-bold">{vehiculo.version.modelo.marca.nombre} {vehiculo.version.modelo.nombre}</h3>
      <p className="text-sm">Versión: {vehiculo.version.nombre}</p>
      <p className="text-sm">Color: {vehiculo.color}</p>
      <p className="text-sm">Precio: ${vehiculo.precio_final}</p>
      <div className="mt-2">
        <span className="font-bold text-sm">Características:</span>
        <ul className="list-disc list-inside text-xs">
          {vehiculo.version.caracteristicas.map(c => (
            <li key={c.id}>{c.nombre}: {c.valor}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
