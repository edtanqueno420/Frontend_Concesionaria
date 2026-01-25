import { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  Car, Tags, Users, BadgeDollarSign, 
  TrendingUp, ArrowUpRight, Activity 
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    vehiculos: 0,
    marcas: 0,
    usuarios: 0,
    valorTotal: 0
  });

  useEffect(() => {
    // Aquí llamarías a un endpoint de estadísticas o sumarías los datos
    const fetchStats = async () => {
      try {
        const [v, m, u] = await Promise.all([
          api.get('/vehiculos'),
          api.get('/marcas'),
          api.get('/auth/users') // Ajusta según tu ruta de usuarios
        ]);
        
        const totalValue = v.data.reduce((acc: number, cur: any) => acc + Number(cur.precio), 0);
        
        setStats({
          vehiculos: v.data.length,
          marcas: m.data.length,
          usuarios: u.data.length,
          valorTotal: totalValue
        });
      } catch (e) {
        console.error("Error cargando estadísticas");
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Vehículos en Stock', value: stats.vehiculos, icon: Car, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Marcas Aliadas', value: stats.marcas, icon: Tags, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Usuarios Registrados', value: stats.usuarios, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Valor del Inventario', value: `$${stats.valorTotal.toLocaleString()}`, icon: BadgeDollarSign, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Panel de Control</h1>
        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Resumen general de YEC Motors</p>
      </div>

      {/* TARJETAS DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 group hover:scale-105 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`${card.bg} ${card.color} p-4 rounded-2xl`}>
                <card.icon size={24} />
              </div>
              <span className="flex items-center text-green-500 font-black text-xs bg-green-50 px-2 py-1 rounded-lg">
                <TrendingUp size={12} className="mr-1" /> +12%
              </span>
            </div>
            <h3 className="text-slate-400 font-black uppercase text-[10px] tracking-widest">{card.label}</h3>
            <p className="text-3xl font-black text-slate-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* SECCIÓN INFERIOR: ACTIVIDAD RECIENTE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-red-600/10">
            <Activity className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 rotate-12" />
            <h2 className="text-2xl font-black italic uppercase mb-6 flex items-center gap-2">
                <ArrowUpRight className="text-red-600" /> Rendimiento Mensual
            </h2>
            <div className="h-48 flex items-end gap-3 justify-between">
                {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                    <div key={i} className="flex-1 bg-red-600/20 rounded-t-xl relative group">
                        <div 
                            className="absolute bottom-0 w-full bg-red-600 rounded-t-xl transition-all duration-1000 group-hover:bg-white" 
                            style={{ height: `${h}%` }}
                        ></div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
            </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
            <h2 className="text-lg font-black text-slate-900 uppercase mb-6">Próximas Entregas</h2>
            <div className="space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 italic">YEC</div>
                        <div>
                            <p className="font-bold text-sm text-slate-800 uppercase">Cliente #{i + 100}</p>
                            <p className="text-xs text-slate-400">Entrega programada</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}