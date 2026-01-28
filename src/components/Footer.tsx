
export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/*<YECLogo className="w-16 h-16 mb-4" />*/}
          <h3 className="font-semibold mb-2">YEC MOTORS</h3>
          <p className="text-slate-400 mb-4">Concesionaria de Confianza</p>
          <p className="text-slate-300">
            © 2025 YEC Motors. Todos los derechos reservados.
          </p>
          <p className="text-slate-400 mt-2">
            Contacto: ventas@yecmotors.ec | Tel: +593 2 2500-100
          </p>
        </div>
      </div>
    </footer>
  );
}
