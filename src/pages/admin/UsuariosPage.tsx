import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios"; // 👈 ajusta ruta si es necesario

type Usuario = {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: string; // "ADMIN" | "CLIENTE" | "VENDEDOR" (depende tu enum)
};

type UsuarioForm = {
  email: string;
  password: string; // solo se usa al crear o si quieres cambiarla
  nombre: string;
  apellido: string;
  rol: string;
};

const ROLES = ["ADMIN", "CLIENTE", "VENDEDOR"]; // 👈 cambia a como lo tengas en tu enum real

export default function UsuariosPage() {
  const [items, setItems] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // búsqueda
  const [search, setSearch] = useState("");

  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null);

  const [form, setForm] = useState<UsuarioForm>({
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    rol: "CLIENTE",
  });

  // ✅ CAMBIA AQUÍ si tu endpoint real es /auth/users
  const USERS_ENDPOINT = "/usuarios"; // o "/auth/users"

  async function loadUsuarios() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(USERS_ENDPOINT);
      const list = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setItems(list);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsuarios();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((u) => {
      return (
        String(u.id).includes(q) ||
        (u.email ?? "").toLowerCase().includes(q) ||
        (u.nombre ?? "").toLowerCase().includes(q) ||
        (u.apellido ?? "").toLowerCase().includes(q) ||
        (u.rol ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, search]);

  function openCreate() {
    setEditing(null);
    setForm({
      email: "",
      password: "",
      nombre: "",
      apellido: "",
      rol: "CLIENTE",
    });
    setOpen(true);
  }

  function openEdit(u: Usuario) {
    setEditing(u);
    setForm({
      email: u.email ?? "",
      password: "", // no lo rellenamos
      nombre: u.nombre ?? "",
      apellido: u.apellido ?? "",
      rol: u.rol ?? "CLIENTE",
    });
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditing(null);
  }

  function validate() {
    if (!form.email.trim()) return "Email es obligatorio";
    if (!form.nombre.trim()) return "Nombre es obligatorio";
    if (!form.apellido.trim()) return "Apellido es obligatorio";
    if (!form.rol) return "Rol es obligatorio";

    // password: requerido SOLO al crear
    if (!editing) {
      if (!form.password || form.password.length < 6) return "Password mínimo 6 caracteres";
    }
    // si está editando y escribió password, validar mínimo
    if (editing && form.password && form.password.length < 6) {
      return "Password mínimo 6 caracteres";
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

      if (editing) {
        // Editar: NO mandamos password si está vacío
        const payload: any = {
          email: form.email.trim(),
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          rol: form.rol,
        };
        if (form.password) payload.password = form.password;

        await api.patch(`${USERS_ENDPOINT}/${editing.id}`, payload);
      } else {
        // Crear: manda todo como tu DTO
        await api.post(USERS_ENDPOINT, {
          email: form.email.trim(),
          password: form.password,
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          rol: form.rol,
        });
      }

      closeModal();
      await loadUsuarios();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error guardando usuario");
    }
  }

  async function remove(u: Usuario) {
    if (!confirm(`¿Eliminar usuario ${u.email}?`)) return;

    try {
      setError(null);
      await api.delete(`${USERS_ENDPOINT}/${u.id}`);
      await loadUsuarios();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error eliminando usuario");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-slate-600">Administra clientes, vendedores y admins.</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
        >
          Nuevo usuario
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
            placeholder="Buscar por email, nombre, rol..."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs text-slate-600">
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">Nombre</th>
                <th className="p-3 font-semibold">Apellido</th>
                <th className="p-3 font-semibold">Email</th>
                <th className="p-3 font-semibold">Rol</th>
                <th className="p-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="p-3 text-slate-700">{u.id}</td>
                  <td className="p-3 text-slate-900 font-semibold">{u.nombre}</td>
                  <td className="p-3 text-slate-700">{u.apellido}</td>
                  <td className="p-3 text-slate-700">{u.email}</td>
                  <td className="p-3 text-slate-700">{u.rol}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => openEdit(u)}
                      className="px-3 py-1 rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
                    >
                      Editar
                    </button>{" "}
                    <button
                      onClick={() => remove(u)}
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
                    No hay usuarios (o no coincide la búsqueda).
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
                {editing ? "Editar usuario" : "Nuevo usuario"}
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
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Apellido *</label>
                  <input
                    value={form.apellido}
                    onChange={(e) => setForm((p) => ({ ...p, apellido: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Rol *</label>
                  <select
                    value={form.rol}
                    onChange={(e) => setForm((p) => ({ ...p, rol: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Password {editing ? "(opcional)" : "*"}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                  placeholder={editing ? "Deja vacío para no cambiarla" : "Mínimo 6 caracteres"}
                  required={!editing}
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