import { useState } from 'react';
import { 
  Calendar, Gauge, Fuel, Settings, Palette, 
  Mail, Phone, Calculator, 
  Car, RefreshCw, X 
} from 'lucide-react';

import { TestDriveForm } from './TestDriveForm';


interface VehicleDetailsDialogProps {
  vehiculo: any; 
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VehicleDetailsDialog({ vehiculo, open, onOpenChange }: VehicleDetailsDialogProps) {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showTestDrive, setShowTestDrive] = useState(false);
  const valorRetoma = 0;

  // --- EXTRACCIÓN DE DATOS REALES (API NestJS) ---
  const infoVersion = vehiculo?.version;
  const infoModelo = infoVersion?.modelo;
  const infoMarca = infoModelo?.marca;
  const precioBase = Number(vehiculo?.precio_final || 0);

  const precioConRetoma = valorRetoma > 0 ? precioBase - valorRetoma : precioBase;

  if (!open) return null;

  return (
    <>
      {/* Overlay con desenfoque (Figma Style) */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialogo Principal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-4 border-slate-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con estilo Concesionaria */}
          <div className="sticky top-0 bg-gradient-to-r from-slate-900 via-black to-slate-900 text-white p-6 border-b-4 border-red-600 flex items-start justify-between z-10">
            <div>
              <h2 className="text-3xl font-bold mb-1">
                {infoMarca?.nombre} {infoModelo?.nombre} {infoVersion?.anio}
              </h2>
              <p className="text-red-300 font-medium">Ficha técnica oficial - YEC Motors</p>
            </div>
            <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Imagen Principal */}
            <div className="relative overflow-hidden rounded-lg aspect-video bg-slate-200 border-2 border-slate-300 shadow-inner">
            </div>

            {/* Badges de Estado */}
            <div className="flex items-center gap-2">
              <span className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-full shadow-lg">
                {infoVersion?.motor}
              </span>
              {vehiculo.estado === 'disponible' && (
                <span className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg">
                  Disponible
                </span>
              )}
            </div>

            {/* Sección de Precio */}
            <div className="bg-gradient-to-r from-red-50 to-slate-50 p-6 rounded-xl border-2 border-red-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Cotización Actual</h3>
              {valorRetoma > 0 && (
                <div className="mb-2">
                  <p className="text-lg text-slate-500 line-through font-medium">${precioBase.toLocaleString()}</p>
                  <div className="flex items-center gap-2 text-sm text-green-600 mb-2 font-bold">
                    <RefreshCw className="w-4 h-4" />
                    <span>Descuento por retoma: -${valorRetoma.toLocaleString()}</span>
                  </div>
                </div>
              )}
              <p className="text-4xl font-bold text-red-600">${precioConRetoma.toLocaleString()}</p>
            </div>

            {/* Especificaciones Técnicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SpecItem icon={<Calendar />} label="Año" value={infoVersion?.anio} />
              <SpecItem icon={<Gauge />} label="Kilometraje" value={`${vehiculo.kilometraje || 0} km`} />
              <SpecItem icon={<Fuel />} label="Combustible" value={infoVersion?.combustible || 'Gasolina'} />
              <SpecItem icon={<Settings />} label="Transmisión" value={infoVersion?.transmision || 'Automática'} />
              <SpecItem icon={<Palette />} label="Color" value={vehiculo.color} />
            </div>

            {/* Botones de Acción Estilo Figma */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t-2 border-slate-300">
              <ActionButton icon={<Car />} label="Agendar Test Drive" primary onClick={() => setShowTestDrive(!showTestDrive)} />
              <ActionButton icon={<Calculator />} label="Calcular Financiamiento" onClick={() => setShowCalculator(!showCalculator)} />
            </div>

            {/* Formulario de Test Drive */}
            {showTestDrive && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
                <TestDriveForm vehiculo={vehiculo} />
              </div>
            )}

            {/* Contacto Rápido */}
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" /> Llamar
              </button>
              <button className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" /> Enviar Mensaje
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Componentes auxiliares para mantener el código limpio
const SpecItem = ({ icon, label, value }: { icon: any, label: string, value: any }) => (
  <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-lg border-2 border-slate-200">
    <div className="text-red-600">{icon}</div>
    <div>
      <p className="text-sm text-slate-600 font-semibold">{label}</p>
      <p className="text-slate-900 font-bold">{value}</p>
    </div>
  </div>
);

const ActionButton = ({ icon, label, primary, onClick }: { icon: any, label: string, primary?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-3 rounded-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
      primary ? 'bg-red-600 text-white hover:bg-red-700' : 'border-2 border-slate-300 text-slate-700 hover:bg-slate-50'
    }`}
  >
    {icon} {label}
  </button>
);