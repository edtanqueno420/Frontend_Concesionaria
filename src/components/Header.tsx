import {
  Mail,
  LogOut,
  User as UserIcon,
  Users,
  Shield,
  X,
  Instagram,
  Facebook,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { YECLogo } from "./YECLogo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onNavigateVendedorPanel?: () => void;
}

export function Header({ onNavigateVendedorPanel }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout, isVendedorOrAdmin, isAuthenticated } = useAuth();

  const [openContacto, setOpenContacto] = useState(false);

  if (!isAuthenticated()) return null;

  // 🔒 Normalizamos rol
  const rol = String(user?.rol ?? "").toLowerCase().trim();
  const isAdmin = rol === "administrador" || rol === "admin";

  // Navegaciones
  const goInicio = () => {
    if (isAdmin) navigate("/admin");
    else navigate("/home");
  };

  const goAdmin = () => navigate("/admin");

  return (
    <>
      <header className="bg-gradient-to-r from-slate-900 via-black to-slate-900 shadow-lg border-b-4 border-red-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* LOGO */}
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={goInicio}
            >
              <div className="bg-white rounded-lg p-2">
                <YECLogo className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-white font-bold text-2xl">YEC MOTORS</h2>
                <p className="text-red-400 text-sm font-medium">
                  Concesionaria de Confianza
                </p>
              </div>
            </div>

            {/* ACCIONES */}
            <div className="flex items-center gap-3">
              {/* USUARIO (PRIMERO) */}
              {user && (
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-lg border border-white/20">
                  <UserIcon className="w-4 h-4 text-red-400" />
                  <div className="text-sm">
                    <p className="font-medium text-white">{user.nombre}</p>
                    <p className="text-red-300 text-xs capitalize">{user.rol}</p>
                  </div>
                </div>
              )}

              {/* PANEL VENDEDOR / ADMIN */}
              {isVendedorOrAdmin() && onNavigateVendedorPanel && (
                <button
                  onClick={onNavigateVendedorPanel}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white transition-all rounded-md font-medium"
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Panel</span>
                </button>
              )}

              {/* PANEL ADMIN DIRECTO */}
              {isAdmin && (
                <button
                  onClick={goAdmin}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 transition-all rounded-md font-medium"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden lg:inline">Panel Admin</span>
                </button>
              )}

              {/* CONTACTO */}
              <button
                onClick={() => setOpenContacto(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all rounded-md font-medium shadow-lg"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden lg:inline">Contacto</span>
              </button>

              {/* CERRAR SESIÓN (ÚLTIMO) */}
              {user && (
                <button
                  onClick={logout}
                  className="hidden md:flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-400 hover:bg-red-600 hover:text-white transition-all rounded-md font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MODAL CONTACTO */}
      {openContacto && (
        <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Contacto</h3>
              <button
                onClick={() => setOpenContacto(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-slate-700">
              <p>📍 Av. Amazonas y Gaspar de Villarroel, Quito - Ecuador</p>
              <p>📞 +593 99 888 7777</p>
              <p>✉️ contacto@yecmotors.ec</p>

              <div className="flex gap-3">
                <Instagram />
                <Facebook />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setOpenContacto(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
