import { Routes, Route, Navigate } from "react-router-dom";
import { LoginScreen } from "./auth/LoginScreen";
import { MainLayout } from "./layout/MainLayout";
import { HomePage } from "./pages/HomePage";
import { useAuth } from "./components/AuthContext";
import { CatalogPage } from "./pages/CatalogPage";
import { TestDrivePage } from "./pages/TestDrivePage";
import { LandingPage } from "./pages/LandingPage";
import { VehicleManagement } from "./pages/VehicleManagement";


function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* 🌍 Landing pública */}
  <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<LoginScreen />} />

      {isAuthenticated() ? (
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/vehiculo/:id/test-drive" element={<TestDrivePage />} />
          <Route path="/vehiculos/gestion" element={<VehicleManagement />} />
          {/* otras rutas protegidas */}
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}

export default App;
