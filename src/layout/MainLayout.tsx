import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function MainLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* HEADER */}
      <Header
        onNavigateHome={() => navigate("/home")}
        onNavigateVendedorPanel={() => navigate("/panel")}
      />

      {/* CONTENIDO DE CADA PÁGINA */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
