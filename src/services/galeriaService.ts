import api from "../api/axios";

export async function getGalerias() {
  const res = await api.get("/galeria");
  return res.data; // array de galerias con vehiculoData + imagenes
}