import React from "react";
import {
  LayoutDashboard,
  Car,
  Tag,
  Wrench,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Plus,
  MoreVertical,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  { label: "Mantenimientos", icon: Wrench, path: "/admin/mantenimientos" },
  { label: "Usuarios", icon: Users, path: "/admin/usuarios" },
  { label: "Ventas", icon: ShoppingCart, path: "/admin/ventas" },
  { label: "Reportes", icon: FileText, path: "/admin/reportes" },
  { label: "Configuración", icon: Settings, path: "/admin/config" },
];

const kpis = [
  { title: "Vehículos disponibles", value: "128", icon: Car, hint: "+12 esta semana" },
  { title: "Ventas del mes", value: "$84,200", icon: DollarSign, hint: "+8.4% vs mes anterior" },
  { title: "Clientes registrados", value: "1,340", icon: Users, hint: "+44 nuevos" },
  { title: "Solicitudes pendientes", value: "9", icon: AlertTriangle, hint: "Requieren revisión" },
];

const vehiculosRecientes = [
  { id: "V-1021", marca: "Toyota", modelo: "Corolla", anio: 2023, precio: 21900, estado: "Disponible" as const },
  { id: "V-1044", marca: "Honda", modelo: "CR-V", anio: 2024, precio: 34900, estado: "Reservado" as const },
  { id: "V-0988", marca: "Kia", modelo: "Sportage", anio: 2022, precio: 24500, estado: "Disponible" as const },
  { id: "V-1107", marca: "Porsche", modelo: "911 Carrera", anio: 2021, precio: 125000, estado: "Vendido" as const },
];

const ventasRecientes = [
  { id: "S-5512", cliente: "María P.", vehiculo: "Honda CR-V 2024", total: 35200, status: "Completada" as const },
  { id: "S-5511", cliente: "Carlos M.", vehiculo: "Toyota Corolla 2023", total: 21900, status: "En proceso" as const },
  { id: "S-5509", cliente: "José L.", vehiculo: "Kia Sportage 2022", total: 24500, status: "Completada" as const },
];

function Badge({ value }: { value: string }) {
  const base = "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold";
  if (value === "Disponible") return <span className={`${base} bg-emerald-50 text-emerald-700`}><CheckCircle2 className="w-3.5 h-3.5" /> {value}</span>;
  if (value === "Reservado") return <span className={`${base} bg-amber-50 text-amber-700`}><AlertTriangle className="w-3.5 h-3.5" /> {value}</span>;
  return <span className={`${base} bg-slate-100 text-slate-700`}><CheckCircle2 className="w-3.5 h-3.5" /> {value}</span>;
}

function SaleStatus({ value }: { value: string }) {
  const base = "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold";
  if (value === "Completada") return <span className={`${base} bg-emerald-50 text-emerald-700`}><CheckCircle2 className="w-3.5 h-3.5" /> {value}</span>;
  return <span className={`${base} bg-blue-50 text-blue-700`}><TrendingUp className="w-3.5 h-3.5" /> {value}</span>;
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activePath, setActivePath] = React.useState("/admin");

  function go(path: string) {
    setActivePath(path);
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

          {/* PAGE */}
          <div className="p-4 md:p-6">
            {/* Title */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-600">Resumen general del sistema (visual, datos mock)</p>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold hover:bg-slate-50">
                  Exportar
                </button>
                <button className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
                  Acciones
                </button>
              </div>
            </div>

            {/* KPIs */}
            <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {kpis.map((k, i) => {
                const Icon = k.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-600">{k.title}</p>
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white grid place-items-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="mt-3 text-3xl font-bold text-slate-900">{k.value}</p>
                    <p className="mt-2 text-sm text-slate-500">{k.hint}</p>
                  </div>
                );
              })}
            </section>

            {/* GRID 2 columns */}
            <section className="grid lg:grid-cols-3 gap-4">
              {/* Tabla vehiculos */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Vehículos recientes</h2>
                    <p className="text-sm text-slate-500">Últimos agregados/actualizados</p>
                  </div>
                  <button
                    onClick={() => go("/admin/vehiculos")}
                    className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
                  >
                    Ver todos
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr className="text-xs text-slate-600">
                        <th className="p-3 font-semibold">Código</th>
                        <th className="p-3 font-semibold">Marca / Modelo</th>
                        <th className="p-3 font-semibold">Año</th>
                        <th className="p-3 font-semibold">Precio</th>
                        <th className="p-3 font-semibold">Estado</th>
                        <th className="p-3 font-semibold text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehiculosRecientes.map((v) => (
                        <tr key={v.id} className="border-t border-slate-100 hover:bg-slate-50">
                          <td className="p-3 font-semibold text-slate-700">{v.id}</td>
                          <td className="p-3">
                            <p className="font-semibold text-slate-900">
                              {v.marca} {v.modelo}
                            </p>
                            <p className="text-xs text-slate-500">Catálogo / Inventario</p>
                          </td>
                          <td className="p-3 text-slate-700">{v.anio}</td>
                          <td className="p-3 font-bold text-slate-900">${v.precio.toLocaleString()}</td>
                          <td className="p-3">
                            <Badge value={v.estado} />
                          </td>
                          <td className="p-3 text-right">
                            <button className="p-2 rounded-lg hover:bg-slate-100">
                              <MoreVertical className="w-5 h-5 text-slate-600" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {vehiculosRecientes.length === 0 && (
                        <tr>
                          <td className="p-6 text-slate-500" colSpan={6}>
                            No hay datos.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ventas recientes */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200">
                  <h2 className="text-lg font-bold text-slate-900">Últimas ventas</h2>
                  <p className="text-sm text-slate-500">Estado y totales</p>
                </div>

                <div className="p-4 space-y-3">
                  {ventasRecientes.map((s) => (
                    <div key={s.id} className="rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{s.vehiculo}</p>
                          <p className="text-xs text-slate-500">
                            {s.id} • Cliente: <span className="font-semibold">{s.cliente}</span>
                          </p>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-slate-100">
                          <MoreVertical className="w-5 h-5 text-slate-600" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900">${s.total.toLocaleString()}</p>
                        <SaleStatus value={s.status} />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => go("/admin/ventas")}
                    className="w-full mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
                  >
                    Ver ventas
                  </button>
                </div>
              </div>
            </section>

            {/* Footer mini */}
            <div className="mt-6 text-xs text-slate-500">
              © 2026 YEC Motors • Panel Admin (solo UI)
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
