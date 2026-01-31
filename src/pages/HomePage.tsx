import { useEffect, useState } from "react";
import { VehicleCard } from "../components/VehicleCard";
import { TrendingUp, Search, Award, Shield, Users } from "lucide-react";
import type { Vehiculo } from "../types";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import edificio from "../assets/edificio.png";
import { getGalerias } from "../services/galeriaService";

export function HomePage() {
  const navigate = useNavigate();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const galerias = await getGalerias();

        const vehiculosConImagen = (galerias ?? [])
          .map((g: any) => {
            const vehiculo = g?.vehiculoData;
            if (!vehiculo) return null;

            const imagenPrincipal =
              g?.imagenes?.find((i: any) => i?.principal)?.url ??
              g?.imagenes?.[0]?.url ??
              null;

            return {
              ...vehiculo,
              imagenUrl: imagenPrincipal,
              imageFocus:
                vehiculo.id === 1 ? "20% 50%" : // Porsche: más a la izquierda
                  vehiculo.id === 2 ? "60% 50%" : // Yaris: más al centro/derecha
                    "50% 55%",
              // ✅ campo extra para la card
            };
          })
          .filter(Boolean);

        setVehiculos(vehiculosConImagen as Vehiculo[]);
      } catch (err) {
        console.error("Error cargando galerías/vehículos", err);
      }
    }

    fetchVehicles();
  }, []);

  const masVendidos = vehiculos.slice(0, Math.min(3, vehiculos.length));
  const masBuscados = vehiculos.slice(Math.min(3, vehiculos.length), Math.min(6, vehiculos.length));

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
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative px-8 py-20 md:py-28 text-center">
          <h1 className="text-white mb-6 max-w-3xl mx-auto text-5xl font-bold">
            Tu Mejor Opción en Vehículos de Calidad
          </h1>

          <p className="text-xl text-red-300 mb-8 max-w-2xl mx-auto font-medium">
            Encuentra el vehículo perfecto para ti con las mejores opciones de
            financiamiento en Ecuador
          </p>

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
          <p className="text-slate-600 font-medium">
            De experiencia en el mercado
          </p>
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
          <p className="text-slate-600 font-medium">
            En todos nuestros vehículos
          </p>
        </div>
      </section>

      {/* MÁS VENDIDOS */}
      <section>
        <h2 className="text-4xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-red-600" />
          Más Vendidos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masVendidos.length > 0 ? (
            masVendidos.map((v: any) => (
              <VehicleCard
                key={v.id}
                vehiculo={v}
                isComparing={false}
                onToggleCompare={() => {}}
                canAddToCompare={false}
                viewMode="grid"
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-slate-500 text-lg">Cargando vehículos disponibles...</p>
            </div>
          )}
        </div>
      </section>

      {/* MÁS BUSCADOS */}
      <section>
        <h2 className="text-4xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Search className="w-8 h-8 text-red-600" />
          Más Buscados
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masBuscados.length > 0 ? (
            masBuscados.map((v: any) => (
              <VehicleCard
                key={v.id}
                vehiculo={v}
                isComparing={false}
                onToggleCompare={() => {}}
                canAddToCompare={false}
                viewMode="grid"
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-slate-500 text-lg">Cargando más vehículos disponibles...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
