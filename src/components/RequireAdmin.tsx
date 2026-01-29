import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export function RequireAdmin({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;

  return children;
}
