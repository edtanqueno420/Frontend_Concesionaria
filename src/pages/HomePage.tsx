import { useEffect, useState } from "react";
import { VehicleCard } from "../components/VehicleCard";
import { vehicleService } from "../services/vehicleService";
import { TrendingUp, Search, Award, Shield, Users } from "lucide-react";
import type { Vehiculo } from "../types";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import edificio from "../assets/edificio.png";

export function HomePage() {
  const navigate = useNavigate();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const data = await vehicleService.getAll();
        setVehiculos(data);
      } catch (err) {
        console.error("Error cargando vehículos", err);
      }
    }
    fetchVehicles();
  }, []);

  const masVendidos = vehiculos.slice(0, 3);
  const masBuscados = vehiculos.slice(3, 6);

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section
        className="relative min-h-[520px] text-white rounded-2xl overflow-hidden border-4 border-red-600 bg-no-repeat"
        style={{
          backgroundImage: `url(${edificio})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay (más suave para que se vea la foto) */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative px-8 py-20 md:py-28 text-center">
          <h1 className="text-white mb-6 max-w-3xl mx-auto text-5xl font-bold">
            Tu Mejor Opción en Vehículos de Calidad
          </h1>

          <p className="text-xl text-red-300 mb-8 max-w-2xl mx-auto font-medium">
            Encuentra el vehículo perfecto para ti con las mejores opciones de financiamiento en Ecuador
          </p>

          {/* BOTONES */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8"
              onClick={() => navigate("/catalogo")}
            >
              Catálogo Completo
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-red-600 text-white px-8 hover:bg-red-700"
              onClick={() => navigate("/vehiculo/1/test-drive")}
            >
              Test Drive
            </Button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow border-2 border-slate-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Award className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-2">+15 Años</h3>
          <p className="text-slate-600 font-medium">De experiencia en el mercado</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow border-2 border-slate-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-2">+5,000</h3>
          <p className="text-slate-600 font-medium">Clientes satisfechos</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow border-2 border-slate-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-2">Garantía</h3>
          <p className="text-slate-600 font-medium">En todos nuestros vehículos</p>
        </div>
      </section>

      {/* MÁS VENDIDOS */}
      <section>
        <h2 className="text-4xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-red-600" />
          Más Vendidos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masVendidos.map((v) => (
            <VehicleCard 
              key={v.id} 
              vehiculo={v} 
              isComparing={false}
              onToggleCompare={() => {}}
              canAddToCompare={false}
              viewMode="grid"
            />
          ))}
        </div>
      </section>

      {/* MÁS BUSCADOS */}
      <section>
        <h2 className="text-4xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Search className="w-8 h-8 text-red-600" />
          Más Buscados
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masBuscados.map((v) => (
            <VehicleCard 
              key={v.id} 
              vehiculo={v} 
              isComparing={false}
              onToggleCompare={() => {}}
              canAddToCompare={false}
              viewMode="grid"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
