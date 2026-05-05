"use client";

import Link from "next/link";
import { FaWhatsapp, FaLock } from "react-icons/fa";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [adminClicks, setAdminClicks] = useState(0);
  const [mostrarAdmin, setMostrarAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menú al cambiar de página
  useEffect(() => {
    setMenuAbierto(false);
  }, [pathname]);

  // 3 clicks en el logo para mostrar el acceso al admin
  const handleLogoClick = () => {
    const nuevosClicks = adminClicks + 1;
    setAdminClicks(nuevosClicks);
    if (nuevosClicks >= 3) {
      setMostrarAdmin(true);
      setAdminClicks(0);
    }
  };

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/propiedades", label: "Propiedades" },
    { href: "/#servicios", label: "Servicios" },
    { href: "/#contacto", label: "Contacto" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 border-b border-white/10 text-white transition-all duration-300 ${
        scrolled
          ? "bg-[#0B1F3A] shadow-lg shadow-black/30"
          : "bg-[#0B1F3A]/90 backdrop-blur"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO — igual al original, con click para admin */}
        <div onClick={handleLogoClick} className="cursor-pointer text-xl font-bold tracking-wide flex items-center gap-2">
          <span className="text-orange-500 text-2xl">⌂</span>
          <span>
            MarQuez
            <span className="block text-xs tracking-widest text-gray-300">
              NEGOCIOS INMOBILIARIOS
            </span>
          </span>
        </div>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex gap-8 text-sm items-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition font-medium ${
                pathname === link.href
                  ? "text-orange-400 border-b border-orange-400 pb-0.5"
                  : "hover:text-orange-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {/* Admin discreto — solo aparece tras 3 clicks en el logo */}
          {mostrarAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1 text-white/30 hover:text-white/60 transition text-xs"
              title="Administrador"
            >
              <FaLock size={10} />
              Admin
            </Link>
          )}
        </nav>

        {/* CTA + HAMBURGUESA */}
        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/5492210000000"
            target="_blank"
            className="hidden sm:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            <FaWhatsapp />
            Contactar
          </a>

          {/* Hamburguesa solo en mobile */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden flex flex-col gap-1.5 p-1"
            aria-label="Abrir menú"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuAbierto ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuAbierto ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuAbierto ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* MENÚ MOBILE */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuAbierto ? "max-h-64" : "max-h-0"}`}>
        <nav className="bg-[#0B1F3A] border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition ${
                pathname === link.href
                  ? "text-orange-400"
                  : "text-white/80 hover:text-orange-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {mostrarAdmin && (
            <Link href="/admin" className="flex items-center gap-1 text-white/30 text-xs">
              <FaLock size={10} />
              Admin
            </Link>
          )}
          <a
            href="https://wa.me/5492210000000"
            target="_blank"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-semibold transition w-fit"
          >
            <FaWhatsapp />
            Contactar por WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
