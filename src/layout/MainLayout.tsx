import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function MainLayout() {
  const navigate = useNavigate();

  return (
    <>
      <Header
        onNavigateHome={() => navigate("/home")}
        onNavigateVendedorPanel={() => navigate("/panel")}
      />

      <main className="min-h-screen bg-slate-100">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
