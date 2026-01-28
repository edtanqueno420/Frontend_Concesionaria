import { useEffect, useState } from "react";
import { getVehicles } from "../services/vehicleService";
//import type { Vehiculo } from "../types";
import { Car } from "lucide-react";

export function CatalogPage() {
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const data = await getVehicles();
        setVehiculos(data);
      } catch (error) {
        console.error("Error cargando catálogo", error);
      }
    }
    fetchVehicles();
  }, []);

  const vehiculosFiltrados = vehiculos.filter((v) =>
    busqueda === "" ||
    v.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.modelo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Car className="w-10 h-10 text-red-600" />
          <h1 className="text-4xl font-bold text-slate-900">
            Catálogo Completo
          </h1>
        </div>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Explora nuestro catálogo completo y encuentra el vehículo ideal para ti
        </p>
      </div>

      {/* BUSCADOR SIMPLE */}
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Buscar por marca o modelo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* CONTADOR */}
      <p className="text-center text-slate-600 mb-6">
        Mostrando{" "}
        <span className="font-semibold text-slate-900">
          {vehiculosFiltrados.length}
        </span>{" "}
        vehículo{vehiculosFiltrados.length !== 1 ? "s" : ""}
      </p>

      {/* LISTA TEMPORAL (SIN IMÁGENES) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehiculosFiltrados.map((v) => (
          <div
            key={v.id}
            className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {v.marca} {v.modelo}
            </h3>

            <p className="text-slate-600">Tipo: {v.tipo}</p>

            <p className="text-red-600 font-bold text-lg mt-2">
              ${v.precio.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* ESTADO VACÍO */}
      {vehiculosFiltrados.length === 0 && (
        <p className="text-center text-slate-500 mt-10">
          No se encontraron vehículos
        </p>
      )}
    </div>
  );
}
