"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaTimes, FaExpand } from "react-icons/fa";

interface Props {
  imagenes: string[];
  titulo?: string;
}

export default function Galeria({ imagenes, titulo = "Propiedad" }: Props) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const prev = useCallback(() => {
    setIndex((i) => (i === 0 ? imagenes.length - 1 : i - 1));
  }, [imagenes.length]);

  const next = useCallback(() => {
    setIndex((i) => (i === imagenes.length - 1 ? 0 : i + 1));
  }, [imagenes.length]);

  // Navegación con teclado
  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreen, prev, next]);

  // Bloquea scroll cuando está en fullscreen
  useEffect(() => {
    document.body.style.overflow = fullscreen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [fullscreen]);

  if (!imagenes || imagenes.length === 0) return null;

  const cols = Math.min(imagenes.length, 6);

  return (
    <>
      {/* GALERÍA PRINCIPAL */}
      <div className="grid gap-3">

        {/* IMAGEN PRINCIPAL */}
        <div className="relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden bg-[#081629]">
          {/* Fondo desenfocado */}
          <Image
            src={imagenes[index]}
            alt=""
            fill
            className="object-cover blur-xl scale-125 opacity-25 pointer-events-none"
            aria-hidden="true"
          />
          {/* Imagen principal */}
          <Image
            src={imagenes[index]}
            alt={`${titulo} — foto ${index + 1} de ${imagenes.length}`}
            fill
            className="object-contain cursor-pointer z-10"
            onClick={() => setFullscreen(true)}
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />

          {/* Botón expandir */}
          <button
            onClick={() => setFullscreen(true)}
            className="absolute top-3 right-3 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-2 rounded-lg transition"
            aria-label="Ver imagen en pantalla completa"
          >
            <FaExpand size={14} className="text-white/80" />
          </button>

          {/* Navegación */}
          {imagenes.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-3 rounded-full transition min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Foto anterior"
              >
                <FaChevronLeft size={14} className="text-white" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-3 rounded-full transition min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Foto siguiente"
              >
                <FaChevronRight size={14} className="text-white" />
              </button>
            </>
          )}

          {/* Contador */}
          <div className="absolute bottom-3 right-3 z-20 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white/80">
            {index + 1} / {imagenes.length}
          </div>
        </div>

        {/* THUMBNAILS */}
        {imagenes.length > 1 && (
          <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {imagenes.slice(0, 6).map((img, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`relative h-16 sm:h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                  index === i
                    ? "ring-2 ring-orange-500 opacity-100"
                    : "opacity-60 hover:opacity-90"
                }`}
                aria-label={`Ver foto ${i + 1}`}
                aria-pressed={index === i}
              >
                <Image
                  src={img}
                  alt={`Miniatura ${i + 1}`}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
                {i === 5 && imagenes.length > 6 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-semibold">
                    +{imagenes.length - 6}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FULLSCREEN */}
      {fullscreen && (
        <div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Galería de imágenes"
        >
          <Image
            src={imagenes[index]}
            alt={`${titulo} — foto ${index + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
          />

          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/80 p-3 rounded-full z-50 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Cerrar galería"
          >
            <FaTimes size={16} />
          </button>

          {imagenes.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/80 p-4 rounded-full z-50 transition min-w-[52px] min-h-[52px] flex items-center justify-center"
                aria-label="Foto anterior"
              >
                <FaChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/80 p-4 rounded-full z-50 transition min-w-[52px] min-h-[52px] flex items-center justify-center"
                aria-label="Foto siguiente"
              >
                <FaChevronRight size={18} />
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1.5 rounded-full text-white/80 text-sm z-50">
            {index + 1} / {imagenes.length}
          </div>
        </div>
      )}
    </>
  );
}
