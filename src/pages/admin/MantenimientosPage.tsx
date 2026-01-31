import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios"; // ajusta si tu ruta es otra

type Version = {
  id: number;
  nombre: string;
  anio: number;
  motor: string;
  transmision: string;
  combustible: string;
  precio: number;
  modeloId: number;

  // opcional si backend devuelve relación:
  modelo?: {
    nombre?: string;
    marca?: { nombre?: string };
  };
};

type VersionForm = {
  nombre: string;
  anio: number;
  motor: string;
  transmision: string;
  combustible: string;
  precio: number;
  modeloId: number;
};

export default function VersionesPage() {
  const [items, setItems] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // buscar
  const [search, setSearch] = useState("");

  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Version | null>(null);

  const [form, setForm] = useState<VersionForm>({
    nombre: "",
    anio: new Date().getFullYear(),
    motor: "",
    transmision: "",
    combustible: "",
    precio: 0,
    modeloId: 0,
  });

  const ENDPOINT = "/versiones"; // 👈 cambia si tu backend usa otra ruta

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(ENDPOINT);
      const list = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setItems(list);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error cargando versiones");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((v) => {
      const modelo = v?.modelo?.nombre ?? "";
      const marca = v?.modelo?.marca?.nombre ?? "";
      return (
        String(v.id).includes(q) ||
        v.nombre.toLowerCase().includes(q) ||
        String(v.anio).includes(q) ||
        v.motor.toLowerCase().includes(q) ||
        v.transmision.toLowerCase().includes(q) ||
        v.combustible.toLowerCase().includes(q) ||
        String(v.precio).includes(q) ||
        String(v.modeloId).includes(q) ||
        modelo.toLowerCase().includes(q) ||
        marca.toLowerCase().includes(q)
      );
    });
  }, [items, search]);

  function openCreate() {
    setEditing(null);
    setForm({
      nombre: "",
      anio: new Date().getFullYear(),
      motor: "",
      transmision: "",
      combustible: "",
      precio: 0,
      modeloId: 0,
    });
    setOpen(true);
  }

  function openEdit(v: Version) {
    setEditing(v);
    setForm({
      nombre: v.nombre ?? "",
      anio: Number(v.anio ?? new Date().getFullYear()),
      motor: v.motor ?? "",
      transmision: v.transmision ?? "",
      combustible: v.combustible ?? "",
      precio: Number(v.precio ?? 0),
      modeloId: Number(v.modeloId ?? 0),
    });
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditing(null);
  }

  function validate() {
    if (!form.nombre.trim()) return "Nombre es obligatorio";
    if (!Number.isFinite(Number(form.anio))) return "Año inválido";
    if (!form.motor.trim()) return "Motor es obligatorio";
    if (!form.transmision.trim()) return "Transmisión es obligatoria";
    if (!form.combustible.trim()) return "Combustible es obligatorio";
    if (!Number.isFinite(Number(form.precio)) || Number(form.precio) < 0) return "Precio inválido";
    if (!Number.isFinite(Number(form.modeloId)) || Number(form.modeloId) <= 0)
      return "modeloId debe ser mayor a 0";
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

      const payload = {
        nombre: form.nombre.trim(),
        anio: Number(form.anio),
        motor: form.motor.trim(),
        transmision: form.transmision.trim(),
        combustible: form.combustible.trim(),
        precio: Number(form.precio),
        modeloId: Number(form.modeloId),
      };

      if (editing) {
        await api.patch(`${ENDPOINT}/${editing.id}`, payload);
      } else {
        await api.post(ENDPOINT, payload);
      }

      closeModal();
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error guardando versión");
    }
  }

  async function remove(v: Version) {
    if (!confirm(`¿Eliminar la versión "${v.nombre}"?`)) return;

    try {
      setError(null);
      await api.delete(`${ENDPOINT}/${v.id}`);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error eliminando versión");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Versiones</h1>
          <p className="text-slate-600">Gestiona versiones por modelo (crear, editar, eliminar).</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
        >
          Nueva versión
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
            placeholder="Buscar por nombre, motor, modeloId..."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs text-slate-600">
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">Nombre</th>
                <th className="p-3 font-semibold">Año</th>
                <th className="p-3 font-semibold">Motor</th>
                <th className="p-3 font-semibold">Transmisión</th>
                <th className="p-3 font-semibold">Combustible</th>
                <th className="p-3 font-semibold">Precio</th>
                <th className="p-3 font-semibold">Modelo</th>
                <th className="p-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="p-3 text-slate-700">{v.id}</td>
                  <td className="p-3 text-slate-900 font-semibold">{v.nombre}</td>
                  <td className="p-3 text-slate-700">{v.anio}</td>
                  <td className="p-3 text-slate-700">{v.motor}</td>
                  <td className="p-3 text-slate-700">{v.transmision}</td>
                  <td className="p-3 text-slate-700">{v.combustible}</td>
                  <td className="p-3 text-slate-900 font-bold">
                    ${Number(v.precio ?? 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-slate-700">
                    {v?.modelo?.marca?.nombre || v?.modelo?.nombre ? (
                      <span className="font-semibold text-slate-900">
                        {v?.modelo?.marca?.nombre ?? ""} {v?.modelo?.nombre ?? ""}
                      </span>
                    ) : (
                      <span>modeloId: {v.modeloId}</span>
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
                  <td className="p-6 text-slate-500" colSpan={9}>
                    No hay versiones (o no coincide la búsqueda).
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
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {editing ? "Editar versión" : "Nueva versión"}
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
                  <label className="text-sm font-semibold text-slate-700">Nombre *</label>
                  <input
                    value={form.nombre}
                    onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    placeholder="Ej: Full Equipo"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Año *</label>
                  <input
                    type="number"
                    value={form.anio}
                    onChange={(e) => setForm((p) => ({ ...p, anio: Number(e.target.value) }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Motor *</label>
                  <input
                    value={form.motor}
                    onChange={(e) => setForm((p) => ({ ...p, motor: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Transmisión *</label>
                  <input
                    value={form.transmision}
                    onChange={(e) => setForm((p) => ({ ...p, transmision: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Combustible *</label>
                  <input
                    value={form.combustible}
                    onChange={(e) => setForm((p) => ({ ...p, combustible: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Precio *</label>
                  <input
                    type="number"
                    value={form.precio}
                    onChange={(e) => setForm((p) => ({ ...p, precio: Number(e.target.value) }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">modeloId *</label>
                  <input
                    type="number"
                    value={form.modeloId}
                    onChange={(e) => setForm((p) => ({ ...p, modeloId: Number(e.target.value) }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Debe existir en tu tabla/colección de modelos.
                  </p>
                </div>
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
