import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <main className="bg-[#0B1F3A] text-white min-h-screen flex items-center justify-center px-6 pt-24">
      <div className="text-center max-w-md">
        <p className="text-8xl font-black text-orange-500/30 leading-none mb-4">404</p>
        <h1 className="text-2xl font-bold mb-3">Página no encontrada</h1>
        <p className="text-white/50 text-sm mb-8">
          La página que buscás no existe o fue movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold transition"
          >
            Ir al inicio
          </Link>
          <Link
            href="/propiedades"
            className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl font-semibold transition"
          >
            Ver propiedades
          </Link>
        </div>
      </div>
    </main>
  );
}
