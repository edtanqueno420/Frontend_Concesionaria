import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <Car className="w-24 h-24 text-red-600 mb-6 animate-bounce" />
      <h1 className="text-9xl font-black text-slate-900 leading-none">404</h1>
      <p className="text-2xl font-bold text-slate-500 mb-8 italic">¡Ups! Parece que este vehículo se nos escapó.</p>
      <Link to="/" className="px-8 py-4 bg-slate-900 text-white rounded-xl font-black hover:bg-red-600 transition-all">
        VOLVER AL INICIO
      </Link>
    </div>
  );
}