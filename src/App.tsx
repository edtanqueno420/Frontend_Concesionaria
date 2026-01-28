import { Routes, Route, Navigate } from "react-router-dom";
import { LoginScreen } from "./auth/LoginScreen";
import { MainLayout } from "./layout/MainLayout";
import { HomePage } from "./pages/HomePage";
import { useAuth } from "./auth/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />

      {isAuthenticated() ? (
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          {/* otras rutas protegidas */}
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}

export default App;
