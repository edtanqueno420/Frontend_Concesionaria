import { useEffect, useState } from "react";
import api from "../api/axios";
import { Plus, Search, Edit3, Trash2, CarFront, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ModeloModal } from "./ModeloModal";

export default function ModeloList() {
  const [modelos, setModelos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModelo, setSelectedModelo] = useState<any>(null);

  const fetchModelos = async () => {
    setLoading(true);
    try {
      // Tu backend debería devolver el modelo con la marca incluida 
      const res = await api.get("/modelos");
      setModelos(res.data);
    } catch (error) {
      toast.error("Error al cargar modelos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchModelos(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este modelo?")) return;
    try {
      await api.delete(`/modelos/${id}`);
      setModelos(modelos.filter(m => m.id !== id));
      toast.success("Modelo eliminado");
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const filtered = modelos.filter(m => 
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.marca?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-3">
            <CarFront className="text-red-600 w-10 h-10" /> Modelos
          </h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">
            Catálogo de líneas y versiones
          </p>
        </div>
        <button 
          onClick={() => { setSelectedModelo(null); setIsModalOpen(true); }}
          className="bg-slate-950 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all uppercase text-xs tracking-widest"
        >
          <Plus size={20} /> Nuevo Modelo
        </button>
      </div>

      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Buscar por modelo o marca..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-red-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={fetchModelos} className="p-3 text-slate-400 hover:text-red-600 transition-colors">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-400">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Modelo</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Marca Relacionada</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={3} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-red-600" /></td></tr>
            ) : filtered.map((modelo) => (
              <tr key={modelo.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-8 py-6">
                  <span className="font-black text-slate-800 uppercase italic text-lg">{modelo.nombre}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-black uppercase tracking-tighter">
                    {modelo.marca?.nombre || 'Sin Marca'}
                  </span>
                </td>
                <td className="px-8 py-6 flex justify-end gap-2">
                  <button onClick={() => { setSelectedModelo(modelo); setIsModalOpen(true); }} className="p-3 bg-white hover:bg-slate-900 hover:text-white text-slate-400 rounded-xl border border-slate-100 shadow-sm"><Edit3 size={18} /></button>
                  <button onClick={() => handleDelete(modelo.id)} className="p-3 bg-white hover:bg-red-600 hover:text-white text-slate-400 rounded-xl border border-slate-100 shadow-sm"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModeloModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchModelos}
        editData={selectedModelo}
      />
    </div>
  );
}