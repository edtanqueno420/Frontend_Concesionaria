import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios"; // 👈 cambia a "../api/axios" si tu archivo está en otra carpeta

type Vehiculo = {
  id: number;
  vin: string;
  color: string;
  precio_final: number;
  versionId?: number;

  // si tu backend devuelve relación:
  version?: {
    anio?: number;
    modelo?: {
      nombre?: string;
      marca?: { nombre?: string };
    };
  };
};

type VehiculoForm = {
  vin: string;
  color: string;
  precio_final: number;
  versionId: number;
};

export default function VehiculosPage() {
  const [items, setItems] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // buscar
  const [search, setSearch] = useState("");

  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Vehiculo | null>(null);

  const [form, setForm] = useState<VehiculoForm>({
    vin: "",
    color: "",
    precio_final: 0,
    versionId: 0,
  });

  const loadVehiculos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/vehiculos");
      // por si tu API devuelve array directo:
      const list = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setItems(list);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error cargando vehículos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehiculos();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((v) => {
      const marca = v?.version?.modelo?.marca?.nombre ?? "";
      const modelo = v?.version?.modelo?.nombre ?? "";
      const anio = String(v?.version?.anio ?? "");
      return (
        String(v.id).includes(q) ||
        (v.vin ?? "").toLowerCase().includes(q) ||
        (v.color ?? "").toLowerCase().includes(q) ||
        marca.toLowerCase().includes(q) ||
        modelo.toLowerCase().includes(q) ||
        anio.includes(q)
      );
    });
  }, [items, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ vin: "", color: "", precio_final: 0, versionId: 0 });
    setOpen(true);
  };

  const openEdit = (v: Vehiculo) => {
    setEditing(v);
    setForm({
      vin: v.vin ?? "",
      color: v.color ?? "",
      precio_final: Number(v.precio_final ?? 0),
      versionId: Number(v.versionId ?? 0),
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditing(null);
  };

  const saveVehiculo = async (e: React.FormEvent) => {
    e.preventDefault();

    // validaciones front rápidas
    if (!form.vin.trim()) return setError("VIN es obligatorio");
    if (!form.color.trim()) return setError("Color es obligatorio");
    if (!Number.isFinite(Number(form.precio_final))) return setError("Precio inválido");
    if (!Number.isFinite(Number(form.versionId)) || Number(form.versionId) <= 0)
      return setError("versionId debe ser un número mayor a 0");

    try {
      setError(null);

      if (editing) {
        await api.patch(`/vehiculos/${editing.id}`, {
          vin: form.vin.trim(),
          color: form.color.trim(),
          precio_final: Number(form.precio_final),
          versionId: Number(form.versionId),
        });
      } else {
        await api.post("/vehiculos", {
          vin: form.vin.trim(),
          color: form.color.trim(),
          precio_final: Number(form.precio_final),
          versionId: Number(form.versionId),
        });
      }

      closeModal();
      await loadVehiculos();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error guardando vehículo");
    }
  };

  const deleteVehiculo = async (v: Vehiculo) => {
    if (!confirm(`¿Eliminar vehículo ${v.vin}?`)) return;

    try {
      setError(null);
      await api.delete(`/vehiculos/${v.id}`);
      await loadVehiculos();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error eliminando vehículo");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Vehículos</h1>
          <p className="text-slate-600">Administra el inventario (crear, editar, eliminar).</p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
        >
          Nuevo vehículo
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
            placeholder="Buscar por vin, color, marca, modelo..."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs text-slate-600">
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">VIN</th>
                <th className="p-3 font-semibold">Color</th>
                <th className="p-3 font-semibold">Marca / Modelo</th>
                <th className="p-3 font-semibold">Año</th>
                <th className="p-3 font-semibold">Precio</th>
                <th className="p-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="p-3 text-slate-700">{v.id}</td>
                  <td className="p-3 text-slate-700 font-semibold">{v.vin}</td>
                  <td className="p-3 text-slate-700">{v.color}</td>

                  <td className="p-3 text-slate-700">
                    <span className="font-semibold text-slate-900">
                      {v?.version?.modelo?.marca?.nombre ?? "—"} {v?.version?.modelo?.nombre ?? "—"}
                    </span>
                    <div className="text-xs text-slate-500">versionId: {v.versionId ?? "—"}</div>
                  </td>

                  <td className="p-3 text-slate-700">{v?.version?.anio ?? "—"}</td>

                  <td className="p-3 text-slate-700 font-bold">
                    ${Number(v.precio_final ?? 0).toLocaleString()}
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => openEdit(v)}
                      className="px-3 py-1 rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
                    >
                      Editar
                    </button>{" "}
                    <button
                      onClick={() => deleteVehiculo(v)}
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
                    No hay vehículos (o no coinciden con la búsqueda).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREATE/EDIT */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {editing ? "Editar vehículo" : "Nuevo vehículo"}
              </h2>
              <button onClick={closeModal} className="px-3 py-1 rounded-lg hover:bg-slate-100">
                Cerrar
              </button>
            </div>

            <form onSubmit={saveVehiculo} className="p-4 space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700">VIN *</label>
                  <input
                    value={form.vin}
                    onChange={(e) => setForm((p) => ({ ...p, vin: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    placeholder="Ej: 1HGCM82633A123456"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Color *</label>
                  <input
                    value={form.color}
                    onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    placeholder="Rojo, Negro..."
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Precio final *</label>
                  <input
                    type="number"
                    value={form.precio_final}
                    onChange={(e) => setForm((p) => ({ ...p, precio_final: Number(e.target.value) }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">versionId *</label>
                  <input
                    type="number"
                    value={form.versionId}
                    onChange={(e) => setForm((p) => ({ ...p, versionId: Number(e.target.value) }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    placeholder="Ej: 1"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Este ID debe existir en tu tabla/colección de versiones.
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
