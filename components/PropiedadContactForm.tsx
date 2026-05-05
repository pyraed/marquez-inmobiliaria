"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function PropiedadContactForm({
  titulo,
  ubicacion,
}: {
  titulo: string;
  ubicacion: string;
}) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState(
    `Hola Matías, me interesa la propiedad "${titulo}" en ${ubicacion}. Por favor contácteme.`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !telefono) return;
    const texto = encodeURIComponent(
      `Hola Matías, mi nombre es ${nombre}. Mi teléfono es ${telefono}. ${mensaje}`
    );
    window.open(`https://wa.me/5492983340336?text=${texto}`, "_blank");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Tu nombre *"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/40"
        />
        <input
          type="tel"
          placeholder="Tu teléfono *"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
          className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/40"
        />
      </div>
      <textarea
        rows={4}
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition resize-none"
      />
      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold transition w-full sm:w-auto sm:px-12"
      >
        <FaWhatsapp size={18} />
        Enviar consulta por WhatsApp
      </button>
    </form>
  );
}
