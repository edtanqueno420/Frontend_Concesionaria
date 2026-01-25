import { useEffect, useState } from "react";
import api from "../api/axios";
import { 
  Plus, Search, Edit3, Trash2, Car, 
  Loader2, Calendar 
} from "lucide-react";
import { toast } from "sonner";
import { VehiculoModal } from "./VehiculoModal";

export default function VehiculoList() {
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState<any>(null);

  const fetchVehiculos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/vehiculos");
      setVehiculos(res.data);
    } catch (error) {
      toast.error("Error al cargar el inventario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehiculos(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este vehículo del inventario?")) return;
    try {
      await api.delete(`/vehiculos/${id}`);
      setVehiculos(vehiculos.filter(v => v.id !== id));
      toast.success("Vehículo eliminado");
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const filtered = vehiculos.filter(v => 
    v.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.modelo?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-3">
            <Car className="text-red-600 w-10 h-10" /> Inventario
          </h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">
            Gestión de unidades y stock real
          </p>
        </div>
        <button 
          onClick={() => { setSelectedVehiculo(null); setIsModalOpen(true); }}
          className="bg-slate-950 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all uppercase text-xs tracking-widest"
        >
          <Plus size={20} /> Añadir Vehículo
        </button>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Buscar por placa o modelo..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-red-600 rounded-2xl outline-none transition-all font-bold text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLA DE INVENTARIO */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-400">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Vehículo</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Placa / Año</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Precio</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-red-600" /></td></tr>
            ) : filtered.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-800 uppercase italic text-lg leading-tight">
                      {v.modelo?.marca?.nombre} {v.modelo?.nombre}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{v.color}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-mono text-sm font-bold text-slate-700">{v.placa}</span>
                    <span className="flex items-center gap-1 text-[10px] font-black text-slate-400"><Calendar size={12}/> {v.anio}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-red-600 font-black text-lg">
                    ${Number(v.precio).toLocaleString('en-US')}
                  </span>
                </td>
                <td className="px-8 py-6 flex justify-end gap-2">
                  <button onClick={() => { setSelectedVehiculo(v); setIsModalOpen(true); }} className="p-3 bg-white hover:bg-slate-900 hover:text-white text-slate-400 rounded-xl border border-slate-100 shadow-sm"><Edit3 size={18} /></button>
                  <button onClick={() => handleDelete(v.id)} className="p-3 bg-white hover:bg-red-600 hover:text-white text-slate-400 rounded-xl border border-slate-100 shadow-sm"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <VehiculoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchVehiculos}
        editData={selectedVehiculo}
      />
    </div>
  );
}