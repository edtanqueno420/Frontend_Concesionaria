import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, CarFront, Tags, Users, 
  LogOut, Car, ChevronRight 
} from 'lucide-react';
import { toast } from 'sonner';

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info("Sesión terminada");
    navigate('/login');
  };

  const menuItems = [
    { path: '/panel', icon: LayoutDashboard, label: 'Resumen' },
    { path: '/marcas', icon: Tags, label: 'Marcas' },
    { path: '/modelos', icon: CarFront, label: 'Modelos' },
    { path: '/gestion-vehiculos', icon: Car, label: 'Vehículos' },
    { path: '/usuarios', icon: Users, label: 'Usuarios' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0F172A] text-white flex flex-col fixed h-full">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-red-600 p-2 rounded-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter italic">YEC MOTORS</span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between p-3 rounded-xl transition-all group ${
                  location.pathname === item.path 
                  ? 'bg-red-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                {location.pathname === item.path && <ChevronRight className="w-4 h-4" />}
              </Link>
            ))}
          </nav>
        </div>

        {/* USER CARD & LOGOUT */}
        <div className="mt-auto p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-6 p-2">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold">
              {user.nombre?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold truncate w-32">{user.nombre}</p>
              <p className="text-[10px] text-slate-500 uppercase font-black">{user.rol}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut className="w-5 h-5" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-72 p-10">
        <Outlet />
      </main>
    </div>
  );
}