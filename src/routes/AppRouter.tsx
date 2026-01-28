import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginScreen } from "../auth/LoginScreen";
import MarcaList from "../marcas/MarcaList";
import ModeloList from "../modelos/ModeloList";
import VehiculoList from "../vehiculos/VehiculoList";
import DashboardPage from "../pages/DashboardPage";
import { HomePage } from "../pages/HomePage";
import { MainLayout } from "../layout/MainLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 🔥 RUTAS CON HEADER */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/marcas" element={<MarcaList />} />
          <Route path="/modelos" element={<ModeloList />} />
          <Route path="/vehiculos" element={<VehiculoList />} />
          <Route path="/panel" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
