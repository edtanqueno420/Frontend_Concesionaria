import { useEffect, useState, useMemo } from 'react';
import type { Vehiculo } from '../types';
import { vehicleService } from '../services/vehicleService';
import { VehicleForm } from '../components/vehiculos/VehicleForm.tsx';
import { 
  Car, Trash2, CheckCircle, XCircle, 
  Search, Plus, AlertTriangle 
} from 'lucide-react';
import { toast } from 'sonner';

export function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);

  // Carga inicial de datos desde NestJS
  const fetchVehicles = async () => {
    try {
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (error) {
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Lógica de filtrado por Marca o Modelo
  const vehiculosFiltrados = useMemo(() => {
    return vehicles.filter(v => {
      const nombreCompleto = `${v.version?.modelo?.marca?.nombre} ${v.version?.modelo?.nombre}`.toLowerCase();
      return nombreCompleto.includes(busqueda.toLowerCase()) || v.vin.toLowerCase().includes(busqueda.toLowerCase());
    });
  }, [vehicles, busqueda]);

  // Acciones de Administración
  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const nuevoEstado = currentStatus === 'disponible' ? 'vendido' : 'disponible';
    try {
      await vehicleService.updateStatus(id, nuevoEstado);
      toast.success(`Vehículo marcado como ${nuevoEstado}`);
      fetchVehicles();
    } catch (error) {
      toast.error('No se pudo actualizar el estado');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await vehicleService.delete(id);
      toast.error('Vehículo eliminado del inventario');
      setVehicleToDelete(null);
      fetchVehicles();
    } catch (error) {
      toast.error('Error al intentar eliminar');
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse">CARGANDO PANEL...</div>;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER DE GESTIÓN */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 rounded-3xl shadow-2xl border-b-8 border-red-600 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Car className="w-10 h-10 text-red-600" />
            <h1 className="text-4xl font-black italic tracking-tighter">GESTIÓN DE INVENTARIO</h1>
          </div>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em]">Panel Administrativo YEC Motors</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg transition-all hover:scale-105 flex items-center gap-2"
        >
          <Plus className="w-6 h-6" /> REGISTRAR VEHÍCULO
        </button>
      </div>

      {/* ESTADÍSTICAS RÁPIDAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Unidades" value={vehicles.length} color="slate" />
        <StatCard title="Disponibles" value={vehicles.filter(v => v.estado === 'disponible').length} color="green" />
        <StatCard title="Vendidos / Otros" value={vehicles.filter(v => v.estado !== 'disponible').length} color="red" />
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Buscar por Marca, Modelo o VIN..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-red-600 transition-all"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* TABLA DE VEHÍCULOS */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-6 text-xs font-black uppercase tracking-widest">Vehículo</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest">Identificación</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest">Precio Final</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest">Estado</th>
                <th className="p-6 text-center text-xs font-black uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehiculosFiltrados.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-black text-slate-900 leading-none mb-1">
                          {v.version?.modelo?.marca?.nombre} {v.version?.modelo?.nombre}
                        </p>
                        <p className="text-xs text-slate-400 font-bold uppercase">{v.año}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-bold">
                      {v.vin}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{v.color}</p>
                  </td>
                  <td className="p-6 font-black text-red-600 text-lg">
                    ${Number(v.precio_final).toLocaleString()}
                  </td>
                  <td className="p-6">
                    {v.estado === 'disponible' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase">
                        <CheckCircle className="w-3 h-3" /> Disponible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full uppercase">
                        <XCircle className="w-3 h-3" /> No Disponible
                      </span>
                    )}
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => handleToggleStatus(v.id, v.estado)}
                        className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                        title="Cambiar Disponibilidad"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setVehicleToDelete(v.id)}
                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: REGISTRAR VEHÍCULO */}
      {showForm && (
        <VehicleForm 
          onSuccess={() => { fetchVehicles(); setShowForm(false); }}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* MODAL: CONFIRMAR ELIMINACIÓN */}
      {vehicleToDelete && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setVehicleToDelete(null)} />
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 text-center border-t-8 border-red-600">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 italic">¿CONFIRMAR BAJA?</h3>
            <p className="text-slate-500 font-medium mb-8">Esta acción eliminará el registro #<span className="text-red-600">{vehicleToDelete}</span> permanentemente del sistema YEC Motors.</p>
            <div className="flex gap-4">
              <button onClick={() => setVehicleToDelete(null)} className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black hover:bg-slate-200 transition-all">CANCELAR</button>
              <button onClick={() => handleDelete(vehicleToDelete)} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all">ELIMINAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-componente para las cartas de estadísticas
function StatCard({ title, value, color }: { title: string, value: number, color: 'slate' | 'green' | 'red' }) {
  const styles = {
    slate: 'bg-white border-slate-200 text-slate-900',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-600'
  };
  return (
    <div className={`p-8 rounded-[2rem] border-2 shadow-sm transition-transform hover:scale-105 ${styles[color]}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">{title}</p>
      <p className="text-5xl font-black tracking-tighter italic">{value}</p>
    </div>
  );
}

// Componente pequeño de icono 
function RotateCcw(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
    </svg>
  );
}