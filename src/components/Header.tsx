import { Phone, Mail, LogOut, User as UserIcon, Home, Users } from 'lucide-react';
import { useAuth } from './AuthContext';
import { YECLogo } from './YECLogo';
import { useState } from 'react';

interface HeaderProps {
  onNavigateHome?: () => void;
  onNavigateVendedorPanel?: () => void;
}

export function Header({ onNavigateHome, onNavigateVendedorPanel }: HeaderProps) {
  const { user, logout, isVendedorOrAdmin, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!isAuthenticated()) return null;

  return (
    <>
      <header className="bg-gradient-to-r from-slate-900 via-black to-slate-900 shadow-lg border-b-4 border-red-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={onNavigateHome}>
              <div className="bg-white rounded-lg p-2">
                <YECLogo className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-white font-bold text-2xl">YEC MOTORS</h2>
                <p className="text-red-400 text-sm font-medium">Concesionaria de Confianza</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {onNavigateHome && (
                <button 
                  className="flex items-center gap-2 px-4 py-2 text-white hover:text-red-400 transition-colors rounded-md hover:bg-white/10"
                  onClick={onNavigateHome}
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">Inicio</span>
                </button>
              )}

              {/* Botón Panel de Vendedor - Para vendedores y administradores */}
              {isVendedorOrAdmin() && onNavigateVendedorPanel && (
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white transition-all rounded-md font-medium"
                  onClick={onNavigateVendedorPanel}
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Panel</span>
                </button>
              )}

              {user && (
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-lg border border-white/20">
                  <UserIcon className="w-4 h-4 text-red-400" />
                  <div className="text-sm">
                    <p className="font-medium text-white">{user.nombre}</p>
                    <p className="text-red-300 text-xs capitalize">{user.rol}</p>
                  </div>
                </div>
              )}

              <button className="hidden sm:flex items-center gap-2 px-4 py-2 border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 transition-all rounded-md font-medium">
                <Phone className="w-4 h-4" />
                <span className="hidden lg:inline">Llamar</span>
              </button>
              
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all rounded-md font-medium shadow-lg">
                <Mail className="w-4 h-4" />
                <span className="hidden lg:inline">Contacto</span>
              </button>

              {user && (
                <>
                  {/* Botón visible de cerrar sesión en desktop */}
                  <button 
                    className="hidden md:flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-400 hover:bg-red-600 hover:text-white transition-all rounded-md font-medium"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>

                  {/* Menú dropdown para móviles */}
                  <div className="md:hidden relative">
                    <button 
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="p-2 text-white hover:bg-white/10 rounded-md transition-colors"
                    >
                      <UserIcon className="w-5 h-5" />
                    </button>
                    
                    {showUserMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowUserMenu(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                          <div className="p-3 border-b border-slate-200">
                            <p className="font-medium text-slate-900 text-sm">Mi Cuenta</p>
                          </div>
                          <div className="p-3 border-b border-slate-200">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">{user.nombre}</span>
                              <span className="text-xs text-slate-500 capitalize">{user.rol}</span>
                            </div>
                          </div>
                          {user.rol === 'vendedor' && onNavigateVendedorPanel && (
                            <button 
                              onClick={() => {
                                setShowUserMenu(false);
                                onNavigateVendedorPanel();
                              }}
                              className="w-full p-3 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium border-b border-slate-200"
                            >
                              <Users className="w-4 h-4" />
                              Panel de Vendedor
                            </button>
                          )}
                          {user.rol === 'administrador' && onNavigateVendedorPanel && (
                            <button 
                              onClick={() => {
                                setShowUserMenu(false);
                                onNavigateVendedorPanel();
                              }}
                              className="w-full p-3 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium border-b border-slate-200"
                            >
                              <Users className="w-4 h-4" />
                              Panel de Administrador
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              setShowUserMenu(false);
                              logout();
                            }}
                            className="w-full p-3 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
                          >
                            <LogOut className="w-4 h-4" />
                            Cerrar Sesión
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}