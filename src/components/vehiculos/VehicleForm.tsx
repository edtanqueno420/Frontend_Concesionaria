import { useState } from 'react';
import { vehicleService } from '../../services/vehicleService';
import { toast } from 'sonner';
import { X, Save } from 'lucide-react';

export function VehicleForm({ on专Success, onClose }: any) {
  const [formData, setFormData] = useState<{
    vin: string;
    color: string;
    precio_final: string;
    versionId: string;
    estado: 'disponible' | 'reservado' | 'vendido';
  }>({
    vin: '',
    color: '',
    precio_final: '',
    versionId: '', // Este ID debe existir en tu tabla de versiones
    estado: 'disponible'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await vehicleService.create({
        ...formData,
        precio_final: parseFloat(formData.precio_final),
        version: { 
          id: parseInt(formData.versionId),
          nombre: '',
          modelo: { id: 0, nombre: '', marca: { id: 0, nombre: '' } },
          caracteristicas: []
        }
      });
      toast.success('¡Vehículo registrado en YEC Motors!');
      on专Success(); // Recarga la lista
      onClose();     // Cierra el modal
    } catch (error) {
      toast.error('Error al registrar. Revisa los datos.');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border-t-8 border-red-600">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-2xl font-black italic">NUEVO INGRESO</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-red-100 text-red-600 rounded-full"><X /></button>
        </div>
        
        <div className="p-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase">VIN (Chasis)</label>
              <input required className="w-full p-3 bg-slate-100 rounded-xl mt-1 font-bold" 
                onChange={e => setFormData({...formData, vin: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase">Color</label>
              <input required className="w-full p-3 bg-slate-100 rounded-xl mt-1 font-bold" 
                onChange={e => setFormData({...formData, color: e.target.value})} />
            </div>
          </div>
          
          <div>
            <label className="text-xs font-black text-slate-400 uppercase">Precio de Venta ($)</label>
            <input required type="number" className="w-full p-3 bg-slate-100 rounded-xl mt-1 font-bold text-red-600 text-xl" 
              onChange={e => setFormData({...formData, precio_final: e.target.value})} />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase">ID de Versión (Catálogo)</label>
            <input required type="number" placeholder="Ej: 1" className="w-full p-3 bg-slate-100 rounded-xl mt-1 font-bold" 
              onChange={e => setFormData({...formData, versionId: e.target.value})} />
            <p className="text-[10px] text-slate-400 mt-1">* El ID debe existir en la base de datos de Versiones.</p>
          </div>

          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-red-600 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg">
            <Save className="w-5 h-5" /> GUARDAR EN INVENTARIO
          </button>
        </div>
      </form>
    </div>
  );
}