import type { Metadata } from "next";
import { FaWhatsapp, FaCheckCircle } from "react-icons/fa";
import ContactForm from "../../../components/ContactForm";
import {
  NOMBRE_AGENTE, NOMBRE_INMOBILIARIA, WHATSAPP_NUMBER,
  LOCALIDAD_PRINCIPAL,
} from "../../../lib/config";

export const metadata: Metadata = {
  title: "Tasaciones — Vendé o alquilá tu propiedad",
  description: `¿Querés vender o alquilar tu propiedad en ${LOCALIDAD_PRINCIPAL}? ${NOMBRE_INMOBILIARIA} te ofrece tasación gratuita y asesoramiento personalizado.`,
};

const pasos = [
  {
    numero: "01",
    titulo: "Nos contactás",
    descripcion: "Escribinos por WhatsApp o completá el formulario con los datos de tu propiedad.",
  },
  {
    numero: "02",
    titulo: "Tasación gratuita",
    descripcion: `${NOMBRE_AGENTE} evalúa tu propiedad y te da un valor de mercado real y actualizado.`,
  },
  {
    numero: "03",
    titulo: "Publicamos tu propiedad",
    descripcion: "Armamos una publicación profesional con fotos y descripción para maximizar consultas.",
  },
  {
    numero: "04",
    titulo: "Cerramos el trato",
    descripcion: "Te acompañamos en todo el proceso hasta la firma, garantizando seguridad y transparencia.",
  },
];

const ventajas = [
  "Tasación gratuita y sin compromiso",
  "Asesoramiento personalizado en cada etapa",
  "Publicación profesional con fotos de calidad",
  "Amplia red de potenciales compradores e inquilinos",
  "Gestión completa de documentación",
  "Acompañamiento hasta la firma",
];

export default function TasacionesPage() {
  const mensajeWA = encodeURIComponent(
    `Hola ${NOMBRE_AGENTE}, quisiera consultar sobre tasar/vender/alquilar mi propiedad. ¿Podemos hablar?`
  );

  return (
    <main className="bg-[#0B1F3A] text-white pt-24 min-h-screen">

      {/* HERO */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <span className="text-orange-400 text-xs font-semibold tracking-widest uppercase mb-4 block">
          Para propietarios
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
          ¿Querés vender o alquilar
          <br className="hidden sm:block" /> tu propiedad?
        </h1>
        <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
          Te hacemos una tasación gratuita y te asesoramos para que tu propiedad
          se venda o alquile rápido y al mejor precio.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeWA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5"
          >
            <FaWhatsapp size={20} />
            Solicitar tasación gratis
          </a>
        </div>
      </section>

      {/* VENTAJAS */}
      <section className="bg-[#102A4C] border-y border-white/10 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">¿Por qué elegirnos?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {ventajas.map((v) => (
              <div key={v} className="flex items-start gap-3">
                <FaCheckCircle className="text-orange-400 shrink-0 mt-0.5" size={16} />
                <p className="text-white/75 text-sm">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PASOS */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">Cómo funciona</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {pasos.map((paso) => (
            <div
              key={paso.numero}
              className="bg-[#102A4C] rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 transition-all duration-300"
            >
              <span className="text-4xl font-black text-orange-500/30 leading-none">{paso.numero}</span>
              <h3 className="text-lg font-semibold mt-2 mb-2">{paso.titulo}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{paso.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FORMULARIO */}
      <section className="bg-[#102A4C] border-t border-white/10 px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">Consultanos sin compromiso</h2>
            <p className="text-white/50 text-sm">
              Dejanos tus datos y {NOMBRE_AGENTE} se pondrá en contacto a la brevedad.
            </p>
          </div>
          <div className="bg-[#0B1F3A] rounded-2xl p-8 border border-white/10">
            <ContactForm />
          </div>
        </div>
      </section>

    </main>
  );
}
