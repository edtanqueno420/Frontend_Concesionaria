import { useState, useEffect } from 'react';
import { X, Save, Tags, Loader2 } from 'lucide-react';

interface MarcaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nombre: string) => Promise<void>;
  editData?: { id: number; nombre: string } | null;
}

export function MarcaModal({ isOpen, onClose, onSave, editData }: MarcaModalProps) {
  const [nombre, setNombre] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Si estamos editando, cargamos el nombre actual
  useEffect(() => {
    if (editData) setNombre(editData.nombre);
    else setNombre('');
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(nombre);
    setIsSaving(false);
    setNombre('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>

      {/* Ventana Modal */}
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Tags className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter">
              {editData ? 'Editar Marca' : 'Nueva Marca'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase ml-1">Nombre de la Marca</label>
            <input 
              type="text" 
              required 
              autoFocus
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-red-600 focus:bg-white transition-all font-bold text-slate-700"
              placeholder="Ej: TOYOTA, BMW, FORD..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value.toUpperCase())}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl transition-all uppercase text-xs"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSaving || !nombre.trim()}
              className="flex-1 py-4 bg-slate-900 hover:bg-red-600 text-white font-black rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 uppercase text-xs disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
              {editData ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}