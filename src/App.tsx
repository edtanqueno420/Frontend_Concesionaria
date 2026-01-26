import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";
import "./index.css";

/**
 * Componente principal de la aplicación.
 * Aquí envolvemos el Router con los proveedores globales.
 */
function App() {
  return (
    <>
      <Toaster 
        position="top-center" 
        richColors 
        closeButton
        expand={false}
      />
      <AppRouter />

    </>
  );
}

export default App;