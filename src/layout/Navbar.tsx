import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Car, LogOut, User as UserIcon, MapPin, Home, Menu, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cargamos los datos reales del usuario logueado
  const [user, setUser] = useState({ nombre: 'Usuario', rol: 'Cliente' });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Sesión cerrada correctamente');
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-black to-slate-900 shadow-2xl border-b-4 border-red-600 sticky top-0 z-[100]">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* 1. LOGO Y TÍTULO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-white rounded-lg p-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Car className="w-7 h-7 text-red-600" />
            </div>
            <div className="hidden sm:block">
              <h2 className="text-white font-black text-xl tracking-tighter italic">YEC MOTORS</h2>
              <p className="text-red-500 text-[10px] font-black tracking-[0.3em] uppercase leading-none">Concesionaria</p>
            </div>
          </Link>

          {/* NAVEGACIÓN (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            
            <Link to="/catalogo" className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all text-xs font-black uppercase tracking-widest">
              <Home className="w-4 h-4 text-red-600" /> Catálogo
            </Link>

            <button 
              onClick={() => toast.info('Módulo de Sucursales próximamente')}
              className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all text-xs font-black uppercase tracking-widest"
            >
              <MapPin className="w-4 h-4 text-red-600" /> Sucursales
            </button>

            {/* SEPARADOR */}
            <div className="h-6 w-px bg-slate-800 mx-4"></div>

            {/* PERFIL DE USUARIO DROPDOWN */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-slate-800/40 hover:bg-slate-800 rounded-full border border-slate-700 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-[10px] font-black text-white leading-none uppercase tracking-tighter">{user.nombre}</p>
                  <p className="text-[9px] text-red-500 font-bold uppercase leading-none mt-1">{user.rol}</p>
                </div>
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Cuenta Activa</p>
                      <p className="text-sm font-bold text-slate-800 truncate mt-1">{user.nombre}</p>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* BOTÓN MENÚ MÓVIL */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 p-4 space-y-4 animate-in slide-in-from-top-5">
          <Link to="/catalogo" className="flex items-center gap-4 text-slate-300 p-3 hover:bg-slate-800 rounded-xl font-bold">
            <Home className="w-5 h-5 text-red-600" /> Inicio
          </Link>
          <button onClick={() => toast.info('Próximamente')} className="w-full flex items-center gap-4 text-slate-300 p-3 hover:bg-slate-800 rounded-xl font-bold">
            <MapPin className="w-5 h-5 text-red-600" /> Sucursales
          </button>
          <div className="border-t border-slate-800 pt-4">
            <button onClick={handleLogout} className="w-full flex items-center gap-4 text-red-500 p-3 hover:bg-red-950/30 rounded-xl font-bold">
              <LogOut className="w-5 h-5" /> Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
}