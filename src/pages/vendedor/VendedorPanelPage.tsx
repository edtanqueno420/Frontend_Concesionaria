import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Car,
  CheckCircle,
  Clock,
  Edit2,
  FileText,
  Shield,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";

type Vehiculo = {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
};

type Venta = {
  id: number;
  cliente: string;
  fecha: string;
  estado: "pendiente" | "aprobada" | "rechazada";
  vehiculo: Vehiculo;
};

type Usuario = {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  cedula: string;
  rol: "cliente" | "vendedor" | "administrador";
  estado: "Activo" | "Inactivo";
};

export default function VendedorPanelPage() {
  const [activeTab, setActiveTab] = useState<"ventas" | "usuarios" | "vehiculos">("ventas");

  // filtros
  const [filtroVentas, setFiltroVentas] = useState<"todas" | "pendiente" | "aprobada" | "rechazada">("todas");
  const [filtroRol, setFiltroRol] = useState<"todos" | "cliente" | "vendedor" | "administrador">("todos");

  // ✅ MOCK DATA
  const [ventas] = useState<Venta[]>([
    {
      id: 1,
      cliente: "Juan Pérez",
      fecha: "2026-01-20",
      estado: "pendiente",
      vehiculo: { id: 1, marca: "Toyota", modelo: "Corolla 2023", precio: 22000 },
    },
    {
      id: 2,
      cliente: "María López",
      fecha: "2026-01-21",
      estado: "aprobada",
      vehiculo: { id: 2, marca: "Kia", modelo: "Sportage 2024", precio: 32000 },
    },
    {
      id: 3,
      cliente: "Carlos Vera",
      fecha: "2026-01-22",
      estado: "rechazada",
      vehiculo: { id: 3, marca: "Honda", modelo: "Civic 2022", precio: 24000 },
    },
  ]);

  const [usuarios] = useState<Usuario[]>([
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan@mail.com",
      telefono: "0999999999",
      direccion: "Quito",
      cedula: "1712345678",
      rol: "cliente",
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Ana Vendedor",
      email: "ana@empresa.com",
      telefono: "0988888888",
      direccion: "Quito",
      cedula: "1711111111",
      rol: "vendedor",
      estado: "Activo",
    },
    {
      id: 3,
      nombre: "Admin Uno",
      email: "admin@empresa.com",
      telefono: "0977777777",
      direccion: "Quito",
      cedula: "1722222222",
      rol: "administrador",
      estado: "Activo",
    },
  ]);

  const [vehicles] = useState<Vehiculo[]>([
    { id: 1, marca: "Toyota", modelo: "Corolla 2023", precio: 22000 },
    { id: 2, marca: "Kia", modelo: "Sportage 2024", precio: 32000 },
    { id: 3, marca: "Honda", modelo: "Civic 2022", precio: 24000 },
  ]);

  // filtros calculados
  const ventasFiltradas = useMemo(() => {
    if (filtroVentas === "todas") return ventas;
    return ventas.filter((v) => v.estado === filtroVentas);
  }, [ventas, filtroVentas]);

  const usuariosFiltrados = useMemo(() => {
    if (filtroRol === "todos") return usuarios;
    return usuarios.filter((u) => u.rol === filtroRol);
  }, [usuarios, filtroRol]);

  const totalUsuarios = usuariosFiltrados.length;
  const totalClientes = usuariosFiltrados.filter((u) => u.rol === "cliente").length;
  const totalVendedores = usuariosFiltrados.filter((u) => u.rol === "vendedor").length;
  const totalAdministradores = usuariosFiltrados.filter((u) => u.rol === "administrador").length;

  // ✅ SOLO UI (acciones mock)
  const handleEditarUsuario = (u: Usuario) => {
    alert(`(Mock) Editar usuario: ${u.nombre}`);
  };
  const handleEliminarUsuario = (id: number) => {
    alert(`(Mock) Eliminar usuario ID: ${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <BadgeCheck className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Panel Vendedor</h1>
              <p className="text-slate-600 font-semibold">Gestión visual (sin backend por ahora)</p>
            </div>
          </div>

          <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
            Rol: vendedor
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border-2 border-slate-200 p-2 flex gap-2">
          <TabButton active={activeTab === "ventas"} onClick={() => setActiveTab("ventas")} icon={<FileText className="w-4 h-4" />}>
            Ventas
          </TabButton>
          <TabButton active={activeTab === "usuarios"} onClick={() => setActiveTab("usuarios")} icon={<Users className="w-4 h-4" />}>
            Usuarios
          </TabButton>
          <TabButton active={activeTab === "vehiculos"} onClick={() => setActiveTab("vehiculos")} icon={<Car className="w-4 h-4" />}>
            Vehículos
          </TabButton>
        </div>

        {/* CONTENIDO */}
        <div className="mt-6">
          {activeTab === "ventas" ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Solicitudes de Venta</h2>
                      <p className="text-slate-600">Revisión y estado (mock)</p>
                    </div>
                  </div>

                  <select
                    value={filtroVentas}
                    onChange={(e) => setFiltroVentas(e.target.value as any)}
                    className="px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-red-600 font-semibold"
                  >
                    <option value="todas">Todas</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="aprobada">Aprobadas</option>
                    <option value="rechazada">Rechazadas</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {ventasFiltradas.map((venta) => (
                    <div key={venta.id} className="bg-slate-50 rounded-xl p-5 border-2 border-slate-200">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <p className="text-slate-900 font-black text-lg">
                            #{venta.id} — {venta.cliente}
                          </p>
                          <p className="text-slate-600 font-semibold text-sm">Fecha: {venta.fecha}</p>
                          <p className="text-slate-700 font-semibold mt-2">
                            Vehículo: <span className="font-black">{venta.vehiculo.marca} {venta.vehiculo.modelo}</span>
                          </p>
                          <p className="text-red-600 font-black text-xl mt-1">
                            ${venta.vehiculo.precio.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {venta.estado === "pendiente" && (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-yellow-100 text-yellow-700 border border-yellow-200">
                              Pendiente
                            </span>
                          )}
                          {venta.estado === "aprobada" && (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-green-100 text-green-700 border border-green-200">
                              Aprobada
                            </span>
                          )}
                          {venta.estado === "rechazada" && (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-700 border border-red-200">
                              Rechazada
                            </span>
                          )}
                        </div>
                      </div>

                      {venta.estado === "aprobada" && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border-2 border-green-200 mt-4">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <p className="text-sm font-bold text-green-700">Venta aprobada y procesada exitosamente</p>
                        </div>
                      )}

                      {venta.estado === "rechazada" && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border-2 border-red-200 mt-4">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <p className="text-sm font-bold text-red-700">Solicitud rechazada</p>
                        </div>
                      )}
                    </div>
                  ))}

                  {ventasFiltradas.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-slate-200">
                      <Clock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500 text-lg font-semibold">No hay solicitudes con este filtro</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Total Solicitudes" value={String(ventasFiltradas.length)} icon={<FileText className="w-5 h-5 text-slate-600" />} />
                <StatCard
                  label="Ventas Aprobadas"
                  value={String(ventasFiltradas.filter((v) => v.estado === "aprobada").length)}
                  icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                />
                <StatCard
                  label="Ingresos Generados"
                  value={`$${ventasFiltradas
                    .filter((v) => v.estado === "aprobada")
                    .reduce((sum, v) => sum + v.vehiculo.precio, 0)
                    .toLocaleString()}`}
                  icon={<Shield className="w-5 h-5 text-red-600" />}
                />
              </div>
            </div>
          ) : activeTab === "usuarios" ? (
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Lista de Usuarios</h2>
                    <p className="text-slate-600">Todos los usuarios registrados (mock)</p>
                  </div>
                </div>

                <select
                  value={filtroRol}
                  onChange={(e) => setFiltroRol(e.target.value as any)}
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-red-600 font-semibold"
                >
                  <option value="todos">Todos</option>
                  <option value="cliente">Clientes</option>
                  <option value="vendedor">Vendedores</option>
                  <option value="administrador">Administradores</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100 border-b-2 border-slate-300">
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">Nombre</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">Teléfono</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">Dirección</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">Cédula</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">Rol</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">Estado</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((usuario) => (
                      <tr key={usuario.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 font-bold text-slate-900">{usuario.id}</td>
                        <td className="px-4 py-4 font-semibold text-slate-900">{usuario.nombre}</td>
                        <td className="px-4 py-4 text-slate-700">{usuario.email}</td>
                        <td className="px-4 py-4 text-slate-700">{usuario.telefono}</td>
                        <td className="px-4 py-4 text-slate-700">{usuario.direccion}</td>
                        <td className="px-4 py-4 text-slate-700">{usuario.cedula}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              usuario.rol === "cliente"
                                ? "bg-blue-100 text-blue-700"
                                : usuario.rol === "vendedor"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {usuario.rol}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              usuario.estado === "Activo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {usuario.estado}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditarUsuario(usuario)}
                              className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                              title="Editar usuario"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEliminarUsuario(usuario.id)}
                              className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {usuariosFiltrados.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-500 text-lg">No hay usuarios con este filtro</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t-2 border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <MiniStat label="Total Usuarios" value={String(totalUsuarios)} />
                  <MiniStat label="Clientes" value={String(totalClientes)} />
                  <MiniStat label="Vendedores" value={String(totalVendedores)} />
                  <MiniStat label="Administradores" value={String(totalAdministradores)} />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Gestión de Vehículos</h2>
              <p className="text-slate-600 mb-6">(Mock) Lista simple, luego lo conectas al backend</p>

              <div className="space-y-3">
                {vehicles.map((v) => (
                  <div key={v.id} className="flex items-center justify-between bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                    <div>
                      <p className="font-black text-slate-900">{v.marca} {v.modelo}</p>
                      <p className="text-red-600 font-black">${v.precio.toLocaleString()}</p>
                    </div>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-red-600 transition">
                      Ver detalle
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-black transition ${
        active ? "bg-red-600 text-white" : "bg-white text-slate-900 hover:bg-slate-50"
      }`}
      type="button"
    >
      {icon}
      <span className="text-sm">{children}</span>
    </button>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-slate-200">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 font-semibold">{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-black text-slate-900 mt-2">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
      <p className="text-sm text-slate-600 font-semibold">{label}</p>
      <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
    </div>
  );
}
