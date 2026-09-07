"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { WHATSAPP_NUMBER, NOMBRE_AGENTE } from "../lib/config";

export default function ContactForm() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim()) return;
    const texto = encodeURIComponent(
      `Hola ${NOMBRE_AGENTE}, mi nombre es ${nombre.trim()}. Mi teléfono es ${telefono.trim()}.${
        mensaje.trim() ? ` Mi consulta: ${mensaje.trim()}` : ""
      }`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`, "_blank");
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre-contacto" className="block text-sm text-white/60 mb-1.5">
            Nombre *
          </label>
          <input
            id="nombre-contacto"
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30 text-sm"
          />
        </div>
        <div>
          <label htmlFor="telefono-contacto" className="block text-sm text-white/60 mb-1.5">
            Teléfono *
          </label>
          <input
            id="telefono-contacto"
            type="tel"
            placeholder="Tu teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30 text-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="mensaje-contacto" className="block text-sm text-white/60 mb-1.5">
          Mensaje (opcional)
        </label>
        <textarea
          id="mensaje-contacto"
          placeholder="¿En qué te podemos ayudar?"
          rows={4}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30 resize-none text-sm"
        />
      </div>
      <button
        type="submit"
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
          enviado
            ? "bg-green-500 text-white"
            : "bg-orange-500 hover:bg-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/25"
        }`}
      >
        <FaWhatsapp size={18} />
        {enviado ? "¡Consulta enviada!" : "Enviar consulta por WhatsApp"}
      </button>
    </form>
  );
}
