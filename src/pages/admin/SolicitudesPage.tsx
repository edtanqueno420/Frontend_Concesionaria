import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios"; // 👈 ajusta ruta si es necesario

type Solicitud = {
  id: number;
  usuarioId: number;
  vehiculoActual: string;
  valorEstimado?: number;
  observaciones?: string;
  createdAt?: string;
  updatedAt?: string;
};

type SolicitudForm = {
  usuarioId: string;
  vehiculoActual: string;
  valorEstimado: string; // string para input (luego lo convertimos)
  observaciones: string;
};

export default function SolicitudesPage() {
  const [items, setItems] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // búsqueda
  const [search, setSearch] = useState("");

  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Solicitud | null>(null);

  const [form, setForm] = useState<SolicitudForm>({
    usuarioId: "",
    vehiculoActual: "",
    valorEstimado: "",
    observaciones: "",
  });

  // ✅ CAMBIA AQUÍ si tu endpoint real es /api/solicitudes
  const SOLICITUDES_ENDPOINT = "/solicitudes";

  async function loadSolicitudes() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(SOLICITUDES_ENDPOINT);
      const list = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setItems(list);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error cargando solicitudes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSolicitudes();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((s) => {
      return (
        String(s.id).includes(q) ||
        String(s.usuarioId).includes(q) ||
        (s.vehiculoActual ?? "").toLowerCase().includes(q) ||
        String(s.valorEstimado ?? "").includes(q) ||
        (s.observaciones ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, search]);

  function openCreate() {
    setEditing(null);
    setForm({
      usuarioId: "",
      vehiculoActual: "",
      valorEstimado: "",
      observaciones: "",
    });
    setOpen(true);
  }

  function openEdit(s: Solicitud) {
    setEditing(s);
    setForm({
      usuarioId: String(s.usuarioId ?? ""),
      vehiculoActual: s.vehiculoActual ?? "",
      valorEstimado: s.valorEstimado != null ? String(s.valorEstimado) : "",
      observaciones: s.observaciones ?? "",
    });
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditing(null);
  }

  function validate() {
    if (!form.usuarioId.trim()) return "usuarioId es obligatorio";
    if (!form.vehiculoActual.trim()) return "vehiculoActual es obligatorio";

    const userId = Number(form.usuarioId);
    if (!Number.isFinite(userId)) return "usuarioId debe ser un número";

    if (form.valorEstimado.trim()) {
      const ve = Number(form.valorEstimado);
      if (!Number.isFinite(ve)) return "valorEstimado debe ser un número";
    }

    return null;
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setError(null);

      const payload: any = {
        usuarioId: Number(form.usuarioId),
        vehiculoActual: form.vehiculoActual.trim(),
      };

      // opcionales SOLO si vienen con valor
      if (form.valorEstimado.trim()) payload.valorEstimado = Number(form.valorEstimado);
      if (form.observaciones.trim()) payload.observaciones = form.observaciones.trim();

      if (editing) {
        await api.patch(`${SOLICITUDES_ENDPOINT}/${editing.id}`, payload);
      } else {
        await api.post(SOLICITUDES_ENDPOINT, payload);
      }

      closeModal();
      await loadSolicitudes();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error guardando solicitud");
    }
  }

  async function remove(s: Solicitud) {
    if (!confirm(`¿Eliminar solicitud #${s.id}?`)) return;

    try {
      setError(null);
      await api.delete(`${SOLICITUDES_ENDPOINT}/${s.id}`);
      await loadSolicitudes();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error eliminando solicitud");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Solicitudes</h1>
          <p className="text-slate-600">Administra solicitudes de clientes.</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
        >
          Nueva solicitud
        </button>
      </div>

      {loading && <div className="text-slate-600">Cargando...</div>}
      {error && <div className="text-red-600 font-semibold">{error}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3">
          <p className="font-semibold text-slate-900">Listado</p>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 outline-none text-sm w-72"
            placeholder="Buscar por id, usuarioId, vehículo..."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs text-slate-600">
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">Usuario ID</th>
                <th className="p-3 font-semibold">Vehículo Actual</th>
                <th className="p-3 font-semibold">Valor Estimado</th>
                <th className="p-3 font-semibold">Observaciones</th>
                <th className="p-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="p-3 text-slate-700">{s.id}</td>
                  <td className="p-3 text-slate-700">{s.usuarioId}</td>
                  <td className="p-3 text-slate-900 font-semibold">{s.vehiculoActual}</td>
                  <td className="p-3 text-slate-700">
                    {s.valorEstimado != null ? `$${Number(s.valorEstimado).toLocaleString()}` : "—"}
                  </td>
                  <td className="p-3 text-slate-700">{s.observaciones ?? "—"}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => openEdit(s)}
                      className="px-3 py-1 rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
                    >
                      Editar
                    </button>{" "}
                    <button
                      onClick={() => remove(s)}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td className="p-6 text-slate-500" colSpan={6}>
                    No hay solicitudes (o no coincide la búsqueda).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL create/edit */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {editing ? "Editar solicitud" : "Nueva solicitud"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="px-3 py-1 rounded-lg hover:bg-slate-100"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={save} className="p-4 space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Usuario ID *</label>
                  <input
                    value={form.usuarioId}
                    onChange={(e) => setForm((p) => ({ ...p, usuarioId: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    placeholder="Ej: 1"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Valor Estimado (opcional)</label>
                  <input
                    value={form.valorEstimado}
                    onChange={(e) => setForm((p) => ({ ...p, valorEstimado: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    placeholder="Ej: 12000"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Vehículo Actual *</label>
                <input
                  value={form.vehiculoActual}
                  onChange={(e) => setForm((p) => ({ ...p, vehiculoActual: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                  placeholder="Ej: Toyota Yaris 2018"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Observaciones (opcional)</label>
                <textarea
                  value={form.observaciones}
                  onChange={(e) => setForm((p) => ({ ...p, observaciones: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 min-h-[90px]"
                  placeholder="Ej: Quiero retomar y pagar la diferencia"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
