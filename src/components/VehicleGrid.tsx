import { useRef } from 'react';
import type { Vehiculo } from '../types'; 
import { VehicleCard } from './VehicleCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VehicleGridProps {
  vehiculos: Vehiculo[];
  compareList: number[]; 
  toggleCompare: (id: number) => void;
  viewMode: 'grid' | 'list';
  onStartSale?: (vehicle: Vehiculo) => void;
}

export function VehicleGrid({ vehiculos, compareList, toggleCompare, viewMode, onStartSale }: VehicleGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Función para el desplazamiento horizontal (Figma Style)
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (vehiculos.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 text-lg font-medium">No se encontraron vehículos en el inventario.</p>
      </div>
    );
  }

  // --- MODO LISTA (Vertical) ---
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-6 px-4">
        {vehiculos.map((vehiculo) => (
          <VehicleCard 
            key={vehiculo.id}
            vehiculo={vehiculo} 
            isComparing={compareList.includes(vehiculo.id)}
            onToggleCompare={() => toggleCompare(vehiculo.id)}
            canAddToCompare={compareList.length < 3 || compareList.includes(vehiculo.id)}
            viewMode={viewMode}
            onStartSale={onStartSale}
          />
        ))}
      </div>
    );
  }

  //MODO GRID 
  return (
    <div className="relative group px-4">
      {/* Flecha Izquierda */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-2xl border-2 border-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6 text-red-600" />
      </button>

      {/* Flecha Derecha */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-2xl border-2 border-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6 text-red-600" />
      </button>

      {/* Contenedor con scroll oculto */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 pt-2"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {vehiculos.map((vehiculo) => (
          <div key={vehiculo.id} className="flex-shrink-0 w-80 snap-start">
            <VehicleCard 
              vehiculo={vehiculo} 
              isComparing={compareList.includes(vehiculo.id)}
              onToggleCompare={() => toggleCompare(vehiculo.id)}
              canAddToCompare={compareList.length < 3 || compareList.includes(vehiculo.id)}
              viewMode="grid"
              onStartSale={onStartSale}
            />
          </div>
        ))}
      </div>
    </div>
  );
}