"use client";

import { useState } from "react";
import { FaShare, FaCheck } from "react-icons/fa";

interface ShareButtonProps {
  titulo: string;
  url: string;
}

export default function ShareButton({ titulo, url }: ShareButtonProps) {
  const [copiado, setCopiado] = useState(false);

  const compartir = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: titulo,
          text: `Mirá esta propiedad: ${titulo}`,
          url,
        });
      } catch {
        // El usuario canceló o hubo error — no hacer nada
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      } catch {
        // Clipboard no disponible
      }
    }
  };

  return (
    <button
      onClick={compartir}
      title="Compartir propiedad"
      className="flex items-center gap-4 group w-full text-left"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition ${
        copiado
          ? "bg-green-500/20"
          : "bg-orange-500/20 group-hover:bg-orange-500/40"
      }`}>
        {copiado
          ? <FaCheck className="text-green-400" size={14} />
          : <FaShare className="text-orange-400" size={14} />
        }
      </div>
      <div>
        <p className={`text-sm font-semibold transition ${
          copiado ? "text-green-400" : "group-hover:text-orange-400"
        }`}>
          {copiado ? "¡Link copiado!" : "Compartir"}
        </p>
        <p className="text-white/50 text-xs">
          {copiado ? "El enlace está en tu portapapeles" : "Compartir esta propiedad"}
        </p>
      </div>
    </button>
  );
}
