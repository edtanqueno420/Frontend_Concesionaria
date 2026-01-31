import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export function RequiereVendedor({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toLowerCase();

  if (!token) return <Navigate to="/login" replace />;

  if (role !== "vendedor") {
    if (role === "administrador" || role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return children;
}
