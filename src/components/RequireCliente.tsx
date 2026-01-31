import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export function RequireCliente({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toLowerCase();

  if (!token) return <Navigate to="/login" replace />;

  // si no es cliente, redirigir según rol
  if (role === "administrador" || role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  if (role === "vendedor") {
    return <Navigate to="/vendedor" replace />;
  }

  // ✅ cliente u "otro" (si quieres, puedes mandar "otro" a /home igual)
  return children;
}
