import { useEffect, useState } from 'react';
import { VehicleCard } from '../components/VehicleCard';
//import { YECLogo } from '../components/YECLogo';
import { getVehicles } from '../services/vehicleService';
import { TrendingUp, Search, Award, Shield, Users } from 'lucide-react';
import type { Vehiculo } from '../types';
//import { useNavigate } from 'react-router-dom';

export function HomePage() {
  //const navigate = useNavigate();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const data = await getVehicles();
        setVehiculos(data);
      } catch (err) {
        console.error('Error cargando vehículos', err);
      }
    }
    fetchVehicles();
  }, []);

  const masVendidos = vehiculos.slice(0, 3);
  const masBuscados = vehiculos.slice(3, 6);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white rounded-2xl overflow-hidden border-4 border-red-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-3 mb-6 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-red-500">
            <div className="bg-white rounded-lg p-1">
              {/*<YECLogo className="w-8 h-8" />*/}
            </div>
            <span className="font-bold text-lg text-white">YEC MOTORS</span>
          </div>
          <h1 className="text-white mb-6 max-w-3xl mx-auto text-5xl font-bold">
            Tu Mejor Opción en Vehículos de Calidad
          </h1>
          <p className="text-xl text-red-300 mb-8 max-w-2xl mx-auto font-medium">
            Encuentra el vehículo perfecto para ti con las mejores opciones de financiamiento en Ecuador
          </p>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* Más Vendidos */}
      <section>
        <h2 className="text-4xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-red-600" /> Más Vendidos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masVendidos.map((v) => (
            <VehicleCard key={v.id} vehiculo={v} />
          ))}
        </div>
      </section>

      {/* Más Buscados */}
      <section>
        <h2 className="text-4xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Search className="w-8 h-8 text-red-600" /> Más Buscados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masBuscados.map((v) => (
            <VehicleCard key={v.id} vehiculo={v} />
          ))}
        </div>
      </section>
    </div>
  );
}
