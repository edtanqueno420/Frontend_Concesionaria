import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, ArrowRight, Phone, Mail, MapPin, Star, Shield, TrendingUp, Users } from "lucide-react";
import { YECLogo } from "../components/YECLogo";
import heroCar from "../assets/hero-car.png";
import { getGalerias } from "../services/galeriaService";

export function LandingPage() {
  const navigate = useNavigate();
  const [vehiculosDestacados, setVehiculosDestacados] = useState<any[]>([]);

  const onRegister = () => navigate("/login"); // o "/register" si tienes esa ruta

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const galerias = await getGalerias();

        const vehiculosConImagen = (galerias ?? [])
          .map((g: any) => {
            const vehiculo = g?.vehiculoData;
            if (!vehiculo) return null;

            const imagenPrincipal =
              g?.imagenes?.find((i: any) => i?.principal)?.url ??
              g?.imagenes?.[0]?.url ??
              null;

            return {
              ...vehiculo,
              imagenUrl: imagenPrincipal,
              imageFocus:
                vehiculo.id === 1 ? "20% 50%" : // Porsche: más a la izquierda
                  vehiculo.id === 2 ? "60% 50%" : // Yaris: más al centro/derecha
                    "50% 55%",
            };
          })
          .filter(Boolean)
          .slice(0, 3); // Solo los primeros 3 para destacados

        setVehiculosDestacados(vehiculosConImagen);
      } catch (err) {
        console.error("Error cargando vehículos destacados:", err);
      }
    }

    fetchVehicles();
  }, []);

  const caracteristicas = [
    { icon: Shield, titulo: "Garantía", descripcion: "Vehículos revisados y con respaldo." },
    { icon: TrendingUp, titulo: "Mejores precios", descripcion: "Ofertas y financiamiento flexible." },
    { icon: Users, titulo: "Atención personalizada", descripcion: "Te acompañamos en todo el proceso." },
    { icon: Car, titulo: "Variedad", descripcion: "Amplio catálogo de marcas y modelos." },
  ];

  const testimonios = [
    { nombre: "Carlos M.", comentario: "Excelente servicio y muy rápido el proceso.", rating: 5 },
    { nombre: "María P.", comentario: "Me ayudaron a elegir el auto perfecto para mi familia.", rating: 5 },
    { nombre: "José L.", comentario: "Buen precio y atención súper amable.", rating: 4 },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-red-600">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <YECLogo className="w-12 h-12" />
            <div>
              <h1 className="font-bold text-slate-900">YEC MOTORS</h1>
              <p className="text-xs text-slate-600">Concesionaria de Confianza</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate("/login")} className="font-medium">
              Iniciar Sesión
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Registrarse
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="container mx-auto px-4 md:px-8 mt-8">
        <section
          className="relative bg-slate-900 text-white py-20 text-center rounded-2xl border-4 border-red-600 overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${heroCar})` }}
        >
          {/* overlay oscuro */}
          <div className="absolute inset-0 bg-black/60"></div>

          {/* contenido */}
          <div className="relative">
            <h1 className="text-5xl font-bold mb-6">Encuentra el Auto de tus Sueños</h1>

            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Las mejores marcas, los mejores precios en Ecuador
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-red-600 px-8 py-4 rounded-lg font-bold flex items-center gap-2"
              >
                Comprar Ahora <ArrowRight />
              </button>

              <button
                onClick={() => navigate("/login")}
                className="bg-white text-slate-900 px-8 py-4 rounded-lg font-bold"
              >
                Ver Catálogo
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* DESTACADOS */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Vehículos Destacados</h2>
            <p className="text-slate-600 text-lg">Los mejores autos disponibles ahora</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {vehiculosDestacados.length > 0 ? (
              vehiculosDestacados.map((v) => (
                <div key={v.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                  {/* Imagen del vehículo */}
                  <div className="relative aspect-[4/3] bg-slate-200">
                    {v.imagenUrl ? (
                      <img
                        src={v.imagenUrl}
                        alt={`${v.version?.modelo?.marca?.nombre} ${v.version?.modelo?.nombre}`}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: v.imageFocus ?? "50% 50%" }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Car className="w-16 h-16 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg">
                        {v.version?.anio ?? "—"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">
                      {v.version?.modelo?.marca?.nombre} {v.version?.modelo?.nombre}
                    </h3>
                    <p className="text-slate-600 mb-4">
                      {v.version?.motor ?? "Vehículo en excelente estado"}
                    </p>
                    <p className="text-red-600 text-2xl font-bold">${Number(v.precio_final).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              // Mostrar placeholders mientras cargan
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow animate-pulse">
                  <div className="w-full h-40 bg-slate-200 rounded-lg mb-4 flex items-center justify-center">
                    <Car className="w-16 h-16 text-slate-400" />
                  </div>
                  <div className="h-6 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded mb-4"></div>
                  <div className="h-8 bg-slate-200 rounded"></div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">¿Por Qué Elegirnos?</h2>
            <p className="text-slate-600 text-lg">Razones por las que somos tu mejor opción</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {caracteristicas.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="text-center p-6 rounded-xl bg-slate-50 hover:bg-red-50 transition-colors"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-full mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.titulo}</h3>
                  <p className="text-slate-600">{item.descripcion}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESO DE COMPRA */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Proceso Simple y Rápido</h2>
            <p className="text-slate-300 text-lg">4 pasos para tener tu auto</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { numero: "1", titulo: "Regístrate", descripcion: "Crea tu cuenta en segundos" },
              { numero: "2", titulo: "Explora", descripcion: "Navega nuestro catálogo completo" },
              { numero: "3", titulo: "Elige", descripcion: "Selecciona tu vehículo ideal" },
              { numero: "4", titulo: "Compra", descripcion: "Finaliza tu compra online" },
            ].map((paso, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-full text-2xl font-bold mb-4">
                  {paso.numero}
                </div>
                <h3 className="text-xl font-bold mb-2">{paso.titulo}</h3>
                <p className="text-slate-300">{paso.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Lo Que Dicen Nuestros Clientes</h2>
            <p className="text-slate-600 text-lg">Testimonios reales de clientes satisfechos</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonios.map((testimonio, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonio.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-slate-700 mb-4 italic">"{testimonio.comentario}"</p>
                <p className="font-bold text-slate-900">- {testimonio.nombre}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">¿Listo para tu Próximo Auto?</h2>
          <p className="text-xl mb-8 text-red-100">Únete a cientos de clientes satisfechos</p>

          <button
            onClick={onRegister}
            className="px-10 py-4 bg-white text-red-600 rounded-lg hover:bg-slate-100 font-bold text-lg transition-colors shadow-lg inline-flex items-center gap-2"
          >
            Comenzar Ahora
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Contáctanos</h2>
            <p className="text-slate-600 text-lg">Estamos aquí para ayudarte</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Teléfono</h3>
              <p className="text-slate-600">+593 2 2500-100</p>
            </div>

            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Email</h3>
              <p className="text-slate-600">ventas@yecmotors.ec</p>
            </div>

            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Ubicación</h3>
              <p className="text-slate-600">Quito, Ecuador</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-8 text-center">
        <YECLogo className="w-16 h-16 mx-auto mb-4" />
        <p>© 2025 YEC Motors</p>
      </footer>
    </div>
  );
}






