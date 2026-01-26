import { useEffect, useState } from "react";
import api from "../api/axios";
import { 
  Plus, Search, Edit3, Trash2, Tags, 
  Loader2, RefreshCw 
} from "lucide-react";
import { toast } from "sonner";
import { MarcaModal } from "./MarcaModal";

export default function MarcaList() {
  const [marcas, setMarcas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados para el Modal (Crear/Editar)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMarca, setSelectedMarca] = useState<any>(null);

  // 1. Cargar datos
  const fetchMarcas = async () => {
    setLoading(true);
    try {
      const res = await api.get("/marcas");
      setMarcas(res.data);
    } catch (error) {
      toast.error("Error al sincronizar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  // 2. Lógica de borrado
  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta marca?")) return;
    try {
      await api.delete(`/marcas/${id}`);
      setMarcas(marcas.filter(m => m.id !== id));
      toast.success("Marca eliminada");
    } catch (error) {
      toast.error("No se puede eliminar: tiene modelos asociados");
    }
  };

  // 3. Filtro de búsqueda
  const filteredMarcas = marcas.filter(m => 
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 animate-in fade-in duration-700">
      
      {/* HEADER DEL MÓDULO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-600 p-2 rounded-lg shadow-lg shadow-red-600/20">
              <Tags className="text-white w-6 h-6" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
              Marcas
            </h1>
          </div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">
            Gestión de fabricantes autorizados
          </p>
        </div>

        <button 
          onClick={() => { setSelectedMarca(null); setIsModalOpen(true); }}
          className="bg-slate-950 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-slate-950/10 uppercase text-xs tracking-widest"
        >
          <Plus size={20} /> Registrar Marca
        </button>
      </div>

      {/* TOOLBAR: BÚSQUEDA */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Buscar marca por nombre..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-red-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={fetchMarcas}
          className="p-3 text-slate-400 hover:text-red-600 transition-colors"
          title="Refrescar datos"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* TABLA ESTILO FIGMA */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-400">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">ID</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Nombre Comercial</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={3} className="py-20 text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-red-600 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Cargando base de datos...</p>
                </td>
              </tr>
            ) : filteredMarcas.map((marca) => (
              <tr key={marca.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-8 py-6">
                  <span className="font-mono text-xs text-slate-400">#00{marca.id}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                      <Tags size={18} />
                    </div>
                    <span className="font-black text-slate-800 uppercase italic tracking-tight">{marca.nombre}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => { setSelectedMarca(marca); setIsModalOpen(true); }}
                      className="p-3 bg-white hover:bg-slate-900 hover:text-white text-slate-400 rounded-xl transition-all border border-slate-100 shadow-sm"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(marca.id)}
                      className="p-3 bg-white hover:bg-red-600 hover:text-white text-slate-400 rounded-xl transition-all border border-slate-100 shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMarcas.length === 0 && !loading && (
          <div className="py-20 text-center bg-slate-50/30">
            <p className="text-slate-400 font-bold italic">No se encontraron resultados para "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* MODAL DE GESTIÓN */}
      <MarcaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={fetchMarcas}
        editData={selectedMarca}
      />
    </div>
  );
}