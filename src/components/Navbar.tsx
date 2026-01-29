import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { YECLogo } from './YECLogo';
import { User, LogOut } from 'lucide-react';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-slate-900 text-white py-4 px-6 sticky top-0 z-50 shadow-2xl border-b-2 border-red-600">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <YECLogo className="w-10 h-10 text-red-600 transition-transform group-hover:scale-110" />
          <span className="font-black text-2xl tracking-tighter italic">YEC MOTORS</span>
        </Link>

        <div className="flex items-center gap-8 font-bold text-sm uppercase tracking-widest">
          <Link to="/" className="hover:text-red-500 transition-colors">Inicio</Link>
          <Link to="/catalogo" className="hover:text-red-500 transition-colors">Catálogo</Link>
          
          {isAuthenticated() ? (
            <div className="flex items-center gap-4 pl-4 border-l border-white/20">
              <span className="text-red-400 text-xs">Hola, {user?.nombre}</span>
              <button onClick={logout} className="p-2 hover:bg-red-600 rounded-full transition-all">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 transition-all flex items-center gap-2">
              <User className="w-4 h-4" /> Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}