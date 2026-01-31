import React, { useMemo, useState } from "react";
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
  Plus,
  RefreshCw,
  X,
  UserCheck,
  UserX,
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

// helpers
const money = (n: number) => `$${n.toLocaleString()}`;
const todayISO = () => new Date().toISOString().slice(0, 10);

export default function VendedorPanelPage() {
  const [activeTab, setActiveTab] = useState<"ventas" | "usuarios" | "vehiculos">(
    "ventas"
  );

  // filtros
  const [filtroVentas, setFiltroVentas] = useState<
    "todas" | "pendiente" | "aprobada" | "rechazada"
  >("todas");
  const [filtroRol, setFiltroRol] = useState<
    "todos" | "cliente" | "vendedor" | "administrador"
  >("todos");

  // ✅ MOCKS CON CRUD REAL
  const [ventas, setVentas] = useState<Venta[]>([
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

  const [usuarios, setUsuarios] = useState<Usuario[]>([
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

  const [vehicles, setVehicles] = useState<Vehiculo[]>([
    { id: 1, marca: "Toyota", modelo: "Corolla 2023", precio: 22000 },
    { id: 2, marca: "Kia", modelo: "Sportage 2024", precio: 32000 },
    { id: 3, marca: "Honda", modelo: "Civic 2022", precio: 24000 },
  ]);

  // ids next
  const nextId = (list: { id: number }[]) =>
    list.length ? Math.max(...list.map((x) => x.id)) + 1 : 1;

  // filtros calculados
  const ventasFiltradas = useMemo(() => {
    if (filtroVentas === "todas") return ventas;
    return ventas.filter((v) => v.estado === filtroVentas);
  }, [ventas, filtroVentas]);

  const usuariosFiltrados = useMemo(() => {
    if (filtroRol === "todos") return usuarios;
    return usuarios.filter((u) => u.rol === filtroRol);
  }, [usuarios, filtroRol]);

  // stats usuarios (sobre filtrados)
  const totalUsuarios = usuariosFiltrados.length;
  const totalClientes = usuariosFiltrados.filter((u) => u.rol === "cliente").length;
  const totalVendedores = usuariosFiltrados.filter((u) => u.rol === "vendedor").length;
  const totalAdministradores = usuariosFiltrados.filter((u) => u.rol === "administrador").length;

  // ------------------------
  // CRUD: Ventas (estado)
  // ------------------------
  const setEstadoVenta = (id: number, estado: Venta["estado"]) => {
    setVentas((prev) =>
      prev.map((v) => (v.id === id ? { ...v, estado } : v))
    );
  };

  // ------------------------
  // CRUD: Usuarios
  // ------------------------
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const openCreateUser = () => {
    setEditingUser(null);
    setUserModalOpen(true);
  };

  const openEditUser = (u: Usuario) => {
    setEditingUser(u);
    setUserModalOpen(true);
  };

  const saveUser = (payload: Omit<Usuario, "id">) => {
    if (editingUser) {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...payload, id: u.id } : u))
      );
    } else {
      const id = nextId(usuarios);
      setUsuarios((prev) => [{ ...payload, id }, ...prev]);
    }
    setUserModalOpen(false);
    setEditingUser(null);
  };

  const deleteUser = (id: number) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  const toggleUserEstado = (id: number) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, estado: u.estado === "Activo" ? "Inactivo" : "Activo" }
          : u
      )
    );
  };

  // ------------------------
  // CRUD: Vehículos
  // ------------------------
  const [vehModalOpen, setVehModalOpen] = useState(false);
  const [editingVeh, setEditingVeh] = useState<Vehiculo | null>(null);

  const openCreateVeh = () => {
    setEditingVeh(null);
    setVehModalOpen(true);
  };

  const openEditVeh = (v: Vehiculo) => {
    setEditingVeh(v);
    setVehModalOpen(true);
  };

  const saveVeh = (payload: Omit<Vehiculo, "id">) => {
    if (editingVeh) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === editingVeh.id ? { ...payload, id: v.id } : v))
      );
    } else {
      const id = nextId(vehicles);
      setVehicles((prev) => [{ ...payload, id }, ...prev]);
    }
    setVehModalOpen(false);
    setEditingVeh(null);
  };

  const deleteVeh = (id: number) => {
    if (!confirm("¿Eliminar este vehículo?")) return;
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  // Demo: “crear venta” desde un vehículo (para la expo)
  const crearVentaMockDesdeVehiculo = (vehiculo: Vehiculo) => {
    const id = nextId(ventas);
    const nueva: Venta = {
      id,
      cliente: "Cliente Demo",
      fecha: todayISO(),
      estado: "pendiente",
      vehiculo,
    };
    setVentas((prev) => [nueva, ...prev]);
    setActiveTab("ventas");
    setFiltroVentas("todas");
  };

  // stats ventas filtradas
  const aprobadas = ventasFiltradas.filter((v) => v.estado === "aprobada");
  const ingresos = aprobadas.reduce((sum, v) => sum + v.vehiculo.precio, 0);

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
              <h1 className="text-2xl font-black text-slate-900">
                Panel Vendedor
              </h1>
              <p className="text-slate-600 font-semibold">
                Dashboard demo con CRUD en memoria (ideal para la expo)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
              Rol: vendedor
            </span>

            <button
              onClick={() => {
                // “reset” rápido para demo
                if (!confirm("¿Reiniciar datos demo (mocks)?")) return;
                window.location.reload();
              }}
              className="text-xs font-black px-3 py-2 rounded-lg border-2 border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-2"
              type="button"
              title="Reiniciar datos demo"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border-2 border-slate-200 p-2 flex gap-2">
          <TabButton
            active={activeTab === "ventas"}
            onClick={() => setActiveTab("ventas")}
            icon={<FileText className="w-4 h-4" />}
          >
            Ventas
          </TabButton>
          <TabButton
            active={activeTab === "usuarios"}
            onClick={() => setActiveTab("usuarios")}
            icon={<Users className="w-4 h-4" />}
          >
            Usuarios
          </TabButton>
          <TabButton
            active={activeTab === "vehiculos"}
            onClick={() => setActiveTab("vehiculos")}
            icon={<Car className="w-4 h-4" />}
          >
            Vehículos
          </TabButton>
        </div>

        {/* CONTENIDO */}
        <div className="mt-6">
          {/* --------- VENTAS --------- */}
          {activeTab === "ventas" ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-slate-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Solicitudes de Venta
                      </h2>
                      <p className="text-slate-600">
                        Cambia estados (aprobar/rechazar) para demostrar flujo
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={filtroVentas}
                      onChange={(e) =>
                        setFiltroVentas(e.target.value as any)
                      }
                      className="px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-red-600 font-semibold"
                    >
                      <option value="todas">Todas</option>
                      <option value="pendiente">Pendientes</option>
                      <option value="aprobada">Aprobadas</option>
                      <option value="rechazada">Rechazadas</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {ventasFiltradas.map((venta) => (
                    <div
                      key={venta.id}
                      className="bg-slate-50 rounded-xl p-5 border-2 border-slate-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <p className="text-slate-900 font-black text-lg">
                            #{venta.id} — {venta.cliente}
                          </p>
                          <p className="text-slate-600 font-semibold text-sm">
                            Fecha: {venta.fecha}
                          </p>
                          <p className="text-slate-700 font-semibold mt-2">
                            Vehículo:{" "}
                            <span className="font-black">
                              {venta.vehiculo.marca} {venta.vehiculo.modelo}
                            </span>
                          </p>
                          <p className="text-red-600 font-black text-xl mt-1">
                            {money(venta.vehiculo.precio)}
                          </p>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-3">
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

                          <div className="flex gap-2">
                            <button
                              onClick={() => setEstadoVenta(venta.id, "aprobada")}
                              className="px-3 py-2 rounded-lg font-black text-sm bg-green-600 text-white hover:opacity-90 transition flex items-center gap-2"
                              type="button"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Aprobar
                            </button>
                            <button
                              onClick={() => setEstadoVenta(venta.id, "rechazada")}
                              className="px-3 py-2 rounded-lg font-black text-sm bg-red-600 text-white hover:opacity-90 transition flex items-center gap-2"
                              type="button"
                            >
                              <XCircle className="w-4 h-4" />
                              Rechazar
                            </button>
                            <button
                              onClick={() => setEstadoVenta(venta.id, "pendiente")}
                              className="px-3 py-2 rounded-lg font-black text-sm bg-slate-900 text-white hover:bg-slate-800 transition flex items-center gap-2"
                              type="button"
                              title="Volver a pendiente"
                            >
                              <Clock className="w-4 h-4" />
                              Pendiente
                            </button>
                          </div>
                        </div>
                      </div>

                      {venta.estado === "aprobada" && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border-2 border-green-200 mt-4">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <p className="text-sm font-bold text-green-700">
                            Venta aprobada y lista para facturación (demo)
                          </p>
                        </div>
                      )}

                      {venta.estado === "rechazada" && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border-2 border-red-200 mt-4">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <p className="text-sm font-bold text-red-700">
                            Solicitud rechazada (demo)
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  {ventasFiltradas.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-slate-200">
                      <Clock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500 text-lg font-semibold">
                        No hay solicitudes con este filtro
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  label="Total Solicitudes (filtradas)"
                  value={String(ventasFiltradas.length)}
                  icon={<FileText className="w-5 h-5 text-slate-600" />}
                />
                <StatCard
                  label="Ventas Aprobadas (filtradas)"
                  value={String(aprobadas.length)}
                  icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                />
                <StatCard
                  label="Ingresos Generados (filtrados)"
                  value={money(ingresos)}
                  icon={<Shield className="w-5 h-5 text-red-600" />}
                />
              </div>
            </div>
          ) : activeTab === "usuarios" ? (
            /* --------- USUARIOS --------- */
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Lista de Usuarios
                    </h2>
                    <p className="text-slate-600">
                      CRUD demo: crear / editar / eliminar / activar
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
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

                  <button
                    onClick={openCreateUser}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-black hover:opacity-90 transition flex items-center gap-2"
                    type="button"
                  >
                    <Plus className="w-4 h-4" />
                    Nuevo
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100 border-b-2 border-slate-300">
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">
                        Nombre
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">
                        Teléfono
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">
                        Dirección
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">
                        Cédula
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">
                        Rol
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((usuario) => (
                      <tr
                        key={usuario.id}
                        className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-4 font-bold text-slate-900">
                          {usuario.id}
                        </td>
                        <td className="px-4 py-4 font-semibold text-slate-900">
                          {usuario.nombre}
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {usuario.email}
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {usuario.telefono}
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {usuario.direccion}
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {usuario.cedula}
                        </td>
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
                              usuario.estado === "Activo"
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {usuario.estado}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditUser(usuario)}
                              className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                              title="Editar usuario"
                              type="button"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => toggleUserEstado(usuario.id)}
                              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
                              title="Activar / Inactivar"
                              type="button"
                            >
                              {usuario.estado === "Activo" ? (
                                <UserX className="w-4 h-4" />
                              ) : (
                                <UserCheck className="w-4 h-4" />
                              )}
                            </button>

                            <button
                              onClick={() => deleteUser(usuario.id)}
                              className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                              title="Eliminar usuario"
                              type="button"
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
                    <p className="text-slate-500 text-lg">
                      No hay usuarios con este filtro
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t-2 border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <MiniStat label="Total Usuarios" value={String(totalUsuarios)} />
                  <MiniStat label="Clientes" value={String(totalClientes)} />
                  <MiniStat label="Vendedores" value={String(totalVendedores)} />
                  <MiniStat
                    label="Administradores"
                    value={String(totalAdministradores)}
                  />
                </div>
              </div>

              {/* Modal usuario */}
              <UserModal
                open={userModalOpen}
                onClose={() => {
                  setUserModalOpen(false);
                  setEditingUser(null);
                }}
                initial={editingUser}
                onSave={saveUser}
              />
            </div>
          ) : (
            /* --------- VEHÍCULOS --------- */
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Gestión de Vehículos
                  </h2>
                  <p className="text-slate-600">
                    CRUD demo + botón para crear una venta pendiente (flujo de la expo)
                  </p>
                </div>

                <button
                  onClick={openCreateVeh}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-black hover:opacity-90 transition flex items-center gap-2"
                  type="button"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Vehículo
                </button>
              </div>

              <div className="space-y-3">
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-slate-50 border-2 border-slate-200 rounded-xl p-4"
                  >
                    <div>
                      <p className="font-black text-slate-900">
                        {v.marca} {v.modelo}
                      </p>
                      <p className="text-red-600 font-black">{money(v.precio)}</p>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        ID: {v.id}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => crearVentaMockDesdeVehiculo(v)}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg font-black hover:bg-slate-800 transition flex items-center gap-2"
                        type="button"
                        title="Crea una venta pendiente con este vehículo"
                      >
                        <FileText className="w-4 h-4" />
                        Generar venta
                      </button>

                      <button
                        onClick={() => openEditVeh(v)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-black hover:bg-blue-200 transition flex items-center gap-2"
                        type="button"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </button>

                      <button
                        onClick={() => deleteVeh(v.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-black hover:bg-red-200 transition flex items-center gap-2"
                        type="button"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <VehModal
                open={vehModalOpen}
                onClose={() => {
                  setVehModalOpen(false);
                  setEditingVeh(null);
                }}
                initial={editingVeh}
                onSave={saveVeh}
              />
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

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
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

/* -----------------------
   MODAL: USUARIO
------------------------ */
function UserModal({
  open,
  onClose,
  initial,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initial: Usuario | null;
  onSave: (payload: Omit<Usuario, "id">) => void;
}) {
  const [form, setForm] = useState<Omit<Usuario, "id">>(() => ({
    nombre: initial?.nombre ?? "",
    email: initial?.email ?? "",
    telefono: initial?.telefono ?? "",
    direccion: initial?.direccion ?? "",
    cedula: initial?.cedula ?? "",
    rol: initial?.rol ?? "cliente",
    estado: initial?.estado ?? "Activo",
  }));

  // sync cuando cambia initial
  React.useEffect(() => {
    setForm({
      nombre: initial?.nombre ?? "",
      email: initial?.email ?? "",
      telefono: initial?.telefono ?? "",
      direccion: initial?.direccion ?? "",
      cedula: initial?.cedula ?? "",
      rol: initial?.rol ?? "cliente",
      estado: initial?.estado ?? "Activo",
    });
  }, [initial, open]);

  if (!open) return null;

  const valid =
    form.nombre.trim() &&
    form.email.trim() &&
    form.telefono.trim() &&
    form.cedula.trim();

  return (
    <ModalShell title={initial ? "Editar usuario" : "Nuevo usuario"} onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombre">
          <input
            value={form.nombre}
            onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
            className="input"
            placeholder="Ej: Juan Pérez"
          />
        </Field>

        <Field label="Email">
          <input
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="input"
            placeholder="Ej: juan@mail.com"
          />
        </Field>

        <Field label="Teléfono">
          <input
            value={form.telefono}
            onChange={(e) => setForm((p) => ({ ...p, telefono: e.target.value }))}
            className="input"
            placeholder="Ej: 0999999999"
          />
        </Field>

        <Field label="Cédula">
          <input
            value={form.cedula}
            onChange={(e) => setForm((p) => ({ ...p, cedula: e.target.value }))}
            className="input"
            placeholder="Ej: 1712345678"
          />
        </Field>

        <Field label="Dirección">
          <input
            value={form.direccion}
            onChange={(e) => setForm((p) => ({ ...p, direccion: e.target.value }))}
            className="input"
            placeholder="Ej: Quito"
          />
        </Field>

        <Field label="Rol">
          <select
            value={form.rol}
            onChange={(e) => setForm((p) => ({ ...p, rol: e.target.value as any }))}
            className="input"
          >
            <option value="cliente">cliente</option>
            <option value="vendedor">vendedor</option>
            <option value="administrador">administrador</option>
          </select>
        </Field>

        <Field label="Estado">
          <select
            value={form.estado}
            onChange={(e) =>
              setForm((p) => ({ ...p, estado: e.target.value as any }))
            }
            className="input"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </Field>
      </div>

      <div className="flex items-center justify-end gap-2 mt-6">
        <button onClick={onClose} className="btn-secondary" type="button">
          Cancelar
        </button>
        <button
          onClick={() => {
            if (!valid) return alert("Completa al menos: nombre, email, teléfono, cédula.");
            onSave(form);
          }}
          className="btn-primary"
          type="button"
        >
          Guardar
        </button>
      </div>
    </ModalShell>
  );
}

/* -----------------------
   MODAL: VEHICULO
------------------------ */
function VehModal({
  open,
  onClose,
  initial,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initial: Vehiculo | null;
  onSave: (payload: Omit<Vehiculo, "id">) => void;
}) {
  const [form, setForm] = useState<Omit<Vehiculo, "id">>(() => ({
    marca: initial?.marca ?? "",
    modelo: initial?.modelo ?? "",
    precio: initial?.precio ?? 0,
  }));

  React.useEffect(() => {
    setForm({
      marca: initial?.marca ?? "",
      modelo: initial?.modelo ?? "",
      precio: initial?.precio ?? 0,
    });
  }, [initial, open]);

  if (!open) return null;

  const valid = form.marca.trim() && form.modelo.trim() && form.precio > 0;

  return (
    <ModalShell title={initial ? "Editar vehículo" : "Nuevo vehículo"} onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Marca">
          <input
            value={form.marca}
            onChange={(e) => setForm((p) => ({ ...p, marca: e.target.value }))}
            className="input"
            placeholder="Ej: Toyota"
          />
        </Field>

        <Field label="Modelo">
          <input
            value={form.modelo}
            onChange={(e) => setForm((p) => ({ ...p, modelo: e.target.value }))}
            className="input"
            placeholder="Ej: Corolla 2023"
          />
        </Field>

        <Field label="Precio">
          <input
            value={String(form.precio)}
            onChange={(e) => setForm((p) => ({ ...p, precio: Number(e.target.value || 0) }))}
            className="input"
            placeholder="Ej: 22000"
            type="number"
            min={0}
          />
        </Field>
      </div>

      <div className="flex items-center justify-end gap-2 mt-6">
        <button onClick={onClose} className="btn-secondary" type="button">
          Cancelar
        </button>
        <button
          onClick={() => {
            if (!valid) return alert("Completa marca, modelo y precio > 0.");
            onSave(form);
          }}
          className="btn-primary"
          type="button"
        >
          Guardar
        </button>
      </div>
    </ModalShell>
  );
}

/* -----------------------
   COMPONENTES UI BASE
------------------------ */
function ModalShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        type="button"
        aria-label="Cerrar"
      />
      {/* modal */}
      <div className="relative w-[92%] max-w-2xl bg-white rounded-2xl border-2 border-slate-200 shadow-2xl p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-black text-slate-900">{title}</h3>
            <p className="text-slate-600 font-semibold text-sm">
              Datos demo (se guardan en memoria mientras la app está abierta)
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100" type="button">
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        <div>{children}</div>

        {/* estilos utilitarios */}
        <style>{`
          .input {
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #cbd5e1; /* slate-300 */
            border-radius: 10px;
            outline: none;
            font-weight: 700;
            color: #0f172a;
          }
          .input:focus { border-color: #dc2626; } /* red-600 */

          .btn-primary {
            padding: 10px 14px;
            border-radius: 10px;
            background: #dc2626;
            color: white;
            font-weight: 900;
          }
          .btn-primary:hover { opacity: .9; }

          .btn-secondary {
            padding: 10px 14px;
            border-radius: 10px;
            background: white;
            border: 2px solid #e2e8f0;
            color: #0f172a;
            font-weight: 900;
          }
          .btn-secondary:hover { background: #f8fafc; }
        `}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-800">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
