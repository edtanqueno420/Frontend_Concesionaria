import { useNavigate } from 'react-router-dom';
import {Car,ArrowRight,} from 'lucide-react';
import { YECLogo } from '../components/YECLogo';
import heroCar from '../assets/hero-car.png';
export function LandingPage() {
  const navigate = useNavigate();

  const vehiculosDestacados = [
    { marca: 'Toyota', modelo: 'Camry 2023', precio: 28500, descripcion: 'Elegancia y tecnología' },
    { marca: 'Honda', modelo: 'CR-V 2024', precio: 35200, descripcion: 'SUV híbrido premium' },
    { marca: 'Porsche', modelo: '911 Carrera', precio: 125000, descripcion: 'Potencia y lujo' },
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
            <button
             onClick={() => navigate('/login')}
              className="font-medium"
            >
              Iniciar Sesión
            </button>

            <button
              onClick={() => navigate('/login')}
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
          style={{
            backgroundImage: `url(${heroCar})`,
          }}
        >
        {/* overlay oscuro */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* contenido */}
        <div className="relative">
          <h1 className="text-5xl font-bold mb-6">
            Encuentra el Auto de tus Sueños
          </h1>

          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Las mejores marcas, los mejores precios en Ecuador
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-red-600 px-8 py-4 rounded-lg font-bold flex items-center gap-2"
            >
              Comprar Ahora <ArrowRight />
          </button>

          <button
            onClick={() => navigate('/login')}
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
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          {vehiculosDestacados.map((v, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow">
              <Car className="w-16 h-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-bold">{v.marca} {v.modelo}</h3>
              <p className="text-slate-600">{v.descripcion}</p>
              <p className="text-red-600 text-2xl font-bold mt-4">
                ${v.precio.toLocaleString()}
              </p>
            </div>
          ))}
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
