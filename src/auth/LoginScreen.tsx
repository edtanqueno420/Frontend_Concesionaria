import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../components/AuthContext'; // 👈 AÑADIDO
import { 
  Car, Mail, Lock, AlertCircle, Eye, EyeOff, Loader2, 
  User, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 AÑADIDO

  // --- UI STATES ---
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('yec_remembered_email'));

  // --- FORM STATES ---
  const [email, setEmail] = useState(() => localStorage.getItem('yec_remembered_email') || '');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- VALIDACIONES ---
  const [emailValid, setEmailValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(email ? emailRegex.test(email) : true);
  }, [email]);

  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    if (/[^a-zA-Z\d]/.test(password)) strength += 25;
    setPasswordStrength(password ? strength : 0);
  }, [password]);

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (password !== confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }

        const [nombre, apellido = ''] = fullName.split(' ', 2);

        await api.post('/auth/register', {
          nombre,
          apellido,
          email,
          password,
        });

        toast.success('¡Cuenta creada! Ya puedes iniciar sesión');
        setIsRegisterMode(false);
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

      } else {
        // 🔐 LOGIN
        const res = await api.post('/auth/login', { email, password });

        // ⬇️ CLAVE: guardar en AuthContext
        login(res.data.user);

        // opcional (si usas token)
        localStorage.setItem('token', res.data.access_token);

        if (rememberMe) {
          localStorage.setItem('yec_remembered_email', email);
        } else {
          localStorage.removeItem('yec_remembered_email');
        }

        toast.success(`¡Bienvenido, ${res.data.user.nombre}!`);

        navigate(
          res.data.user.rol === 'cliente'
            ? '/home'
            : '/marcas'
        );
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Error en la solicitud';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // 👇 TODO TU JSX SE QUEDA IGUAL (no lo toqué)


  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-yellow-500';
    if (passwordStrength <= 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 25) return 'Débil';
    if (passwordStrength <= 50) return 'Media';
    if (passwordStrength <= 75) return 'Fuerte';
    return 'Muy fuerte';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        {/* LOGO */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-4 bg-white rounded-2xl p-4 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            <Car className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-white text-4xl font-black italic tracking-tighter uppercase">
            YEC<span className="text-red-600">MOTORS</span>
          </h1>
          <p className="text-red-300/60 text-xs font-bold uppercase tracking-[0.2em] mt-1">Excelencia Automotriz</p>
        </div>

        {/* CARD */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
          <div className="p-8 pb-4 border-b-4 border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 uppercase">
              {isRegisterMode ? 'Crear Cuenta' : 'Acceso'}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              {isRegisterMode ? 'Únete a nuestra plataforma' : 'Bienvenido de vuelta'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            {isRegisterMode && (
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Nombre Completo" 
                    required 
                    className="w-full pl-11 py-3 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-red-600/20 border border-transparent focus:border-red-600 transition-all text-sm font-bold" 
                    value={fullName} 
                    onChange={e => setFullName(e.target.value)} 
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                placeholder="Email" 
                required 
                className={`w-full pl-11 py-3 bg-slate-100 rounded-xl outline-none border transition-all text-sm font-bold ${!emailValid ? 'border-red-500' : 'border-transparent focus:border-red-600'}`} 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Contraseña" 
                required 
                className="w-full pl-11 pr-12 py-3 bg-slate-100 rounded-xl outline-none border border-transparent focus:border-red-600 transition-all text-sm font-bold" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {isRegisterMode && password && (
              <div className="space-y-1">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`} 
                    style={{ width: `${Math.max(5, passwordStrength)}%` }}
                  ></div>
                </div>
                <p className="text-xs font-medium text-slate-500">
                  Seguridad: <span className={getPasswordStrengthColor().replace('bg-', 'text-')}>
                    {getPasswordStrengthText()}
                  </span>
                </p>
              </div>
            )}

            {isRegisterMode && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="Confirmar Contraseña" 
                  required 
                  className="w-full pl-11 py-3 bg-slate-100 rounded-xl outline-none border border-transparent focus:border-red-600 transition-all text-sm font-bold" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                />
              </div>
            )}

            {!isRegisterMode && (
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="accent-red-600 w-4 h-4" />
                  RECORDARME
                </label>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold animate-shake">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button disabled={loading} className="w-full py-4 bg-slate-900 hover:bg-red-600 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-red-600/10 flex items-center justify-center gap-2 group">
              {loading ? <Loader2 className="animate-spin" /> : (isRegisterMode ? 'CREAR CUENTA' : 'INICIAR SESIÓN')}
              {!loading && <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />}
            </button>

            <button type="button" onClick={() => {setIsRegisterMode(!isRegisterMode); setError('')}} className="w-full text-center text-xs font-bold text-slate-400 hover:text-red-600 transition-colors uppercase tracking-widest">
              {isRegisterMode ? '¿Ya tienes cuenta? Entra aquí' : '¿No tienes cuenta? Regístrate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
