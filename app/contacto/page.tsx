import type { Metadata } from "next";
import ContactForm from "../../components/ContactForm";
import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaClock, FaInstagram, FaFacebook } from "react-icons/fa";
import {
  NOMBRE_INMOBILIARIA, NOMBRE_AGENTE, WHATSAPP_URL, PHONE_HREF,
  PHONE_NUMBER, UBICACION_DISPLAY, HORARIO,
  INSTAGRAM_URL, FACEBOOK_URL,
} from "../../lib/config";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Contactate con ${NOMBRE_INMOBILIARIA}. WhatsApp, teléfono y formulario de consulta disponibles.`,
};

export default function ContactoPage() {
  return (
    <main className="bg-[#0B1F3A] text-white pt-24 min-h-screen px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <div className="mb-12 text-center">
          <span className="text-orange-400 text-xs font-semibold tracking-widest uppercase mb-3 block">
            Estamos para ayudarte
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Contacto</h1>
          <p className="text-white/50 max-w-lg mx-auto">
            Dejanos tu consulta y te respondemos a la brevedad. También podés comunicarte directamente con {NOMBRE_AGENTE}.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* FORMULARIO */}
          <div className="bg-[#102A4C] rounded-2xl p-8 border border-white/10">
            <h2 className="text-xl font-semibold mb-6">Enviar consulta</h2>
            <ContactForm />
          </div>

          {/* INFO */}
          <div className="flex flex-col gap-6">

            <div className="bg-[#102A4C] rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold mb-5">Información de contacto</h2>
              <div className="flex flex-col gap-5">

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0 group-hover:bg-orange-500/40 transition">
                    <FaWhatsapp className="text-orange-400" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold group-hover:text-orange-400 transition">WhatsApp</p>
                    <p className="text-white/50 text-xs">Respuesta inmediata</p>
                  </div>
                </a>

                <a
                  href={PHONE_HREF}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0 group-hover:bg-orange-500/40 transition">
                    <FaPhone className="text-orange-400" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold group-hover:text-orange-400 transition">{PHONE_NUMBER}</p>
                    <p className="text-white/50 text-xs">Llamadas</p>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt className="text-orange-400" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{UBICACION_DISPLAY}</p>
                    <p className="text-white/50 text-xs">Zona de cobertura</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                    <FaClock className="text-orange-400" size={15} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{HORARIO}</p>
                    <p className="text-white/50 text-xs">Horario de atención</p>
                  </div>
                </div>

              </div>
            </div>

            {/* REDES */}
            {(INSTAGRAM_URL || FACEBOOK_URL) && (
              <div className="bg-[#102A4C] rounded-2xl p-6 border border-white/10">
                <h2 className="text-lg font-semibold mb-4">Redes sociales</h2>
                <div className="flex gap-3">
                  {INSTAGRAM_URL && (
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/10 hover:bg-orange-500/20 hover:text-orange-400 px-4 py-2.5 rounded-xl text-sm font-medium transition"
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
                      className="flex items-center gap-2 bg-white/10 hover:bg-orange-500/20 hover:text-orange-400 px-4 py-2.5 rounded-xl text-sm font-medium transition"
                    >
                      <FaFacebook size={15} />
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
