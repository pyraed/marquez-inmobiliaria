import type { Metadata } from "next";
import Link from "next/link";
import {
  FaHome, FaHandshake, FaChartLine, FaWhatsapp,
  FaCheckCircle, FaArrowRight,
} from "react-icons/fa";
import {
  NOMBRE_INMOBILIARIA,
  NOMBRE_AGENTE,
  WHATSAPP_URL,
  LOCALIDAD_PRINCIPAL,
} from "../../../lib/config";

export const metadata: Metadata = {
  title: "Servicios",
  description: `Servicios inmobiliarios de ${NOMBRE_INMOBILIARIA}: compra, venta, alquiler e inversiones en ${LOCALIDAD_PRINCIPAL} y alrededores. Asesoramiento personalizado en cada etapa.`,
};

const servicios = [
  {
    icon: <FaHome size={32} />,
    titulo: "Compra y venta",
    descripcion:
      "Te asesoramos en todo el proceso de compra o venta de tu propiedad, con total transparencia y acompañamiento personalizado.",
    detalles: [
      "Tasación profesional de tu propiedad",
      "Publicación y difusión en los principales portales",
      "Gestión de visitas y negociación",
      "Acompañamiento hasta la firma de escritura",
    ],
  },
  {
    icon: <FaHandshake size={32} />,
    titulo: "Alquileres",
    descripcion:
      "Gestionamos alquileres para propietarios e inquilinos, asegurándonos de que todo el proceso sea simple y seguro.",
    detalles: [
      "Búsqueda y selección de inquilinos",
      "Redacción y gestión del contrato",
      "Cobro y administración de alquileres",
      "Asesoramiento legal durante toda la relación",
    ],
  },
  {
    icon: <FaChartLine size={32} />,
    titulo: "Inversiones",
    descripcion:
      "Identificamos las mejores oportunidades del mercado para que tu capital crezca con seguridad y rentabilidad.",
    detalles: [
      "Análisis del mercado inmobiliario local",
      "Identificación de oportunidades de inversión",
      "Evaluación de rentabilidad y riesgo",
      "Seguimiento post-inversión",
    ],
  },
];

export default function ServiciosPage() {
  return (
    <main className="bg-[#0B1F3A] text-white pt-24 min-h-screen">

      {/* ENCABEZADO */}
      <section className="px-6 py-16 max-w-4xl mx-auto text-center">
        <span className="text-orange-400 text-xs font-semibold tracking-widest uppercase mb-4 block">
          {NOMBRE_INMOBILIARIA}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          ¿En qué te ayudamos?
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">
          Servicios pensados para cada etapa de tu proceso inmobiliario,
          con asesoramiento personalizado de {NOMBRE_AGENTE}.
        </p>
      </section>

      {/* CARDS DE SERVICIOS */}
      <section className="px-6 pb-16 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {servicios.map((servicio) => (
            <div
              key={servicio.titulo}
              className="bg-[#102A4C] rounded-2xl p-8 border border-white/10 hover:border-orange-500/40 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 flex flex-col"
            >
              <div className="text-orange-400 mb-5 group-hover:scale-110 transition-transform duration-300 w-fit">
                {servicio.icon}
              </div>
              <h2 className="text-xl font-semibold mb-3">{servicio.titulo}</h2>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                {servicio.descripcion}
              </p>
              <ul className="space-y-2 mt-auto">
                {servicio.detalles.map((detalle) => (
                  <li key={detalle} className="flex items-start gap-2 text-sm text-white/65">
                    <FaCheckCircle size={13} className="text-orange-400 shrink-0 mt-0.5" />
                    {detalle}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#102A4C] border-t border-white/10 px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            ¿Listo para dar el siguiente paso?
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Contactate con {NOMBRE_AGENTE} y recibí asesoramiento personalizado
            sin compromiso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 px-8 py-3.5 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30"
            >
              <FaWhatsapp size={18} />
              Consultar por WhatsApp
            </a>
            <Link
              href="/propiedades"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-3.5 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5"
            >
              Ver propiedades
              <FaArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
