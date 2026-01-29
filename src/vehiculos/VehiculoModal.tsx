import { useState, useEffect } from "react";
import api from "../api/axios";
import { X, Save, Car, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function VehiculoModal({ isOpen, onClose, onSuccess, editData }: any) {
  const [loading, setLoading] = useState(false);
  const [marcas, setMarcas] = useState<any[]>([]);
  const [modelos, setModelos] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    placa: "",
    color: "",
    anio: new Date().getFullYear(),
    precio: "",
    modeloId: ""
  });
  const [selectedMarcaId, setSelectedMarcaId] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchMarcas();
      if (editData) {
        setFormData({
          placa: editData.placa,
          color: editData.color,
          anio: editData.anio,
          precio: editData.precio,
          modeloId: editData.modeloId
        });
        setSelectedMarcaId(editData.modelo?.marcaId);
      } else {
        setFormData({ placa: "", color: "", anio: 2024, precio: "", modeloId: "" });
        setSelectedMarcaId("");
      }
    }
  }, [isOpen, editData]);

  // Cargar modelos cuando cambie la marca
  useEffect(() => {
    if (selectedMarcaId) fetchModelos(selectedMarcaId);
    else setModelos([]);
  }, [selectedMarcaId]);

  const fetchMarcas = async () => {
    const res = await api.get("/marcas");
    setMarcas(res.data);
  };

  const fetchModelos = async (marcaId: string) => {
    const res = await api.get(`/modelos/marca/${marcaId}`); // Ajusta segun tu API
    setModelos(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData) await api.put(`/vehiculos/${editData.id}`, formData);
      else await api.post("/vehiculos", formData);
      toast.success("Inventario actualizado");
      onSuccess();
      onClose();
    } catch (error) { toast.error("Error al guardar"); }
    finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in">
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600"></div>
          <h2 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
            <Car className="text-red-600" /> {editData ? 'Editar Unidad' : 'Nueva Unidad'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marca</label>
            <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-red-600 font-bold"
              value={selectedMarcaId} onChange={(e) => setSelectedMarcaId(e.target.value)}>
              <option value="">Seleccionar...</option>
              {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Modelo</label>
            <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-red-600 font-bold"
              value={formData.modeloId} onChange={(e) => setFormData({...formData, modeloId: e.target.value})}>
              <option value="">Seleccionar...</option>
              {modelos.map(mod => <option key={mod.id} value={mod.id}>{mod.nombre}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Placa</label>
            <input type="text" placeholder="PBA-1234" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-red-600 font-bold uppercase"
              value={formData.placa} onChange={(e) => setFormData({...formData, placa: e.target.value.toUpperCase()})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Precio ($)</label>
            <input type="number" placeholder="25000" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-red-600 font-bold"
              value={formData.precio} onChange={(e) => setFormData({...formData, precio: e.target.value})} />
          </div>

          <div className="flex gap-4 col-span-2 mt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl uppercase text-xs">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 py-4 bg-slate-900 hover:bg-red-600 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase text-xs">
              {loading ? <Loader2 className="animate-spin" /> : <Save />} {editData ? 'Actualizar' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}






