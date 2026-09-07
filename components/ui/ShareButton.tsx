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
      // Fallback: copiar al portapapeles
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
      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
      title="Compartir propiedad"
    >
      {copiado ? (
        <>
          <FaCheck size={13} className="text-green-400" />
          <span className="text-green-400">¡Link copiado!</span>
        </>
      ) : (
        <>
          <FaShare size={13} />
          Compartir
        </>
      )}
    </button>
  );
}
