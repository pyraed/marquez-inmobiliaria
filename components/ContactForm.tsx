"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactForm() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !telefono) return;
    const texto = encodeURIComponent(
      `Hola Matías, mi nombre es ${nombre}. Mi teléfono es ${telefono}. ${mensaje ? `Mi consulta: ${mensaje}` : ""}`
    );
    window.open(`https://wa.me/5492983340336?text=${texto}`, "_blank");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nombre *"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/40"
        />
        <input
          type="tel"
          placeholder="Teléfono *"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
          className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/40"
        />
      </div>
      <textarea
        placeholder="¿En qué te podemos ayudar?"
        rows={4}
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/40 resize-none"
      />
      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold transition"
      >
        <FaWhatsapp size={18} />
        Enviar consulta por WhatsApp
      </button>
    </form>
  );
}
