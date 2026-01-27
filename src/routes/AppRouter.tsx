import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginScreen } from "../auth/LoginScreen";
import MarcaList from "../marcas/MarcaList";
import ModeloList from "../modelos/ModeloList";
import VehiculoList from "../vehiculos/VehiculoList";
import DashboardPage from "../pages/DashboardPage";
import Navbar from '../layout/Navbar';
import { HomePage } from '../pages/HomePage';
import { Header } from '../components/Header';
import { MainLayout } from '../layout/MainLayout';

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
        <Route path="/home" element={<HomePage />} />
        <Route path="/header" element={<Header />} />
        <Route path="/main-layout" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}