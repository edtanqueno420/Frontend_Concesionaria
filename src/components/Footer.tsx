import { YECLogo } from './YECLogo';
import { MapPin, Phone, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <YECLogo className="w-10 h-10 text-red-600" />
            <span className="font-black text-2xl italic">YEC MOTORS</span>
          </div>
          <p className="text-slate-400 font-medium">Líderes en la comercialización de vehículos multimarca en Ecuador con más de 15 años de experiencia.</p>
        </div>
        
        <div>
          <h4 className="text-red-500 font-black mb-6 uppercase tracking-widest text-sm">Visítanos</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-red-600 w-5 h-5 flex-shrink-0" />
              <p className="text-slate-300 font-bold">Av. Amazonas y Gaspar de Villarroel, Edificio YEC, Quito - Ecuador</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-red-600 w-5 h-5" />
              <p className="text-slate-300 font-bold">+593 99 888 7777</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-red-500 font-black mb-6 uppercase tracking-widest text-sm">Siguenos</h4>
          <div className="flex gap-4">
            <a 
              href="https://instagram.com/yecmotors" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-white/5 rounded-xl hover:bg-red-600 transition-all"
              aria-label="Instagram"
            >
              <Instagram />
            </a>
            <a 
              href="https://facebook.com/yecmotors" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-white/5 rounded-xl hover:bg-red-600 transition-all"
              aria-label="Facebook"
            >
              <Facebook />
            </a>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-8 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
        2026 YEC MOTORS - PROYECTO INTEGRADOR SOFTWARE
      </div>
    </footer>
  );
}