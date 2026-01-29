import { Routes, Route, Navigate } from "react-router-dom";
import { LoginScreen } from "./auth/LoginScreen";
import { MainLayout } from "./layout/MainLayout";
import { HomePage } from "./pages/HomePage";
import { useAuth } from "./auth/AuthContext";
import { CatalogPage } from "./pages/CatalogPage";
import { TestDrivePage } from "./pages/TestDrivePage";
import { LandingPage } from "./pages/LandingPage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import { RequireAdmin } from "./components/RequireAdmin";

import VendedorPanelPage from "./pages/vendedor/VendedorPanelPage";
import { RequiereVendedor } from "./components/RequiereVendedor";

import { RequireCliente } from "./components/RequireCliente";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* 🌍 Landing pública */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginScreen />} />

      {/* 🔐 ADMIN */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminDashboardPage />
          </RequireAdmin>
        }
      />

      {/* 🔐 VENDEDOR */}
      <Route
        path="/vendedor"
        element={
          <RequiereVendedor>
            <VendedorPanelPage />
          </RequiereVendedor>
        }
      />

      {/* RUTAS CON LAYOUT (loggeados) */}
      {isAuthenticated() ? (
        <Route element={<MainLayout />}>
          {/* ✅ SOLO CLIENTE: si entra vendedor/admin a /home, lo redirige */}
          <Route
            path="/home"
            element={
              <RequireCliente>
                <HomePage />
              </RequireCliente>
            }
          />

          {/* Estas las puedes dejar para cualquier logueado,
              o si quieres también puedes protegerlas por rol */}
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/vehiculo/:id/test-drive" element={<TestDrivePage />} />
        </Route>
      ) : (
        // ✅ Si NO está logueado: cualquier ruta desconocida -> landing (no login)
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
}

export default App;
