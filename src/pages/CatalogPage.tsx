import { useEffect, useState, useMemo } from 'react';
import type { Vehiculo } from '../types';
import { vehicleService } from '../services/vehicleService';
import { VehicleGrid } from '../components/VehicleGrid';
import { Search, Filter, RotateCcw } from 'lucide-react';

export function CatalogPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarca, setSelectedMarca] = useState('Todas');
  const [maxPrice, setMaxPrice] = useState(200000);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    vehicleService.getAll()
      .then(data => {
        setVehiculos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar el catálogo:", err);
        setLoading(false);
      });
  }, []);

  // LÓGICA DE FILTRADO 
  const vehiculosFiltrados = useMemo(() => {
    return vehiculos.filter(v => {
      const matchSearch = (v.version?.modelo?.nombre + v.version?.modelo?.marca?.nombre)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      const matchMarca = selectedMarca === 'Todas' || v.version?.modelo?.marca?.nombre === selectedMarca;
      
      const matchPrecio = Number(v.precio_final) <= maxPrice;

      return matchSearch && matchMarca && matchPrecio;
    });
  }, [vehiculos, searchTerm, selectedMarca, maxPrice]);

  // Obtener marcas únicas para el filtro
  const marcasDisponibles = ['Todas', ...new Set(vehiculos.map(v => v.version?.modelo?.marca?.nombre))];

  if (loading) return <div className="p-20 text-center animate-pulse font-black text-2xl">Cargando inventario real...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header del Catálogo */}
      <header className="bg-slate-900 text-white py-16 px-6 border-b-8 border-red-600">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-black mb-4 italic">CATÁLOGO PREMIUM</h1>
          <p className="text-red-300 text-lg font-medium">Explora nuestra selección exclusiva de vehículos garantizados.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 -mt-10">
        {/* Barra de Búsqueda y Filtros Rápidos */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-10 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            
            {/* Buscador */}
            <div className="md:col-span-1">
              <label className="block text-xs font-black text-slate-400 uppercase mb-2">¿Qué auto buscas?</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input 
                  type="text"
                  placeholder="Ej: BMW M4..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-red-600 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filtro Marca */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2">Marca</label>
              <select 
                className="w-full p-3 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-red-600 font-bold"
                value={selectedMarca}
                onChange={(e) => setSelectedMarca(e.target.value)}
              >
                {marcasDisponibles.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Filtro Precio */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2">Precio Máximo: ${maxPrice.toLocaleString()}</label>
              <input 
                type="range"
                min="10000"
                max="300000"
                step="5000"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </div>

            {/* Botón Reset */}
            <button 
              onClick={() => {setSearchTerm(''); setSelectedMarca('Todas'); setMaxPrice(300000);}}
              className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
            >
              <RotateCcw className="w-5 h-5" /> Limpiar
            </button>
          </div>
        </div>

        {/* Resultados */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-slate-500 font-bold">
            Mostrando <span className="text-red-600">{vehiculosFiltrados.length}</span> vehículos disponibles
          </p>
          <div className="flex gap-2">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-white text-slate-400'}`}>
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grid Real conectado a los filtros */}
        <VehicleGrid 
          vehiculos={vehiculosFiltrados}
          viewMode={viewMode}
          compareList={[]}
          toggleCompare={() => {}}
        />
      </main>
    </div>
  );
}