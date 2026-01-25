import { useState, useEffect } from "react";
import api from "../api/axios";
import { X, Save, CarFront, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ModeloModal({ isOpen, onClose, onSuccess, editData }: any) {
  const [nombre, setNombre] = useState("");
  const [marcaId, setMarcaId] = useState("");
  const [marcas, setMarcas] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMarcas();
      if (editData) {
        setNombre(editData.nombre);
        setMarcaId(editData.marcaId);
      } else {
        setNombre("");
        setMarcaId("");
      }
    }
  }, [editData, isOpen]);

  const fetchMarcas = async () => {
    const res = await api.get("/marcas");
    setMarcas(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { nombre: nombre.toUpperCase(), marcaId: Number(marcaId) };
      if (editData) await api.put(`/modelos/${editData.id}`, data);
      else await api.post("/modelos", data);
      toast.success("Modelo guardado");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Error al guardar");
    } finally { setSaving(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600"></div>
          <div className="flex items-center gap-3">
            <CarFront className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-black italic uppercase italic">{editData ? 'Editar Modelo' : 'Nuevo Modelo'}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Seleccionar Marca</label>
            <select 
              required
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-red-600 font-bold text-slate-700"
              value={marcaId}
              onChange={(e) => setMarcaId(e.target.value)}
            >
              <option value="">Elegir fabricante...</option>
              {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Nombre del Modelo</label>
            <input 
              type="text" required placeholder="Ej: COROLLA"
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-red-600 font-black text-slate-700 uppercase italic"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl uppercase text-xs">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-4 bg-slate-900 hover:bg-red-600 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase text-xs">
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}