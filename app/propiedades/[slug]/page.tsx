import { createClient } from "../../../lib/supabase-server";
import Galeria from "../../../components/Galeria";
import PropiedadContactForm from "../../../components/PropiedadContactForm";
import ShareButton from "../../../components/ui/ShareButton";
import PropiedadCard from "../../../components/propiedades/PropiedadCard";
import Link from "next/link";
import type { Metadata } from "next";
import type { Propiedad, PropiedadCard as PropiedadCardType } from "../../../types/propiedad";
import {
  FaWhatsapp, FaPhone, FaMapMarkerAlt, FaRulerCombined,
  FaDoorOpen, FaBath, FaCar, FaBed, FaArrowLeft,
} from "react-icons/fa";
import {
  WHATSAPP_NUMBER, PHONE_HREF, PHONE_NUMBER,
  NOMBRE_AGENTE, SITE_URL, HORARIO,
} from "../../../lib/config";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPropiedad(slug: string): Promise<Propiedad | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("propiedades")
    .select("*")
    .eq("slug", slug)
    .single();
  return data as Propiedad | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const propiedad = await getPropiedad(slug);

  if (!propiedad) {
    return { title: "Propiedad no encontrada" };
  }

  const title = propiedad.seo_titulo
    || `${propiedad.titulo} en ${propiedad.localidad}`;
  const description = propiedad.seo_descripcion
    || propiedad.descripcion.slice(0, 155).replace(/\s+/g, " ").trim();
  const imagen = propiedad.imagenes?.[0];
  const url = `${SITE_URL}/propiedades/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      ...(imagen && {
        images: [{ url: imagen, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imagen && { images: [imagen] }),
    },
  };
}

export default async function PropiedadDetallePage({ params }: Props) {
  const { slug } = await params;
  const propiedad = await getPropiedad(slug);

  if (!propiedad) notFound();

  const supabase = await createClient();
  const { data: relacionadasData } = await supabase
    .from("propiedades")
    .select("id, slug, titulo, operacion, tipo, precio_display, ubicacion, localidad, imagenes, dormitorios, banos, superficie_m2, ambientes")
    .eq("operacion", propiedad.operacion)
    .neq("slug", slug)
    .in("estado", ["publicada", "reservada"])
    .limit(3);

  const relacionadas = (relacionadasData as unknown as PropiedadCardType[]) || [];

  const mensajeWhatsapp = encodeURIComponent(
    `Hola ${NOMBRE_AGENTE}, me interesa la propiedad "${propiedad.titulo}" en ${propiedad.ubicacion}${propiedad.precio_display ? ` (${propiedad.precio_display})` : ""}. ¿Podemos hablar?`
  );

  // Características disponibles
  const caracteristicas = [
    propiedad.superficie_m2 && {
      icon: <FaRulerCombined />,
      label: "Superficie",
      valor: `${propiedad.superficie_m2} m²`,
    },
    propiedad.superficie_ha && {
      icon: <FaRulerCombined />,
      label: "Superficie",
      valor: `${propiedad.superficie_ha} ha`,
    },
    propiedad.dormitorios && {
      icon: <FaBed />,
      label: "Dormitorios",
      valor: propiedad.dormitorios,
    },
    propiedad.ambientes && !propiedad.dormitorios && {
      icon: <FaDoorOpen />,
      label: "Ambientes",
      valor: propiedad.ambientes,
    },
    propiedad.banos && {
      icon: <FaBath />,
      label: "Baños",
      valor: propiedad.banos,
    },
    propiedad.garage && {
      icon: <FaCar />,
      label: "Garage",
      valor: "Incluido",
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; valor: string | number }[];

  // Schema.org para esta propiedad
  const schemaPropiedad = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: propiedad.titulo,
    description: propiedad.descripcion,
    url: `${SITE_URL}/propiedades/${slug}`,
    ...(propiedad.imagenes?.[0] && { image: propiedad.imagenes[0] }),
    address: {
      "@type": "PostalAddress",
      streetAddress: propiedad.ubicacion,
      addressLocality: propiedad.localidad,
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    },
    ...(propiedad.precio_valor && {
      offers: {
        "@type": "Offer",
        price: propiedad.precio_valor,
        priceCurrency: propiedad.moneda,
        availability:
          propiedad.estado === "publicada"
            ? "https://schema.org/InStock"
            : "https://schema.org/LimitedAvailability",
      },
    }),
  };

  const colorOperacion =
    propiedad.operacion === "Venta"
      ? "bg-orange-500 text-white"
      : "bg-blue-500 text-white";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaPropiedad) }}
      />
      <main className="bg-[#0B1F3A] text-white pt-24 pb-16 px-6 min-h-screen">
        <div className="max-w-5xl mx-auto">

          {/* BREADCRUMB */}
          <nav aria-label="Breadcrumb" className="text-sm text-white/50 mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-white transition">Inicio</Link>
            <span aria-hidden="true">/</span>
            <Link href="/propiedades" className="hover:text-white transition">Propiedades</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/80 truncate max-w-[200px]">{propiedad.titulo}</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">

            {/* COLUMNA IZQUIERDA */}
            <div className="min-w-0">

              {/* GALERÍA */}
              <Galeria imagenes={propiedad.imagenes} titulo={propiedad.titulo} />

              {/* INFO */}
              <div className="mt-8">
                <div className="flex flex-wrap gap-2 items-center mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${colorOperacion}`}>
                    {propiedad.operacion}
                  </span>
                  <span className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full">
                    {propiedad.tipo}
                  </span>
                  {propiedad.estado === "reservada" && (
                    <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs px-3 py-1 rounded-full">
                      Reservada
                    </span>
                  )}
                  <span className="text-white/50 text-sm flex items-center gap-1.5">
                    <FaMapMarkerAlt size={11} className="text-orange-400/70" />
                    {propiedad.ubicacion}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold leading-tight">{propiedad.titulo}</h1>
                <p className="text-orange-400 text-3xl font-bold mt-4">{propiedad.precio_display}</p>

                {/* CARACTERÍSTICAS */}
                {caracteristicas.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {caracteristicas.map((c) => (
                      <div
                        key={c.label}
                        className="bg-[#102A4C] rounded-xl p-4 border border-white/10 flex flex-col items-center gap-2 text-center"
                      >
                        <span className="text-orange-400 text-lg">{c.icon}</span>
                        <span className="text-white font-bold">{c.valor}</span>
                        <span className="text-white/50 text-xs">{c.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* DESCRIPCIÓN */}
                <div className="mt-6 bg-[#102A4C] rounded-2xl p-6 border border-white/10">
                  <h2 className="text-lg font-semibold mb-4">Descripción</h2>
                  <div className="text-white/75 leading-relaxed whitespace-pre-line text-sm">
                    {propiedad.descripcion}
                  </div>
                </div>

                {/* CONTACTO MOBILE — visible solo en mobile, debajo de la descripción */}
                <div className="lg:hidden mt-6">
                  <PanelContacto
                    mensajeWhatsapp={mensajeWhatsapp}
                    titulo={propiedad.titulo}
                    ubicacion={propiedad.ubicacion}
                    precioDisplay={propiedad.precio_display}
                    slug={slug}
                  />
                </div>
              </div>

              {/* PROPIEDADES RELACIONADAS */}
              {relacionadas.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-xl font-bold mb-6">
                    Otras propiedades en {propiedad.operacion.toLowerCase()}
                  </h2>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {relacionadas.map((rel) => (
                      <PropiedadCard key={rel.id} propiedad={rel} />
                    ))}
                  </div>
                </div>
              )}

              {/* VOLVER */}
              <div className="mt-10">
                <Link
                  href="/propiedades"
                  className="inline-flex items-center gap-2 text-white/50 hover:text-white transition text-sm"
                >
                  <FaArrowLeft size={12} />
                  Volver a todas las propiedades
                </Link>
              </div>
            </div>

            {/* COLUMNA DERECHA — sticky en desktop */}
            <div className="hidden lg:block">
              <div className="sticky top-28">
                <PanelContacto
                  mensajeWhatsapp={mensajeWhatsapp}
                  titulo={propiedad.titulo}
                  ubicacion={propiedad.ubicacion}
                  precioDisplay={propiedad.precio_display}
                  slug={slug}
                />
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}

// Panel de contacto reutilizable (mobile y desktop)
function PanelContacto({
  mensajeWhatsapp,
  titulo,
  ubicacion,
  precioDisplay,
  slug,
}: {
  mensajeWhatsapp: string;
  titulo: string;
  ubicacion: string;
  precioDisplay: string;
  slug: string;
}) {
  const url = `${SITE_URL}/propiedades/${slug}`;

  return (
    <div className="bg-[#102A4C] rounded-2xl p-6 border border-white/10">
      <h2 className="text-lg font-bold mb-1">¿Te interesa?</h2>
      <p className="text-white/50 text-xs mb-5">
        Contactate con {NOMBRE_AGENTE} directamente o dejá tu consulta.
      </p>

      <div className="flex flex-col gap-3 mb-5">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-xl font-semibold transition text-sm"
        >
          <FaWhatsapp size={17} />
          Consultar por WhatsApp
        </a>
        <a
          href={PHONE_HREF}
          className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3 rounded-xl font-semibold transition text-sm"
        >
          <FaPhone size={14} />
          {PHONE_NUMBER}
        </a>
        <ShareButton titulo={titulo} url={url} />
      </div>

      <div className="h-px bg-white/10 mb-5" />

      <PropiedadContactForm
        titulo={titulo}
        ubicacion={ubicacion}
        precioDisplay={precioDisplay}
      />

      <p className="text-white/30 text-xs mt-4 text-center">{HORARIO}</p>
    </div>
  );
}
