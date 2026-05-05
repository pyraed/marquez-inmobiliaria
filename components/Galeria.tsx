"use client";
import { useState } from "react";
import Image from "next/image";

export default function Galeria({ imagenes }: { imagenes: string[] }) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const prev = () => {
    setIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };
  const next = () => {
    setIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  if (!imagenes || imagenes.length === 0) return null;

  return (
    <>
      <div className="grid gap-4">
        <div className="relative w-full h-[420px] rounded-2xl overflow-hidden">
          <Image
            src={imagenes[index]}
            alt="bg"
            fill
            className="object-cover blur-2xl scale-125 opacity-30 pointer-events-none z-0"
          />
          <Image
            src={imagenes[index]}
            alt="propiedad"
            fill
            className="object-contain cursor-pointer z-10"
            onClick={() => setFullscreen(true)}
          />
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 px-3 py-2 rounded-full z-20"
          >
            ←
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 px-3 py-2 rounded-full z-20"
          >
            →
          </button>
          <div className="absolute bottom-3 right-3 bg-black/60 px-3 py-1 rounded text-sm z-20">
            {index + 1} / {imagenes.length}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {imagenes.map((img, i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              className={`relative h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition ${
                index === i
                  ? "border-orange-500 scale-105"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img} alt="miniatura" fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      {fullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <Image
            src={imagenes[index]}
            alt="fullscreen"
            fill
            className="object-contain"
          />
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-5 right-5 text-white text-2xl z-50"
          >
            ✕
          </button>
          <button onClick={prev} className="absolute left-5 text-white text-3xl z-50">
            ←
          </button>
          <button onClick={next} className="absolute right-5 text-white text-3xl z-50">
            →
          </button>
        </div>
      )}
    </>
  );
}