"use client";

import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { WHATSAPP_URL } from "../lib/config";

const links = [
  { href: "/",            label: "Inicio"      },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/servicios",   label: "Servicios"   },
  { href: "/tasaciones",  label: "Tasaciones"  },
  { href: "/contacto",    label: "Contacto"    },
];

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuAbierto(false); // eslint-disable-line react-hooks/set-state-in-effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!menuAbierto) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("header")) setMenuAbierto(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menuAbierto]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* BARRA DE PROGRESO */}
      <div
        style={{
          width: `${scrollProgress}%`,
          background: "linear-gradient(90deg, #f97316, #fbbf24)",
          boxShadow: "0 0 8px rgba(249,115,22,0.6)",
        }}
        className="fixed top-0 left-0 h-[3px] z-[9999] transition-all duration-100"
      />

      <header
        className={`fixed top-0 left-0 w-full z-50 border-b text-white transition-all duration-300 ${
          scrolled
            ? "bg-[#0B1F3A]/95 backdrop-blur-md border-white/10 shadow-lg shadow-black/30"
            : "bg-[#0B1F3A]/80 backdrop-blur-sm border-white/5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center gap-6">

          {/* LOGO */}
          <Link href="/" className="shrink-0 flex items-center">
            <Image
              src="/logo-marquez.png"
              alt="MarQuez Negocios Inmobiliarios"
              width={390}
              height={175}
              className="h-16 w-auto md:h-[70px] object-contain"
              priority
            />
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden md:flex gap-7 text-sm items-center" aria-label="Navegación principal">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-all duration-200 font-medium relative group whitespace-nowrap ${
                  isActive(link.href)
                    ? "text-orange-400"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-orange-400 transition-all duration-300 ${
                    isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* CTA + HAMBURGUESA */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 whitespace-nowrap"
            >
              <FaWhatsapp size={16} />
              Contactar
            </a>

            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition"
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuAbierto}
            >
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuAbierto ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuAbierto ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuAbierto ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* MENÚ MOBILE */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuAbierto ? "max-h-96" : "max-h-0"}`}>
          <nav
            className="bg-[#0B1F3A]/98 backdrop-blur-md border-t border-white/10 px-6 py-5 flex flex-col gap-4"
            aria-label="Menú móvil"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition py-1 ${
                  isActive(link.href) ? "text-orange-400" : "text-white/80 hover:text-orange-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-3 rounded-lg text-sm font-semibold transition w-fit mt-1"
            >
              <FaWhatsapp />
              Contactar por WhatsApp
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
