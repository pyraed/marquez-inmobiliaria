import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp, FaPhone, FaHome, FaHandshake, FaChartLine, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { createPublicClient } from "../../lib/supabase-public";
import ContactForm from "../../components/ContactForm";
import ScrollReveal from "../../components/ScrollReveal";
import PropiedadCard from "../../components/propiedades/PropiedadCard";
import {
  WHATSAPP_URL, PHONE_HREF, PHONE_NUMBER,
  UBICACION_DISPLAY, HORARIO, NOMBRE_AGENTE, NOMBRE_INMOBILIARIA,
} from "../../lib/config";
import type { PropiedadCard as PropiedadCardType } from "../../types/propiedad";

export const revalidate = 60;

export default async function Home() {
  const supabase = createPublicClient();

  // Propiedades destacadas (marcadas como destacada=true) o las más recientes
  const { data: destacadasData } = await supabase
    .from("propiedades")
    .select("id, slug, titulo, operacion, tipo, precio_display, ubicacion, localidad, imagenes, dormitorios, banos, superficie_m2, ambientes")
    .eq("estado", "publicada")
    .eq("destacada", true)
    .order("created_at", { ascending: false })
    .limit(3);

  // Si no hay destacadas, traer las 3 más recientes
  let propiedades: PropiedadCardType[] = [];
  if (destacadasData && destacadasData.length > 0) {
    propiedades = destacadasData as unknown as PropiedadCardType[];
  } else {
    const { data: recientes } = await supabase
      .from("propiedades")
      .select("id, slug, titulo, operacion, tipo, precio_display, ubicacion, localidad, imagenes, dormitorios, banos, superficie_m2, ambientes")
      .eq("estado", "publicada")
      .order("created_at", { ascending: false })
      .limit(3);
    propiedades = (recientes as unknown as PropiedadCardType[]) || [];
  }

  return (
    <main className="bg-[#0B1F3A] text-white pt-20">

      {/* ════════ HERO ════════ */}
      <section className="relative min-h-[92vh] flex items-center justify-center text-center vignette overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Propiedades en venta y alquiler"
          fill
          className="object-cover"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F3A]/60 via-[#0B1F3A]/50 to-[#0B1F3A]/80" />

        <div className="relative z-10 px-6 max-w-4xl w-full">
          <ScrollReveal>
            <p className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-6">
              {NOMBRE_INMOBILIARIA}
            </p>
          </ScrollReveal>

          <ScrollReveal className="reveal-delay-1">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8">
              <div className="flex flex-col gap-1.5 text-left">
                {["Tu Casa", "Tu Terreno", "Tu Campo"].map((txt) => (
                  <span key={txt} className="text-2xl md:text-4xl font-bold text-white/80 tracking-widest uppercase">
                    {txt}
                  </span>
                ))}
              </div>
              <div className="hidden md:block w-px h-32 bg-orange-500/60" />
              <div className="block md:hidden h-px w-28 bg-orange-500/60" />
              <span className="text-7xl md:text-[9rem] font-black text-orange-500 leading-none tracking-tight">
                HOY
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal className="reveal-delay-2">
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {["Compra y Venta", "Casas", "Campos", "Terrenos"].map((item) => (
                <span
                  key={item}
                  className="bg-white/10 border border-white/20 backdrop-blur px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide text-white/90 uppercase"
                >
                  {item}
                </span>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal className="reveal-delay-3">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 px-8 py-3.5 rounded-full text-base font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5"
              >
                <FaWhatsapp size={18} />
                Contactar por WhatsApp
              </a>
              <Link
                href="/propiedades"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 px-8 py-3.5 rounded-full text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm"
              >
                Ver propiedades
                <FaArrowRight size={13} />
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ════════ SERVICIOS ════════ */}
      <section id="servicios" className="px-6 py-20 max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-3xl font-bold mb-2 text-center">¿En qué te ayudamos?</h2>
          <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
            Servicios pensados para cada etapa de tu proceso inmobiliario
          </p>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <FaHome size={26} />,
              titulo: "Compra y venta",
              descripcion: "Te asesoramos en todo el proceso de compra o venta de tu propiedad, con total transparencia y acompañamiento personalizado.",
              delay: "reveal-delay-1",
            },
            {
              icon: <FaHandshake size={26} />,
              titulo: "Alquileres",
              descripcion: "Gestionamos alquileres para propietarios e inquilinos, asegurándonos de que todo el proceso sea simple y seguro.",
              delay: "reveal-delay-2",
            },
            {
              icon: <FaChartLine size={26} />,
              titulo: "Inversiones",
              descripcion: "Identificamos las mejores oportunidades del mercado para que tu capital crezca con seguridad y rentabilidad.",
              delay: "reveal-delay-3",
            },
          ].map((servicio) => (
            <ScrollReveal key={servicio.titulo} className={servicio.delay}>
              <div className="bg-[#102A4C] rounded-2xl p-7 border border-white/10 hover:border-orange-500/40 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 h-full">
                <div className="text-orange-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {servicio.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3">{servicio.titulo}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{servicio.descripcion}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ════════ PROPIEDADES DESTACADAS ════════ */}
      <section className="px-6 py-20 bg-[#102A4C] border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-bold">Propiedades destacadas</h2>
                <p className="text-white/50 mt-1">Las mejores oportunidades del momento</p>
              </div>
              <Link
                href="/propiedades"
                className="text-orange-400 hover:text-orange-300 text-sm font-semibold transition flex items-center gap-1.5 w-fit"
              >
                Ver todas <FaArrowRight size={11} />
              </Link>
            </div>
          </ScrollReveal>

          {propiedades.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {propiedades.map((prop, i) => (
                <ScrollReveal key={prop.id} className={`reveal-delay-${i + 1}`}>
                  <PropiedadCard propiedad={prop as unknown as Parameters<typeof PropiedadCard>[0]["propiedad"]} prioridad={i === 0} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-white/40">
              <p className="text-lg mb-4">Próximamente nuevas propiedades</p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold transition"
              >
                <FaWhatsapp />
                Consultar disponibilidad
              </a>
            </div>
          )}

          <ScrollReveal>
            <div className="text-center mt-10">
              <Link
                href="/propiedades"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5"
              >
                Ver todas las propiedades
                <FaArrowRight size={13} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════ SOBRE MATÍAS ════════ */}
      <section className="bg-[#0B1F3A] py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <ScrollReveal>
            <div className="flex justify-center">
              <div className="relative w-72 h-72 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10">
                <Image
                  src="/Matias.jpeg"
                  alt={`${NOMBRE_AGENTE} — Agente inmobiliario`}
                  fill
                  sizes="288px"
                  className="object-cover"
                />
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal className="reveal-delay-2">
            <div>
              <span className="text-orange-400 text-xs font-semibold tracking-widest uppercase mb-3 block">
                Quién soy
              </span>
              <h2 className="text-3xl font-bold mb-1">{NOMBRE_AGENTE}</h2>
              <p className="text-white/50 text-sm mb-5 font-medium tracking-wide">
                Agente Inmobiliario · Fundador de MarQuez
              </p>
              <p className="text-white/75 leading-relaxed mb-4">
                Soy {NOMBRE_AGENTE}, agente inmobiliario y fundador de {NOMBRE_INMOBILIARIA}.
                Me especializo en la compra, venta y asesoramiento de propiedades,
                acompañando a cada cliente en todo el proceso con un enfoque personalizado y transparente.
              </p>
              <p className="text-white/75 leading-relaxed mb-8">
                Mi objetivo es ayudarte a tomar la mejor decisión, ya sea para invertir,
                vender o encontrar tu próximo hogar.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Compra y venta", "Alquileres", "Inversiones", "Asesoramiento", "Tasaciones"].map((tag) => (
                  <span
                    key={tag}
                    className="bg-white/10 border border-white/15 hover:border-orange-500/40 hover:bg-orange-500/10 px-3 py-1 rounded-full text-sm text-white/65 transition-all duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════ CTA TASACIONES ════════ */}
      <section className="bg-[#102A4C] border-y border-white/10 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              ¿Querés vender o alquilar tu propiedad?
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Te hacemos una tasación gratuita y te asesoramos sobre el mejor camino
              para que tu propiedad se destaque en el mercado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tasaciones"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 px-8 py-3.5 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30"
              >
                Solicitar tasación gratuita
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-3.5 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5"
              >
                <FaWhatsapp />
                Consultar por WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════ CONTACTO ════════ */}
      <section id="contacto" className="bg-[#0B1F3A] py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <ScrollReveal>
            <div>
              <span className="text-orange-400 text-xs font-semibold tracking-widest uppercase mb-3 block">
                Contacto
              </span>
              <h2 className="text-3xl font-bold mb-2">¿Tenés alguna consulta?</h2>
              <p className="text-white/50 mb-8">Dejanos tus datos y te respondemos a la brevedad.</p>
              <ContactForm />
            </div>
          </ScrollReveal>

          <ScrollReveal className="reveal-delay-2">
            <div className="flex flex-col justify-center gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Contacto directo</h3>
                <p className="text-white/60 text-sm">
                  Podés comunicarte directamente con {NOMBRE_AGENTE} para asesoramiento personalizado.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/30 px-5 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  <FaWhatsapp className="text-orange-400 shrink-0" size={20} />
                  <div>
                    <p className="text-sm font-semibold">WhatsApp</p>
                    <p className="text-white/50 text-xs">Respuesta inmediata</p>
                  </div>
                </a>
                <a
                  href={PHONE_HREF}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/30 px-5 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  <FaPhone className="text-orange-400 shrink-0" size={17} />
                  <div>
                    <p className="text-sm font-semibold">{PHONE_NUMBER}</p>
                    <p className="text-white/50 text-xs">{HORARIO}</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 px-5 py-4">
                  <FaMapMarkerAlt className="text-orange-400 shrink-0" size={17} />
                  <div>
                    <p className="text-sm font-semibold">{UBICACION_DISPLAY}</p>
                    <p className="text-white/50 text-xs">Zona de cobertura principal</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
