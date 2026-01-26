import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginScreen } from "../auth/LoginScreen";
import MarcaList from "../marcas/MarcaList";
import ModeloList from "../modelos/ModeloList";
import VehiculoList from "../vehiculos/VehiculoList";
import DashboardPage from "../pages/DashboardPage";
import Navbar from '../layout/Navbar';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/marcas" element={<MarcaList />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/modelos" element={<ModeloList />} />
        <Route path="/vehiculos" element={<VehiculoList />} />
        <Route path="/panel" element={<DashboardPage />} />
        <Route path="/navbar" element={<Navbar />} />
      </Routes>
    </BrowserRouter>
  );
}