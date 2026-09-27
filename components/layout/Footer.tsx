import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import {
  NOMBRE_INMOBILIARIA,
  WHATSAPP_URL,
  PHONE_HREF,
  PHONE_NUMBER,
  UBICACION_DISPLAY,
  INSTAGRAM_URL,
  FACEBOOK_URL,
  HORARIO,
} from "../../lib/config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#081629] text-white px-6 py-14 border-t border-white/5">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

        {/* BRAND */}
        <div>
          <Link href="/" className="inline-block mb-5">
            <Image
              src="/logo-marquez.png"
              alt="MarQuez Negocios Inmobiliarios"
              width={390}
              height={175}
              className="h-20 w-auto object-contain"
            />
          </Link>
          <p className="text-white/50 text-sm leading-relaxed mb-5">
            Asesoramiento inmobiliario personalizado en compra, venta y alquiler
            de propiedades en {UBICACION_DISPLAY}.
          </p>

          {/* REDES SOCIALES */}
          {(INSTAGRAM_URL || FACEBOOK_URL) && (
            <div>
              <p className="text-white/90 text-sm font-semibold mb-3">Redes sociales</p>
              <div className="flex gap-3">
                {INSTAGRAM_URL && (
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram de MarQuez"
                    className="flex items-center gap-2 bg-white/10 hover:bg-orange-500/20 hover:text-orange-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    <FaInstagram size={15} />
                    Instagram
                  </a>
                )}
                {FACEBOOK_URL && (
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook de MarQuez"
                    className="flex items-center gap-2 bg-white/10 hover:bg-orange-500/20 hover:text-orange-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    <FaFacebook size={15} />
                    Facebook
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* NAVEGACIÓN */}
        <div>
          <h4 className="font-semibold mb-5 text-white/90">Navegación</h4>
          <ul className="space-y-3 text-white/60 text-sm">
            {[
              { href: "/", label: "Inicio" },
              { href: "/propiedades", label: "Propiedades" },
              { href: "/servicios", label: "Servicios" },
              { href: "/propiedades?operacion=Venta", label: "Propiedades en venta" },
              { href: "/propiedades?operacion=Alquiler", label: "Propiedades en alquiler" },
              { href: "/tasaciones", label: "Tasaciones" },
              { href: "/contacto", label: "Contacto" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-orange-400 transition">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACTO */}
        <div>
          <h4 className="font-semibold mb-5 text-white/90">Contacto</h4>
          <ul className="space-y-4 text-white/60 text-sm">
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition font-medium"
              >
                <FaWhatsapp size={15} />
                WhatsApp
              </a>
            </li>
            <li>
              <a href={PHONE_HREF} className="hover:text-orange-400 transition">
                📞 {PHONE_NUMBER}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <span>📍</span>
              <span>{UBICACION_DISPLAY}</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🕐</span>
              <span>{HORARIO}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-white/30 text-xs">
        <p>© {year} {NOMBRE_INMOBILIARIA}. Todos los derechos reservados.</p>
        <Link href="/admin/login" className="hover:text-white/50 transition">
          Acceso administrador
        </Link>
      </div>
    </footer>
  );
}
