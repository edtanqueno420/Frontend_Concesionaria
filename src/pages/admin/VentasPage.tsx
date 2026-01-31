import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios"; // ajusta si tu ruta es otra

type Venta = {
  id: number;

  usuarioId: number;
  vehiculoId: number;

  precioFinal: number;
  tipoCompra: string;

  // opcional: si tu backend lo tiene
  estado?: string;

  // opcional: si tu backend devuelve relaciones
  usuario?: { nombre?: string; apellido?: string; email?: string };
  vehiculo?: { vin?: string; color?: string; precio_final?: number };
};

type VentaForm = {
  usuarioId: number;
  vehiculoId: number;
  precioFinal: number;
  tipoCompra: string;
  estado?: string;
};

export default function VentasPage() {
  const [items, setItems] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // búsqueda
  const [search, setSearch] = useState("");

  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Venta | null>(null);

  const [form, setForm] = useState<VentaForm>({
    usuarioId: 0,
    vehiculoId: 0,
    precioFinal: 0,
    tipoCompra: "Contado",
    estado: "PENDIENTE", // si no existe en tu backend, borra esta línea y el campo
  });

  const VENTAS_ENDPOINT = "/ventas";

  async function loadVentas() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(VENTAS_ENDPOINT);
      const list = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setItems(list);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error cargando ventas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVentas();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((v) => {
      const usuario = `${v?.usuario?.nombre ?? ""} ${v?.usuario?.apellido ?? ""}`.toLowerCase();
      const vehiculo = `${v?.vehiculo?.vin ?? ""} ${v?.vehiculo?.color ?? ""}`.toLowerCase();

      return (
        String(v.id).includes(q) ||
        String(v.usuarioId).includes(q) ||
        String(v.vehiculoId).includes(q) ||
        String(v.precioFinal).includes(q) ||
        (v.tipoCompra ?? "").toLowerCase().includes(q) ||
        (v.estado ?? "").toLowerCase().includes(q) ||
        usuario.includes(q) ||
        vehiculo.includes(q)
      );
    });
  }, [items, search]);

  function openCreate() {
    setEditing(null);
    setForm({
      usuarioId: 0,
      vehiculoId: 0,
      precioFinal: 0,
      tipoCompra: "Contado",
      estado: "PENDIENTE",
    });
    setOpen(true);
  }

  function openEdit(v: Venta) {
    setEditing(v);
    setForm({
      usuarioId: Number(v.usuarioId ?? 0),
      vehiculoId: Number(v.vehiculoId ?? 0),
      precioFinal: Number(v.precioFinal ?? 0),
      tipoCompra: v.tipoCompra ?? "Contado",
      estado: v.estado ?? "PENDIENTE",
    });
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditing(null);
  }

  function validate() {
    if (!Number.isFinite(Number(form.usuarioId)) || Number(form.usuarioId) <= 0)
      return "usuarioId debe ser mayor a 0";
    if (!Number.isFinite(Number(form.vehiculoId)) || Number(form.vehiculoId) <= 0)
      return "vehiculoId debe ser mayor a 0";
    if (!Number.isFinite(Number(form.precioFinal)) || Number(form.precioFinal) <= 0)
      return "precioFinal debe ser mayor a 0";
    if (!String(form.tipoCompra ?? "").trim()) return "tipoCompra es obligatorio";
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
        vehiculoId: Number(form.vehiculoId),
        precioFinal: Number(form.precioFinal),
        tipoCompra: String(form.tipoCompra).trim(),
      };

      // si tu backend soporta estado:
      if (form.estado) payload.estado = form.estado;

      if (editing) {
        await api.patch(`${VENTAS_ENDPOINT}/${editing.id}`, payload);
      } else {
        await api.post(VENTAS_ENDPOINT, payload);
      }

      closeModal();
      await loadVentas();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error guardando venta");
    }
  }

  async function remove(v: Venta) {
    if (!confirm(`¿Eliminar venta #${v.id}?`)) return;

    try {
      setError(null);
      await api.delete(`${VENTAS_ENDPOINT}/${v.id}`);
      await loadVentas();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error eliminando venta");
    }
  }

  // ✅ si quieres “cambiar estado rápido” desde la tabla
  async function changeEstado(id: number, estado: string) {
    try {
      setError(null);
      await api.patch(`${VENTAS_ENDPOINT}/${id}`, { estado });
      await loadVentas();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error actualizando estado");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Ventas</h1>
          <p className="text-slate-600">Lista ventas y cambia estados.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
          >
            Nueva venta
          </button>
          <button className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800">
            Exportar
          </button>
        </div>
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
            placeholder="Buscar por id, usuarioId, vehiculoId, estado..."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs text-slate-600">
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">Usuario</th>
                <th className="p-3 font-semibold">Vehículo</th>
                <th className="p-3 font-semibold">Tipo</th>
                <th className="p-3 font-semibold">Total</th>
                <th className="p-3 font-semibold">Estado</th>
                <th className="p-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="p-3 text-slate-700">{v.id}</td>

                  <td className="p-3 text-slate-700">
                    <div className="font-semibold text-slate-900">
                      {v?.usuario?.nombre ? `${v.usuario.nombre} ${v.usuario.apellido ?? ""}` : `usuarioId: ${v.usuarioId}`}
                    </div>
                    <div className="text-xs text-slate-500">{v?.usuario?.email ?? ""}</div>
                  </td>

                  <td className="p-3 text-slate-700">
                    <div className="font-semibold text-slate-900">
                      {v?.vehiculo?.vin ?? `vehiculoId: ${v.vehiculoId}`}
                    </div>
                    <div className="text-xs text-slate-500">{v?.vehiculo?.color ?? ""}</div>
                  </td>

                  <td className="p-3 text-slate-700">{v.tipoCompra}</td>

                  <td className="p-3 text-slate-900 font-bold">
                    ${Number(v.precioFinal ?? 0).toLocaleString()}
                  </td>

                  <td className="p-3 text-slate-700">
                    {/* Si no tienes estado en backend, puedes mostrar solo texto */}
                    {typeof v.estado === "string" ? (
                      <select
                        value={v.estado}
                        onChange={(e) => changeEstado(v.id, e.target.value)}
                        className="px-2 py-1 rounded-lg border border-slate-200 text-sm bg-white"
                      >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="COMPLETADA">COMPLETADA</option>
                        <option value="CANCELADA">CANCELADA</option>
                      </select>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => openEdit(v)}
                      className="px-3 py-1 rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
                    >
                      Editar
                    </button>{" "}
                    <button
                      onClick={() => remove(v)}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td className="p-6 text-slate-500" colSpan={7}>
                    No hay ventas (o no coincide la búsqueda).
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
                {editing ? "Editar venta" : "Nueva venta"}
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
                  <label className="text-sm font-semibold text-slate-700">usuarioId *</label>
                  <input
                    type="number"
                    value={form.usuarioId}
                    onChange={(e) => setForm((p) => ({ ...p, usuarioId: Number(e.target.value) }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">vehiculoId *</label>
                  <input
                    type="number"
                    value={form.vehiculoId}
                    onChange={(e) => setForm((p) => ({ ...p, vehiculoId: Number(e.target.value) }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700">precioFinal *</label>
                  <input
                    type="number"
                    value={form.precioFinal}
                    onChange={(e) => setForm((p) => ({ ...p, precioFinal: Number(e.target.value) }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">tipoCompra *</label>
                  <input
                    value={form.tipoCompra}
                    onChange={(e) => setForm((p) => ({ ...p, tipoCompra: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    placeholder="Contado / Financiamiento..."
                    required
                  />
                </div>
              </div>

              {/* Si tu backend maneja estado, lo puedes dejar */}
              {"estado" in form && (
                <div>
                  <label className="text-sm font-semibold text-slate-700">estado</label>
                  <select
                    value={form.estado ?? "PENDIENTE"}
                    onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="COMPLETADA">COMPLETADA</option>
                    <option value="CANCELADA">CANCELADA</option>
                  </select>
                </div>
              )}

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
