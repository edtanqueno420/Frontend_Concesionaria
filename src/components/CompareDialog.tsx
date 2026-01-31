import { useState } from 'react';
import { X, GitCompare, Calendar, Gauge, Fuel, Settings, Palette, DollarSign } from 'lucide-react';

interface CompareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  compareList: number[];
  vehicles: any[];
}

export function CompareDialog({ open, onOpenChange, compareList, vehicles }: CompareDialogProps) {
  if (!open) return null;

  // Filtrar vehículos seleccionados
  const selectedVehicles = vehicles.filter(v => compareList.includes(v.id));

  if (selectedVehicles.length < 2) {
    return (
      <>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" onClick={() => onOpenChange(false)} />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border-4 border-slate-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Comparación</h3>
              <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-600">Selecciona al menos 2 vehículos para comparar.</p>
          </div>
        </div>
      </>
    );
  }

  const getVehicleInfo = (vehiculo: any) => {
    const infoVersion = vehiculo?.version;
    const infoModelo = infoVersion?.modelo;
    const infoMarca = infoModelo?.marca;
    
    return {
      name: `${infoMarca?.nombre} ${infoModelo?.nombre} ${infoVersion?.anio}`,
      price: Number(vehiculo?.precio_final || 0),
      year: infoVersion?.anio || '—',
      mileage: `${vehiculo.kilometraje || 0} km`,
      fuel: infoVersion?.combustible || 'Gasolina',
      transmission: infoVersion?.transmision || 'Automática',
      color: vehiculo.color || '—',
      motor: infoVersion?.motor || '—',
      image: vehiculo?.imagenUrl || null
    };
  };

  const specs = [
    { key: 'price', label: 'Precio', icon: <DollarSign className="w-4 h-4" />, format: (value: number) => `$${value.toLocaleString()}` },
    { key: 'year', label: 'Año', icon: <Calendar className="w-4 h-4" /> },
    { key: 'mileage', label: 'Kilometraje', icon: <Gauge className="w-4 h-4" /> },
    { key: 'fuel', label: 'Combustible', icon: <Fuel className="w-4 h-4" /> },
    { key: 'transmission', label: 'Transmisión', icon: <Settings className="w-4 h-4" /> },
    { key: 'color', label: 'Color', icon: <Palette className="w-4 h-4" /> },
    { key: 'motor', label: 'Motor', icon: <GitCompare className="w-4 h-4" /> }
  ];

  const getBestValue = (key: string, values: any[]) => {
    if (key === 'price') {
      const minValue = Math.min(...values.filter(v => typeof v === 'number'));
      return values.map(v => v === minValue ? 'best' : '');
    }
    return values.map(() => '');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" onClick={() => onOpenChange(false)} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto border-4 border-slate-300">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-slate-900 via-black to-slate-900 text-white p-6 border-b-4 border-red-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GitCompare className="w-8 h-8 text-red-400" />
                <div>
                  <h2 className="text-3xl font-bold">Comparación de Vehículos</h2>
                  <p className="text-red-300">Análisis detallado de {selectedVehicles.length} vehículos</p>
                </div>
              </div>
              <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Headers de vehículos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {selectedVehicles.map((vehicle, index) => {
                const info = getVehicleInfo(vehicle);
                return (
                  <div key={vehicle.id} className="text-center">
                    <div className="relative overflow-hidden rounded-lg aspect-video bg-slate-200 border-2 border-slate-300 mb-4">
                      {info.image ? (
                        <img
                          src={info.image}
                          alt={info.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">
                          <GitCompare className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{info.name}</h3>
                    <p className="text-2xl font-bold text-red-600">{info.price ? `$${info.price.toLocaleString()}` : 'Precio no disponible'}</p>
                  </div>
                );
              })}
            </div>

            {/* Tabla de especificaciones */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="text-left p-4 font-bold text-slate-900 border-2 border-slate-300">Característica</th>
                    {selectedVehicles.map((vehicle) => {
                      const info = getVehicleInfo(vehicle);
                      return (
                        <th key={vehicle.id} className="text-center p-4 font-bold text-slate-900 border-2 border-slate-300">
                          {info.name.split(' ')[0]} {/* Marca */}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {specs.map((spec) => {
                    const values = selectedVehicles.map(v => {
                      const info = getVehicleInfo(v);
                      return info[spec.key as keyof typeof info];
                    });
                    const bestValues = getBestValue(spec.key, values);

                    return (
                      <tr key={spec.key} className="hover:bg-slate-50">
                        <td className="p-4 font-semibold text-slate-700 border-2 border-slate-300">
                          <div className="flex items-center gap-2">
                            <div className="text-red-600">{spec.icon}</div>
                            {spec.label}
                          </div>
                        </td>
                        {values.map((value, index) => (
                          <td key={index} className={`p-4 text-center border-2 border-slate-300 ${bestValues[index] === 'best' ? 'bg-green-100 font-bold text-green-800' : ''}`}>
                            {typeof value === 'number' && spec.format ? spec.format(value) : value}
                            {bestValues[index] === 'best' && (
                              <div className="text-xs text-green-600 mt-1">Mejor opción</div>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Resumen y recomendación */}
            <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-slate-50 rounded-xl border-2 border-red-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">🏆 Análisis y Recomendación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Mejor Precio:</h4>
                  <p className="text-slate-600">
                    {(() => {
                      const prices = selectedVehicles.map(v => getVehicleInfo(v).price).filter(p => p > 0);
                      if (prices.length === 0) return 'No hay precios disponibles';
                      const minPrice = Math.min(...prices);
                      const bestVehicle = selectedVehicles.find(v => getVehicleInfo(v).price === minPrice);
                      return bestVehicle ? getVehicleInfo(bestVehicle).name : '—';
                    })()}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Más Reciente:</h4>
                  <p className="text-slate-600">
                    {(() => {
                      const newest = selectedVehicles.reduce((best, current) => {
                        const bestYear = parseInt(getVehicleInfo(best).year) || 0;
                        const currentYear = parseInt(getVehicleInfo(current).year) || 0;
                        return currentYear > bestYear ? current : best;
                      });
                      return getVehicleInfo(newest).name;
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
