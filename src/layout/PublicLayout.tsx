import { Outlet, Link } from "react-router-dom";
import { Car, User } from "lucide-react";

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* NAVBAR */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Car className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-black italic">YEC<span className="text-red-600">MOTORS</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-widest">
            <Link to="/" className="hover:text-red-500 transition-colors">Inicio</Link>
            <Link to="/vehiculos" className="hover:text-red-500 transition-colors">Vehículos</Link>
            <Link to="/contacto" className="hover:text-red-500 transition-colors">Contacto</Link>
            <Link to="/marcas" className="hover:text-red-500 transition-colors">Marcas</Link>
          </div>

          <Link to="/login" className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-900/20">
            <User className="w-4 h-4" /> Ingresar
          </Link>
        </nav>
      </header>

      {/* CONTENIDO DINÁMICO */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-500 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} YEC Motors Ecuador. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}