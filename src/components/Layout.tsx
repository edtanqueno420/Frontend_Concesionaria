import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}