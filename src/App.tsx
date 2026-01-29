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

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* 🌍 Landing pública */}
  <Route path="/" element={<LandingPage />} />

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

      {isAuthenticated() ? (
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/vehiculo/:id/test-drive" element={<TestDrivePage />} />
          {/* otras rutas protegidas */}
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}

export default App;







