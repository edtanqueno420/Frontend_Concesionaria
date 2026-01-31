import React from "react";
import {
  Car,
  Users,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { obtenerDashboard } from "../../services/dashboardService";

function Badge({ value }: { value: string }) {
  const base = "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold";
  const v = String(value ?? "").toLowerCase();
  if (v.includes("dispon")) return <span className={`${base} bg-emerald-50 text-emerald-700`}><CheckCircle2 className="w-3.5 h-3.5" /> Disponible</span>;
  if (v.includes("reserv")) return <span className={`${base} bg-amber-50 text-amber-700`}><AlertTriangle className="w-3.5 h-3.5" /> Reservado</span>;
  return <span className={`${base} bg-slate-100 text-slate-700`}><CheckCircle2 className="w-3.5 h-3.5" /> {value ?? "—"}</span>;
}

function SaleStatus({ value }: { value: string }) {
  const base = "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold";
  const v = String(value ?? "").toLowerCase();
  if (v.includes("complet")) return <span className={`${base} bg-emerald-50 text-emerald-700`}><CheckCircle2 className="w-3.5 h-3.5" /> Completada</span>;
  return <span className={`${base} bg-blue-50 text-blue-700`}><TrendingUp className="w-3.5 h-3.5" /> {value ?? "En proceso"}</span>;
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [kpis, setKpis] = React.useState({
    vehiculosDisponibles: 0,
    totalVentasMes: 0,
    clientesRegistrados: 0,
    solicitudesPendientes: 0,
  });

  const [vehiculosRecientes, setVehiculosRecientes] = React.useState<any[]>([]);
  const [ventasRecientes, setVentasRecientes] = React.useState<any[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await obtenerDashboard();
        setKpis(data.kpis);
        setVehiculosRecientes(data.vehiculosRecientes);
        setVentasRecientes(data.ventasRecientes);
      } catch (e: any) {
        setError(e?.message ?? "Error cargando dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const kpiCards = [
    { title: "Vehículos disponibles", value: kpis.vehiculosDisponibles.toString(), icon: Car, hint: "Inventario actual" },
    { title: "Ventas del mes", value: `$${kpis.totalVentasMes.toLocaleString()}`, icon: DollarSign, hint: "Total acumulado" },
    { title: "Clientes registrados", value: kpis.clientesRegistrados.toString(), icon: Users, hint: "Usuarios con rol cliente" },
    { title: "Solicitudes pendientes", value: kpis.solicitudesPendientes.toString(), icon: AlertTriangle, hint: "En proceso / por revisar" },
  ];

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Resumen general del sistema</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
            Acciones
          </button>
        </div>
      </div>

      {loading && <div className="text-slate-600">Cargando datos...</div>}
      {error && <div className="text-red-600 font-semibold">{error}</div>}

      {/* KPIs */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((k, i) => {
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

      <section className="grid lg:grid-cols-3 gap-4">
        {/* Vehículos recientes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Vehículos recientes</h2>
              <p className="text-sm text-slate-500">Últimos agregados/actualizados</p>
            </div>
            <button
              onClick={() => navigate("/admin/vehiculos")}
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
                    <td className="p-3 font-semibold text-slate-700">{v?.codigo ?? v?.id ?? "—"}</td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-900">
                        {v?.version?.modelo?.marca?.nombre ?? v?.marca ?? "—"}{" "}
                        {v?.version?.modelo?.nombre ?? v?.modelo ?? "—"}
                      </p>
                      <p className="text-xs text-slate-500">Catálogo / Inventario</p>
                    </td>
                    <td className="p-3 text-slate-700">{v?.version?.anio ?? v?.anio ?? "—"}</td>
                    <td className="p-3 font-bold text-slate-900">
                      ${Number(v?.precio_final ?? v?.precio ?? 0).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <Badge value={v?.estado ?? v?.status ?? "—"} />
                    </td>
                    <td className="p-3 text-right">
                      <button className="p-2 rounded-lg hover:bg-slate-100">
                        <MoreVertical className="w-5 h-5 text-slate-600" />
                      </button>
                    </td>
                  </tr>
                ))}

                {!loading && vehiculosRecientes.length === 0 && (
                  <tr>
                    <td className="p-6 text-slate-500" colSpan={6}>
                      No hay vehículos recientes.
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
                    <p className="text-sm font-bold text-slate-900">
                      {s?.vehiculo?.nombre ?? s?.vehiculo ?? "Venta"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {s?.codigo ?? s?.id ?? "—"} • Cliente:{" "}
                      <span className="font-semibold">{s?.cliente?.nombre ?? s?.cliente ?? "—"}</span>
                    </p>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-slate-100">
                    <MoreVertical className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">
                    ${Number(s?.total ?? s?.monto_total ?? 0).toLocaleString()}
                  </p>
                  <SaleStatus value={s?.status ?? s?.estado ?? "En proceso"} />
                </div>
              </div>
            ))}

            <button
              onClick={() => navigate("/admin/ventas")}
              className="w-full mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
            >
              Ver ventas
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
