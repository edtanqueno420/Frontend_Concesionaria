import React from "react";
import {
  LayoutDashboard,
  Car,
  Tag,
  Wrench,
  Users,
  ShoppingCart,
  FileText,
  Bell,
  Search,
  ChevronDown,
  Plus,
} from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { YECLogo } from "../../components/YECLogo";

type MenuItem = {
  label: string;
  icon: React.ElementType;
  path: string;
};

const menu: MenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Vehículos", icon: Car, path: "/admin/vehiculos" },
  { label: "Marcas", icon: Tag, path: "/admin/marcas" },
  { label: "Versiones", icon: Wrench, path: "/admin/mantenimientos" },
  { label: "Usuarios", icon: Users, path: "/admin/usuarios" },
  { label: "Ventas", icon: ShoppingCart, path: "/admin/ventas" },
  { label: "Reportes", icon: FileText, path: "/admin/reportes" },
  
];

export default function AdminShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  function go(path: string) {
    navigate(path);
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        {/* SIDEBAR */}
        <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-slate-900 text-white">
          <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10">
            <YECLogo className="w-10 h-10" />
            <div>
              <p className="font-bold leading-5">YEC Admin</p>
              <p className="text-xs text-white/60">Panel de administrador</p>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4">
            <p className="px-3 text-xs text-white/50 mb-2">MENÚ</p>
            <div className="space-y-1">
              {menu.map((item) => {
                const Icon = item.icon;
                const active = activePath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => go(item.path)}
                    className={[
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition",
                      active ? "bg-red-600 text-white" : "text-white/80 hover:bg-white/10",
                    ].join(" ")}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-white/60">admin@yecmotors.ec</p>
              <button
                className="mt-3 w-full bg-white text-slate-900 rounded-lg py-2 text-sm font-semibold hover:bg-slate-100"
                onClick={() => navigate("/")}
              >
                Ir al sitio
              </button>
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 md:ml-72">
          {/* TOPBAR */}
          <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
            <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="md:hidden flex items-center gap-2">
                  <YECLogo className="w-9 h-9" />
                  <span className="font-bold">YEC Admin</span>
                </div>

                <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 w-[420px]">
                  <Search className="w-4 h-4 text-slate-500" />
                  <input
                    className="bg-transparent outline-none text-sm w-full"
                    placeholder="Buscar vehículos, clientes, ventas..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800">
                  <Plus className="w-4 h-4" />
                  Nuevo
                  <ChevronDown className="w-4 h-4 opacity-80" />
                </button>

                <button className="p-2 rounded-lg hover:bg-slate-100">
                  <Bell className="w-5 h-5 text-slate-700" />
                </button>

                <div className="flex items-center gap-2 pl-2">
                  <div className="w-9 h-9 rounded-full bg-red-600 text-white grid place-items-center font-bold">
                    A
                  </div>
                  <div className="hidden sm:block leading-4">
                    <p className="text-sm font-semibold text-slate-900">Admin</p>
                    <p className="text-xs text-slate-500">Rol: administrador</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>
          </header>

          {/* AQUÍ SE RENDERIZA CADA PÁGINA */}
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
