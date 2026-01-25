import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MarcaList() {
  const [marcas, setMarcas] = useState([]);

  useEffect(() => {
    api.get("/marcas").then(res => setMarcas(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Marcas</h1>
      <ul>
        {marcas.map((m: any) => (
          <li key={m.id}>{m.nombre}</li>
        ))}
      </ul>
    </div>
  );
}
