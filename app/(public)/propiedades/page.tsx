import { Suspense } from "react";
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

export const revalidate = 60;

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

export default async function PropiedadesPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = createPublicClient();

  let query = supabase
    .from("propiedades")
    .select("id, slug, titulo, operacion, tipo, precio_display, precio_valor, ubicacion, localidad, imagenes, dormitorios, banos, superficie_m2, ambientes")
    .in("estado", ["publicada", "reservada"]);

  if (params.operacion) query = query.eq("operacion", params.operacion);
  if (params.tipo) query = query.eq("tipo", params.tipo);
  if (params.localidad) query = query.eq("localidad", params.localidad);
  if (params.precioMin) {
    const min = Number(params.precioMin);
    if (!isNaN(min)) query = query.gte("precio_valor", min);
  }
  if (params.precioMax) {
    const max = Number(params.precioMax);
    if (!isNaN(max)) query = query.lte("precio_valor", max);
  }
  if (params.q) {
    query = query.or(`titulo.ilike.%${params.q}%,ubicacion.ilike.%${params.q}%,localidad.ilike.%${params.q}%`);
  }
  if (params.orden === "precio_asc") {
    query = query.order("precio_valor", { ascending: true, nullsFirst: false });
  } else if (params.orden === "precio_desc") {
    query = query.order("precio_valor", { ascending: false, nullsFirst: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const [propiedadesResult, localidadesResult] = await Promise.all([
    query,
    supabase
      .from("propiedades")
      .select("localidad")
      .in("estado", ["publicada", "reservada"])
      .order("localidad"),
  ]);

  const propiedades = (propiedadesResult.data as unknown as PropiedadCardType[]) || [];
  const localidades = [
    ...new Set(
      (localidadesResult.data || [])
        .map((p: { localidad: string }) => p.localidad)
        .filter(Boolean)
    ),
  ];

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
