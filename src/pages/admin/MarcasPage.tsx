import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios"; // 👈 cambia a "../api/axios" si tu page está en otra carpeta

type Marca = {
  id: number;
  nombre: string;
};

export default function MarcasPage() {
  const [items, setItems] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // búsqueda
  const [search, setSearch] = useState("");

  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Marca | null>(null);
  const [nombre, setNombre] = useState("");

  async function loadMarcas() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/marcas");
      const list = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setItems(list);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error cargando marcas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMarcas();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((m) => m.nombre.toLowerCase().includes(q) || String(m.id).includes(q));
  }, [items, search]);

  function openCreate() {
    setEditing(null);
    setNombre("");
    setOpen(true);
  }

  function openEdit(m: Marca) {
    setEditing(m);
    setNombre(m.nombre);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditing(null);
    setNombre("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();

    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      setError(null);

      if (editing) {
        await api.patch(`/marcas/${editing.id}`, { nombre: nombre.trim() });
        // si tu backend usa PUT:
        // await api.put(`/marcas/${editing.id}`, { nombre: nombre.trim() });
      } else {
        await api.post("/marcas", { nombre: nombre.trim() });
      }

      closeModal();
      await loadMarcas();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error guardando marca");
    }
  }

  async function remove(m: Marca) {
    if (!confirm(`¿Eliminar la marca "${m.nombre}"?`)) return;

    try {
      setError(null);
      await api.delete(`/marcas/${m.id}`);
      await loadMarcas();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error eliminando marca");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Marcas</h1>
          <p className="text-slate-600">Gestiona marcas y logos.</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
        >
          Nueva marca
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
            placeholder="Buscar por id o nombre..."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs text-slate-600">
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">Nombre</th>
                <th className="p-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="p-3 text-slate-700">{m.id}</td>
                  <td className="p-3 text-slate-900 font-semibold">{m.nombre}</td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => openEdit(m)}
                      className="px-3 py-1 rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
                    >
                      Editar
                    </button>{" "}
                    <button
                      onClick={() => remove(m)}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td className="p-6 text-slate-500" colSpan={3}>
                    No hay marcas (o no coincide la búsqueda).
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
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {editing ? "Editar marca" : "Nueva marca"}
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
              <div>
                <label className="text-sm font-semibold text-slate-700">Nombre *</label>
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                  placeholder="Ej: Toyota"
                  required
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
