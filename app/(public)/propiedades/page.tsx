import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { createPublicClient } from "../../../lib/supabase-public";
import PropiedadCard from "../../../components/propiedades/PropiedadCard";
import FiltrosPropiedades from "../../../components/propiedades/FiltrosPropiedades";
import type { Metadata } from "next";
import type { PropiedadCard as PropiedadCardType } from "../../../types/propiedad";
import { NOMBRE_INMOBILIARIA, WHATSAPP_NUMBER } from "../../../lib/config";

export const metadata: Metadata = {
  title: "Propiedades",
  description: `Explorá todas las propiedades en venta y alquiler de ${NOMBRE_INMOBILIARIA}. Casas, departamentos, terrenos, campos y más.`,
};

export const dynamic = "force-dynamic";

interface SearchParams {
  operacion?: string;
  tipo?: string;
  localidad?: string;
  precioMin?: string;
  precioMax?: string;
  orden?: string;
  q?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

// Cachea las localidades únicas — cambian muy poco, cache de 5 minutos.
// Independiente de los filtros aplicados.
const getLocalidades = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("propiedades")
      .select("localidad")
      .in("estado", ["publicada", "reservada"])
      .order("localidad");
    return [...new Set((data || []).map((p: { localidad: string }) => p.localidad).filter(Boolean))];
  },
  ["localidades"],
  { revalidate: 300 } // 5 minutos
);

// Cachea las propiedades filtradas — cache de 60 segundos por combinación de filtros.
const getPropiedades = unstable_cache(
  async (filtros: SearchParams) => {
    const supabase = createPublicClient();

    let query = supabase
      .from("propiedades")
      .select("id, slug, titulo, operacion, tipo, precio_display, precio_valor, ubicacion, localidad, imagenes, dormitorios, banos, superficie_m2, ambientes")
      .in("estado", ["publicada", "reservada"]);

    if (filtros.operacion) query = query.eq("operacion", filtros.operacion);
    if (filtros.tipo) query = query.eq("tipo", filtros.tipo);
    if (filtros.localidad) query = query.eq("localidad", filtros.localidad);
    if (filtros.precioMin) {
      const min = Number(filtros.precioMin);
      if (!isNaN(min)) query = query.gte("precio_valor", min);
    }
    if (filtros.precioMax) {
      const max = Number(filtros.precioMax);
      if (!isNaN(max)) query = query.lte("precio_valor", max);
    }
    if (filtros.q) {
      query = query.or(`titulo.ilike.%${filtros.q}%,ubicacion.ilike.%${filtros.q}%,localidad.ilike.%${filtros.q}%`);
    }
    if (filtros.orden === "precio_asc") {
      query = query.order("precio_valor", { ascending: true, nullsFirst: false });
    } else if (filtros.orden === "precio_desc") {
      query = query.order("precio_valor", { ascending: false, nullsFirst: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data } = await query;
    return (data as unknown as PropiedadCardType[]) || [];
  },
  ["propiedades-filtradas"],
  { revalidate: 60 } // 60 segundos
);

export default async function PropiedadesPage({ searchParams }: Props) {
  const params = await searchParams;

  // Las dos queries corren en paralelo, ambas cacheadas
  const [propiedades, localidades] = await Promise.all([
    getPropiedades(params),
    getLocalidades(),
  ]);

  return (
    <main className="bg-[#0B1F3A] text-white pt-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Propiedades</h1>
          <p className="text-white/50 mt-1 text-sm">
            {params.operacion ? `En ${params.operacion.toLowerCase()}` : "Venta y alquiler"} en la zona
          </p>
        </div>

        <div className="mb-8">
          <Suspense>
            <FiltrosPropiedades localidades={localidades} total={propiedades.length} />
          </Suspense>
        </div>

        {propiedades.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {propiedades.map((prop, i) => (
              <PropiedadCard key={prop.id} propiedad={prop} prioridad={i < 3} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-white/60 text-lg font-medium mb-2">
              No encontramos propiedades con esos filtros
            </p>
            <p className="text-white/40 text-sm mb-8">
              Probá cambiando los filtros o consultanos directamente
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold transition"
            >
              Consultar disponibilidad
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
