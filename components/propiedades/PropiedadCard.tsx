import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import type { PropiedadCard } from "../../types/propiedad";

interface Props {
  propiedad: PropiedadCard & {
    ambientes?: number | null;
    dormitorios?: number | null;
    banos?: number | null;
    superficie_m2?: number | null;
  };
  prioridad?: boolean;
}

export default function PropiedadCard({ propiedad, prioridad = false }: Props) {
  const {
    slug,
    titulo,
    operacion,
    tipo,
    precio_display,
    ubicacion,
    imagenes,
    ambientes,
    dormitorios,
    banos,
    superficie_m2,
  } = propiedad;

  const colorOperacion =
    operacion === "Venta"
      ? "bg-orange-500 text-white"
      : "bg-blue-500 text-white";

  return (
    <Link
      href={`/propiedades/${slug}`}
      className="group bg-[#102A4C] rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/30 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"
    >
      {/* IMAGEN */}
      <div className="relative w-full h-52 overflow-hidden bg-[#0B1F3A]">
        {imagenes?.[0] ? (
          <Image
            src={imagenes[0]}
            alt={titulo}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={prioridad}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <span className="text-4xl">⌂</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${colorOperacion}`}>
            {operacion}
          </span>
          <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
            {tipo}
          </span>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-semibold text-base leading-snug group-hover:text-orange-400 transition-colors duration-200 line-clamp-2 min-h-[44px]">
          {titulo}
        </h3>

        <p className="text-white/50 text-xs mt-2 flex items-center gap-1.5">
          <FaMapMarkerAlt size={10} className="shrink-0 text-orange-400/70" />
          <span className="truncate">{ubicacion}</span>
        </p>

        {/* CARACTERÍSTICAS */}
        {(dormitorios || banos || superficie_m2 || ambientes) && (
          <div className="flex gap-3 mt-3 text-white/50 text-xs">
            {dormitorios && (
              <span className="flex items-center gap-1">
                <FaBed size={10} />
                {dormitorios} dorm.
              </span>
            )}
            {banos && (
              <span className="flex items-center gap-1">
                <FaBath size={10} />
                {banos} baño{banos > 1 ? "s" : ""}
              </span>
            )}
            {superficie_m2 && (
              <span className="flex items-center gap-1">
                <FaRulerCombined size={10} />
                {superficie_m2} m²
              </span>
            )}
            {!dormitorios && !banos && !superficie_m2 && ambientes && (
              <span>{ambientes} amb.</span>
            )}
          </div>
        )}

        <div className="mt-auto pt-4">
          <p className="text-orange-400 font-bold text-xl">{precio_display}</p>
          <div className="mt-3 bg-orange-500 group-hover:bg-orange-600 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 text-center text-white">
            Ver propiedad →
          </div>
        </div>
      </div>
    </Link>
  );
}
