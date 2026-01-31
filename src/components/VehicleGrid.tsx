import type { Vehiculo } from "../types";
import { VehicleCard } from "./VehicleCard";

interface VehicleGridProps {
  vehiculos: Vehiculo[];
  compareList: number[];
  toggleCompare: (id: number) => void;
  viewMode: "grid" | "list";
  onStartSale?: (vehicle: Vehiculo) => void;
}

export function VehicleGrid({
  vehiculos,
  compareList,
  toggleCompare,
  viewMode,
  onStartSale,
}: VehicleGridProps) {
  if (vehiculos.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 text-lg font-medium">
          No se encontraron vehículos en el inventario.
        </p>
      </div>
    );
  }

  // --- MODO LISTA (Vertical) ---
  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-6 px-4">
        {vehiculos.map((vehiculo) => (
          <VehicleCard
            key={vehiculo.id}
            vehiculo={vehiculo}
            isComparing={compareList.includes(vehiculo.id)}
            onToggleCompare={() => toggleCompare(vehiculo.id)}
            canAddToCompare={
              compareList.length < 3 || compareList.includes(vehiculo.id)
            }
            viewMode={viewMode}
            onStartSale={onStartSale}
            compareList={compareList}
          />
        ))}
      </div>
    );
  }

  // --- MODO GRID (SIN SCROLL) ---
  return (
    <div className="px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vehiculos.map((vehiculo) => (
          <VehicleCard
            key={vehiculo.id}
            vehiculo={vehiculo}
            isComparing={compareList.includes(vehiculo.id)}
            onToggleCompare={() => toggleCompare(vehiculo.id)}
            canAddToCompare={
              compareList.length < 3 || compareList.includes(vehiculo.id)
            }
            viewMode="grid"
            onStartSale={onStartSale}
            compareList={compareList}
          />
        ))}
      </div>
    </div>
  );
}
