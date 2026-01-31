import { Routes, Route, Navigate } from "react-router-dom";
import { LoginScreen } from "./auth/LoginScreen";
import { LandingPage } from "./pages/LandingPage";
import { MainLayout } from "./layout/MainLayout";
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { TestDrivePage } from "./pages/TestDrivePage";

import { useAuth } from "./auth/AuthContext";
import { RequireAdmin } from "./components/RequireAdmin";
import { RequireCliente } from "./components/RequireCliente";
import { RequiereVendedor } from "./components/RequiereVendedor";
import VendedorPanelPage from "./pages/vendedor/VendedorPanelPage";

import AdminShell from "./pages/admin/AdminShell";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import VehiculosPage from "./pages/admin/VehiculosPage";
import MarcasPage from "./pages/admin/MarcasPage";
import UsuariosPage from "./pages/admin/UsuariosPage";
import VentasPage from "./pages/admin/VentasPage";
import MantenimientosPage from "./pages/admin/MantenimientosPage";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Público */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginScreen />} />

      {/* ADMIN (con layout fijo) */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminShell />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="vehiculos" element={<VehiculosPage />} />
        <Route path="marcas" element={<MarcasPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="ventas" element={<VentasPage />} />
        <Route path="mantenimientos" element={<MantenimientosPage />} />
      </Route>

      {/* VENDEDOR */}
      <Route
        path="/vendedor"
        element={
          <RequiereVendedor>
            <VendedorPanelPage />
          </RequiereVendedor>
        }
      />

      {/* LOGUEADOS con MainLayout */}
      {isAuthenticated() ? (
        <Route element={<MainLayout />}>
          <Route
            path="/home"
            element={
              <RequireCliente>
                <HomePage />
              </RequireCliente>
            }
          />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/vehiculo/:id/test-drive" element={<TestDrivePage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
}
