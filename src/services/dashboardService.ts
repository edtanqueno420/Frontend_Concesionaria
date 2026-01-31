import api from "../api/axios";

export async function obtenerDashboard() {
  // Ajusta estos endpoints según tu backend:
  const [vehiculosRes, ventasRes, usuariosRes] = await Promise.all([
    api.get("/vehiculos"),
    api.get("/ventas"),
    api.get("/usuarios"), // o "/clientes"
  ]);

  const vehiculos = vehiculosRes.data ?? [];
  const ventas = ventasRes.data ?? [];
  const usuarios = usuariosRes.data ?? [];

  // KPIs
  const vehiculosDisponibles = vehiculos.filter((v: any) =>
    String(v?.estado ?? "").toLowerCase().includes("dispon")
  ).length;

  // Ventas del mes (si ventas tiene fecha: createdAt / fecha)
  const ahora = new Date();
  const mes = ahora.getMonth();
  const anio = ahora.getFullYear();

  const ventasDelMes = ventas.filter((s: any) => {
    const f = new Date(s?.createdAt ?? s?.fecha ?? 0);
    return f.getMonth() === mes && f.getFullYear() === anio;
  });

  const totalVentasMes = ventasDelMes.reduce((acc: number, s: any) => {
    const total = Number(s?.total ?? s?.monto_total ?? 0);
    return acc + total;
  }, 0);

  const clientesRegistrados = usuarios.filter(
    (u: any) => String(u?.rol ?? "").toLowerCase() === "cliente"
  ).length;

  const solicitudesPendientes = ventas.filter((s: any) =>
    String(s?.status ?? s?.estado ?? "").toLowerCase().includes("proceso")
  ).length;

  // recientes
  const vehiculosRecientes = [...vehiculos]
    .sort((a: any, b: any) => {
      const fa = new Date(a?.createdAt ?? a?.updatedAt ?? 0).getTime();
      const fb = new Date(b?.createdAt ?? b?.updatedAt ?? 0).getTime();
      return fb - fa;
    })
    .slice(0, 4);

  const ventasRecientes = [...ventas]
    .sort((a: any, b: any) => {
      const fa = new Date(a?.createdAt ?? a?.fecha ?? 0).getTime();
      const fb = new Date(b?.createdAt ?? b?.fecha ?? 0).getTime();
      return fb - fa;
    })
    .slice(0, 3);

  return {
    kpis: {
      vehiculosDisponibles,
      totalVentasMes,
      clientesRegistrados,
      solicitudesPendientes,
    },
    vehiculosRecientes,
    ventasRecientes,
  };
}
