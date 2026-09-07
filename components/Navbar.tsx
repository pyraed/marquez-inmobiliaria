"use client";

import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { WHATSAPP_URL } from "../lib/config";

// CAUSA DEL BUG DE HASHES:
// Next.js <Link href="/#servicios"> desde pathname="/" no detecta cambio de ruta
// y el router no dispara una nueva navegación → el hash anterior persiste
// generando URLs como /#servicios#servicios.
// <Link href="/"> desde /#servicios tampoco limpia el hash porque pathname no cambia.
//
// SOLUCIÓN: interceptar con onClick los casos donde el pathname no cambia,
// usando router.push() para forzar la navegación completa, y scrollIntoView
// para el anchor en la misma página.

const PAGE_LINKS = [
  { href: "/propiedades", label: "Propiedades" },
  { href: "/tasaciones",  label: "Tasaciones"  },
  { href: "/contacto",    label: "Contacto"    },
];

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

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
    if (menuAbierto) setMenuAbierto(false); // eslint-disable-line react-hooks/set-state-in-effect
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

  // Inicio: siempre ir a /, limpiando cualquier hash
  const handleInicio = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setMenuAbierto(false);
    if (pathname === "/" && window.location.hash) {
      // Mismo pathname pero tiene hash → limpiar con router.push
      router.push("/");
    } else if (pathname !== "/") {
      router.push("/");
    }
    // Si ya estamos en / sin hash, el Link lo maneja normalmente (scroll top)
  }, [pathname, router]);

  // Servicios: scroll si ya estamos en /, navegar si no
  const handleServicios = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setMenuAbierto(false);
    if (pathname === "/") {
      // Scroll al elemento y actualizar URL
      const el = document.getElementById("servicios");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", "/#servicios");
      }
    } else {
      // Navegar a home con hash
      router.push("/#servicios");
    }
  }, [pathname, router]);

  const isActive = (href: string) => {
    const path = href.split("#")[0];
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path) && path !== "/";
  };

  const desktopLinkClass = (active: boolean) =>
    `transition-all duration-200 font-medium relative group whitespace-nowrap cursor-pointer ${
      active ? "text-orange-400" : "text-white/80 hover:text-white"
    }`;

  const mobileLinkClass = (active: boolean) =>
    `text-sm font-medium transition py-1 cursor-pointer ${
      active ? "text-orange-400" : "text-white/80 hover:text-orange-400"
    }`;

  const underline = (active: boolean) =>
    `absolute -bottom-0.5 left-0 h-px bg-orange-400 transition-all duration-300 ${
      active ? "w-full" : "w-0 group-hover:w-full"
    }`;

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
          <Link href="/" onClick={handleInicio} className="shrink-0 flex items-center">
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

            <Link href="/" onClick={handleInicio} className={desktopLinkClass(pathname === "/")}>
              Inicio
              <span className={underline(pathname === "/")} />
            </Link>

            {PAGE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={desktopLinkClass(isActive(link.href))}
              >
                {link.label}
                <span className={underline(isActive(link.href))} />
              </Link>
            ))}

            <Link href="/#servicios" onClick={handleServicios} className={desktopLinkClass(false)}>
              Servicios
              <span className={underline(false)} />
            </Link>

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
            <Link href="/" onClick={handleInicio} className={mobileLinkClass(pathname === "/")}>
              Inicio
            </Link>

            {PAGE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={mobileLinkClass(isActive(link.href))}
              >
                {link.label}
              </Link>
            ))}

            <Link href="/#servicios" onClick={handleServicios} className={mobileLinkClass(false)}>
              Servicios
            </Link>

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
