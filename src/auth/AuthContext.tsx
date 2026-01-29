import { createContext, useContext, useState, type ReactNode } from "react";

// 1. Definimos la estructura del usuario
interface User {
  id: number;
  nombre: string;
  rol: "cliente" | "vendedor" | "administrador";
}

// 2. Definimos qué funciones y datos ofrece el contexto
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isVendedorOrAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Intentamos recuperar al usuario del navegador al iniciar
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isAuthenticated = () => user !== null;

  const isVendedorOrAdmin = () => {
    return user?.rol === "vendedor" || user?.rol === "administrador";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        isVendedorOrAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 3. Hook para usar la autenticación en cualquier parte
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}