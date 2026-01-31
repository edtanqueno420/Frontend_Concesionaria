import { useState, useEffect } from 'react';
import { User, Car, DollarSign, FileText, Send } from 'lucide-react';
import { solicitudService } from '../services/solicitudService';
import { useAuth } from '../auth/AuthContext';

interface SolicitudFormProps {
  vehiculo: any;
}

export function SolicitudForm({ vehiculo }: SolicitudFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    usuarioId: '',
    vehiculoActual: '',
    valorEstimado: '',
    observaciones: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Auto-populate usuarioId when user is available
  useEffect(() => {
    if (user?.id) {
      setFormData(prev => ({
        ...prev,
        usuarioId: user.id.toString()
      }));
    }
  }, [user]);

  // Auto-populate vehiculoActual when vehicle is available
  useEffect(() => {
    if (vehiculo) {
      const vehicleName = `${vehiculo.version?.modelo?.marca?.nombre} ${vehiculo.version?.modelo?.nombre} ${vehiculo.version?.anio}`;
      setFormData(prev => ({
        ...prev,
        vehiculoActual: vehicleName
      }));
    }
  }, [vehiculo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await solicitudService.crear({
        usuarioId: Number(formData.usuarioId),
        vehiculoActual: formData.vehiculoActual,
        valorEstimado: formData.valorEstimado ? Number(formData.valorEstimado) : undefined,
        observaciones: formData.observaciones || undefined,
        vehiculo_id: vehiculo.id,
        vehiculo_nombre: `${vehiculo.version?.modelo?.marca?.nombre} ${vehiculo.version?.modelo?.nombre} ${vehiculo.version?.anio}`,
        precio: vehiculo.precio_final
      });
      setSuccess(true);
      setFormData({
        usuarioId: '',
        vehiculoActual: '',
        valorEstimado: '',
        observaciones: ''
      });
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (success) {
    return (
      <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">¡Solicitud Enviada!</h3>
          <p className="text-green-600">Tu solicitud de financiamiento ha sido recibida. Nos contactaremos pronto.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
            <User className="w-4 h-4" /> ID Usuario (Automático)
          </label>
          <input
            type="number"
            name="usuarioId"
            value={formData.usuarioId}
            onChange={handleChange}
            required
            readOnly
            className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
            placeholder="ID del usuario logeado"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
            <Car className="w-4 h-4" /> Vehículo Actual
          </label>
          <input
            type="text"
            name="vehiculoActual"
            value={formData.vehiculoActual}
            onChange={handleChange}
            required
            readOnly
            className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
            placeholder="Nombre del vehículo"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
          <DollarSign className="w-4 h-4" /> Valor Estimado
        </label>
        <input
          type="number"
          name="valorEstimado"
          value={formData.valorEstimado}
          onChange={handleChange}
          className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
          placeholder="Valor estimado de tu vehículo actual"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
          <FileText className="w-4 h-4" /> Observaciones
        </label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
          placeholder="Información adicional sobre tu solicitud..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-bold shadow-lg transition-all hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Enviar Solicitud
            </>
          )}
        </button>
      </div>
    </form>
  );
}
