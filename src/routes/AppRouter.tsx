import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import MarcaList from "../marcas/MarcaList";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/marcas" element={<MarcaList />} />
      </Routes>
    </BrowserRouter>
  );
}
