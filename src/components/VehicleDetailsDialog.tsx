import { useState } from "react";
import {
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Palette,
  Mail,
  Phone,
  Car,
  X,
} from "lucide-react";

import { TestDriveForm } from "./TestDriveForm";
import { SolicitudForm } from "./SolicitudForm";

interface VehicleDetailsDialogProps {
  vehiculo: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  compareList: number[];
  onToggleCompare: (id: number) => void;
}

export function VehicleDetailsDialog({
  vehiculo,
  open,
  onOpenChange,
}: VehicleDetailsDialogProps) {
  const [showTestDrive, setShowTestDrive] = useState(false);
  const [showSolicitud, setShowSolicitud] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [asesor, setAsesor] = useState<string>("");

  const asesores = [
    "Carlos Mendoza",
    "Andrea López",
    "José Ramírez",
    "María Fernanda",
    "Luis Torres",
  ];

  const telefono = "+593 99 888 7777";

  const handleShowContact = () => {
    const random =
      asesores[Math.floor(Math.random() * asesores.length)];
    setAsesor(random);
    setShowContact((prev) => !prev);
  };

  const infoVersion = vehiculo?.version;
  const infoModelo = infoVersion?.modelo;
  const infoMarca = infoModelo?.marca;

  const precioBase = Number(vehiculo?.precio_final || 0);
  const imagenUrl: string | null = vehiculo?.imagenUrl ?? null;

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={() => onOpenChange(false)}
      />

      {/* Diálogo */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-4 border-slate-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-slate-900 via-black to-slate-900 text-white p-6 border-b-4 border-red-600 flex justify-between z-10">
            <div>
              <h2 className="text-3xl font-bold">
                {infoMarca?.nombre} {infoModelo?.nombre} {infoVersion?.anio}
              </h2>
              <p className="text-red-300 font-medium">
                Ficha técnica oficial - YEC Motors
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Imagen */}
            <div className="relative overflow-hidden rounded-lg aspect-video bg-slate-200 border-2 border-slate-300">
              {imagenUrl ? (
                <>
                  <img
                    src={imagenUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-70"
                  />
                  <img
                    src={imagenUrl}
                    alt="vehiculo"
                    className="absolute inset-0 w-full h-full object-contain p-4"
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                  Sin imagen disponible
                </div>
              )}
            </div>

            {/* Precio */}
            <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200">
              <h3 className="text-xl font-bold mb-2">Cotización Actual</h3>
              <p className="text-4xl font-bold text-red-600">
                ${precioBase.toLocaleString()}
              </p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SpecItem icon={<Calendar />} label="Año" value={infoVersion?.anio} />
              <SpecItem icon={<Gauge />} label="Kilometraje" value={`${vehiculo?.kilometraje ?? 0} km`} />
              <SpecItem icon={<Fuel />} label="Combustible" value={infoVersion?.combustible} />
              <SpecItem icon={<Settings />} label="Transmisión" value={infoVersion?.transmision} />
              <SpecItem icon={<Palette />} label="Color" value={vehiculo?.color} />
            </div>

            {/* Botones principales */}
            <div className="flex justify-center gap-4 pt-4 border-t-2 border-slate-300">
              <ActionButton
                icon={<Car />}
                label="Agendar Test Drive"
                primary
                onClick={() => setShowTestDrive(!showTestDrive)}
              />
              <ActionButton
                icon={<Mail />}
                label="Solicitud"
                onClick={() => setShowSolicitud(!showSolicitud)}
              />
            </div>

            {showTestDrive && (
              <div className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
                <TestDriveForm vehiculo={vehiculo} />
              </div>
            )}

            {showSolicitud && (
              <div className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
                <SolicitudForm vehiculo={vehiculo} />
              </div>
            )}

            {/* ✅ BOTÓN LLAMAR + CUADRO EMERGENTE */}
            <div className="relative flex justify-center pt-2">
              {showContact && (
                <div className="absolute -top-16 bg-white border-2 border-slate-300 shadow-xl rounded-lg px-4 py-2 text-center text-sm z-10">
                  <p className="font-bold text-slate-800">{asesor}</p>
                  <p className="text-slate-600">{telefono}</p>
                </div>
              )}

              <button
                onClick={handleShowContact}
                className="px-6 py-3 border-2 border-slate-300 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-50"
              >
                <Phone className="w-5 h-5" /> Llamar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* Helpers */

const SpecItem = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-lg border-2 border-slate-200">
    <div className="text-red-600">{icon}</div>
    <div>
      <p className="text-sm text-slate-600 font-semibold">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  </div>
);

const ActionButton = ({ icon, label, primary, onClick }: any) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-lg font-bold shadow-lg flex items-center gap-2 ${
      primary
        ? "bg-red-600 text-white hover:bg-red-700"
        : "border-2 border-slate-300 hover:bg-slate-50"
    }`}
  >
    {icon} {label}
  </button>
);
