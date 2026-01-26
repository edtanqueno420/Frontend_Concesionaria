import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* COLUMNA 1: LOGO */}
        <div>
          <h2 className="text-2xl font-black text-white mb-4">YEC MOTORS</h2>
          <p className="text-slate-400 text-sm">Tu concesionaria de confianza en Ecuador</p>
        </div>

        {/* COLUMNA 2: NAVEGACIÓN */}
        <div>
          <h4 className="font-black uppercase text-xs tracking-widest text-red-600 mb-6">Navegación</h4>
          <ul className="space-y-3 text-sm font-bold text-slate-300">
            <li><a href="/" className="hover:text-white transition-colors">Inicio</a></li>
            <li><a href="/catalogo" className="hover:text-white transition-colors">Catálogo</a></li>
            <li><a href="/sucursales" className="hover:text-white transition-colors">Sucursales</a></li>
          </ul>
        </div>

        {/* COLUMNA 3: CONTACTO */}
        <div>
          <h4 className="font-black uppercase text-xs tracking-widest text-red-600 mb-6">Contacto</h4>
          <ul className="space-y-4 text-sm font-bold text-slate-300">
            <li className="flex items-center gap-3"><Phone size={16} className="text-red-600"/> +593 999 888 777</li>
            <li className="flex items-center gap-3"><Mail size={16} className="text-red-600"/> info@yecmotors.com</li>
            <li className="flex items-center gap-3"><MapPin size={16} className="text-red-600"/> Quito, Ecuador</li>
          </ul>
        </div>

        {/* COLUMNA 4: REDES */}
        <div>
          <h4 className="font-black uppercase text-xs tracking-widest text-red-600 mb-6">Síguenos</h4>
          <div className="flex gap-4">
            <a href="#" className="p-3 bg-slate-900 rounded-xl hover:bg-red-600 transition-all"><Facebook size={20}/></a>
            <a href="#" className="p-3 bg-slate-900 rounded-xl hover:bg-red-600 transition-all"><Instagram size={20}/></a>
            <a href="#" className="p-3 bg-slate-900 rounded-xl hover:bg-red-600 transition-all"><Twitter size={20}/></a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900 pt-8 text-center mt-8">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
          2026 YEC MOTORS • Diseñado para la Excelencia
        </p>
      </div>
    </footer>
  );
};

export default Footer;