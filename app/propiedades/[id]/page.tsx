import { createClient } from "../../../lib/supabase";
import PropiedadClient from "../../../components/PropiedadClient";
import PropiedadContactForm from "../../../components/PropiedadContactForm";
import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaRulerCombined, FaDoorOpen, FaBath, FaCar } from "react-icons/fa";
import Link from "next/link";

export default async function PropiedadDetalle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient();

  const { data: propiedad } = await supabase
    .from("propiedades")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (!propiedad) {
    return (
      <main className="bg-[#0B1F3A] text-white min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">Propiedad no encontrada</p>
          <Link href="/propiedades" className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg transition">
            Ver todas las propiedades
          </Link>
        </div>
      </main>
    );
  }

  const { data: relacionadas } = await supabase
    .from("propiedades")
    .select("id, titulo, tipo, precio, ubicacion, imagenes")
    .eq("tipo", propiedad.tipo)
    .neq("id", propiedad.id)
    .limit(3);

  const mensajeWhatsapp = encodeURIComponent(
    `Hola Matías, me interesa la propiedad "${propiedad.titulo}" ubicada en ${propiedad.ubicacion} (${propiedad.precio}). ¿Podemos hablar?`
  );

  // Características que existen
  const caracteristicas = [
    propiedad.superficie && { icon: <FaRulerCombined />, label: "Superficie", valor: `${propiedad.superficie} m²` },
    propiedad.ambientes && { icon: <FaDoorOpen />, label: "Ambientes", valor: propiedad.ambientes },
    propiedad.banos && { icon: <FaBath />, label: "Baños", valor: propiedad.banos },
    propiedad.garage && { icon: <FaCar />, label: "Garage", valor: "Sí" },
  ].filter(Boolean);

  return (
    <main className="bg-[#0B1F3A] text-white pt-24 px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">

        {/* BREADCRUMB */}
        <nav className="text-sm text-white/50 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-white transition">Inicio</Link>
          <span>/</span>
          <Link href="/propiedades" className="hover:text-white transition">Propiedades</Link>
          <span>/</span>
          <span className="text-white/80">{propiedad.titulo}</span>
        </nav>

        {/* GALERÍA */}
        <PropiedadClient imagenes={propiedad.imagenes} />

        {/* INFO */}
        <div className="mt-8">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="bg-orange-500 px-3 py-1 rounded-full text-sm font-semibold">
              {propiedad.tipo}
            </span>
            <span className="text-white/40 text-sm flex items-center gap-1">
              <FaMapMarkerAlt size={12} />
              {propiedad.ubicacion}
            </span>
          </div>

          <h1 className="text-3xl font-bold mt-4">{propiedad.titulo}</h1>
          <p className="text-orange-400 text-3xl font-bold mt-4">{propiedad.precio}</p>

          {/* CARACTERÍSTICAS */}
          {caracteristicas.length > 0 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {caracteristicas.map((c: any) => (
                <div key={c.label} className="bg-[#102A4C] rounded-xl p-4 border border-white/10 flex flex-col items-center gap-2 text-center">
                  <span className="text-orange-400 text-xl">{c.icon}</span>
                  <span className="text-white font-bold text-lg">{c.valor}</span>
                  <span className="text-white/50 text-xs">{c.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Descripción */}
          <div className="mt-6 bg-[#102A4C] rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-3">Descripción</h2>
            <div className="text-white/80 leading-relaxed whitespace-pre-line">
              {propiedad.descripcion}
            </div>
          </div>
        </div>

        {/* PANEL DE CONTACTO */}
        <div className="mt-8 mb-6 bg-[#102A4C] rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-1">¿Te interesa esta propiedad?</h2>
          <p className="text-white/50 mb-8 text-sm">
            Contactate con Matías directamente o dejá tus datos y te respondemos a la brevedad.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a
              href={`https://wa.me/5492983340336?text=${mensajeWhatsapp}`}
              target="_blank"
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold transition"
            >
              <FaWhatsapp size={20} />
              Consultar por WhatsApp
            </a>
            <a
              href="tel:+5492983340336"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl font-semibold transition"
            >
              <FaPhone size={16} />
              Llamar ahora
            </a>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/40 text-sm">o dejá tu consulta</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <PropiedadContactForm titulo={propiedad.titulo} ubicacion={propiedad.ubicacion} />
        </div>

        {/* PROPIEDADES RELACIONADAS */}
        {relacionadas && relacionadas.length > 0 && (
          <div className="mt-12 mb-16">
            <h2 className="text-2xl font-bold mb-6">
              Otras propiedades en {propiedad.tipo.toLowerCase()}
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relacionadas.map((rel: any) => (
                <Link
                  key={rel.id}
                  href={`/propiedades/${rel.id}`}
                  className="bg-[#102A4C] rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 hover:scale-[1.02] transition group"
                >
                  <div className="relative w-full h-44">
                    <img src={rel.imagenes[0]} alt={rel.titulo} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                      {rel.tipo}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-orange-400 transition">{rel.titulo}</h3>
                    <p className="text-white/50 text-sm mt-1 flex items-center gap-1">
                      <FaMapMarkerAlt size={10} />
                      {rel.ubicacion}
                    </p>
                    <p className="text-orange-400 font-bold mt-2">{rel.precio}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* VOLVER */}
        <div className="pb-16">
          <Link
            href="/propiedades"
            className="text-white/50 hover:text-white transition text-sm flex items-center gap-2"
          >
            ← Volver a todas las propiedades
          </Link>
        </div>

      </div>
    </main>
  );
}
