import { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { createTestDrive } from '../services/testDriveService';
import type { Vehiculo } from '../types';

interface TestDriveFormProps {
  vehiculo: Vehiculo;
}

export function TestDriveForm({ vehiculo }: TestDriveFormProps) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !email || !telefono || !fecha || !hora) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      await createTestDrive({
        vehiculoId: vehiculo.id,
        nombre,
        email,
        telefono,
        fecha,
        hora,
      });

      setSubmitted(true);
      toast.success('¡Solicitud enviada!');

      setTimeout(() => {
        setSubmitted(false);
        setNombre('');
        setEmail('');
        setTelefono('');
        setFecha('');
        setHora('');
      }, 3000);
    } catch (error) {
      toast.error('Error al agendar el Test Drive');
    }
  };

  if (submitted) {
    return (
      <div className="p-8 bg-gradient-to-br from-green-50 to-white border-4 border-green-300 rounded-2xl text-center shadow-xl">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-900 mb-3">
          ¡Solicitud Confirmada!
        </h3>
        <p className="text-slate-700 font-medium text-lg">
          Hemos recibido tu solicitud para probar el{' '}
          <span className="font-bold text-red-600">
            {vehiculo.marca} {vehiculo.modelo}
          </span>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-white border-4 border-slate-300 rounded-2xl shadow-xl">
      <h3 className="text-2xl font-bold text-slate-900 mb-2 pb-3 border-b-2 border-red-300">
        Agendar Test Drive
      </h3>

      <p className="text-slate-700 mb-6 font-semibold">
        {vehiculo.marca} {vehiculo.modelo} {vehiculo.año}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="block font-bold mb-2">Nombre Completo</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600" />
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full pl-11 py-3 border-2 rounded-lg"
              required
            />
          </div>
        </div>

        {/* Email y Teléfono */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 py-3 border-2 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-2">Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600" />
              <input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full pl-11 py-3 border-2 rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        {/* Fecha y Hora */}
        <div className="grid md:grid-cols-2 gap-4">
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
        </div>

        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold">
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
}
