import { FaWhatsapp, FaPhone, FaHome, FaHandshake, FaChartLine, FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "../lib/supabase";

type Propiedad = {
  id: number;
  titulo: string;
  tipo: string;
  precio: string;
  ubicacion: string;
  imagenes: string[];
};

export const revalidate = 0;

export default async function Home() {
  const supabase = createClient();

  const { data: destacadas } = await supabase
    .from("propiedades")
    .select("id, titulo, tipo, precio, ubicacion, imagenes")
    .order("created_at", { ascending: false })
    .limit(3);

  const propiedades: Propiedad[] = destacadas || [];

  return (
    <>
      <main className="bg-[#0B1F3A] text-white pt-24">

        {/* HERO */}
        <section className="relative h-screen flex items-center justify-center text-center">
          <Image src="/hero.jpg" alt="Propiedades" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-[#0B1F3A]/75"></div>

          <div className="relative z-10 px-6 max-w-4xl w-full">
            <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-6 mb-8">
              <div className="flex flex-col gap-2 text-left">
                <span className="text-2xl md:text-4xl font-bold text-white/80 tracking-widest uppercase">Tu Casa</span>
                <span className="text-2xl md:text-4xl font-bold text-white/80 tracking-widest uppercase">Tu Terreno</span>
                <span className="text-2xl md:text-4xl font-bold text-white/80 tracking-widest uppercase">Tu Campo</span>
              </div>
              <div className="hidden md:block w-px h-32 bg-orange-500/60 mx-4" />
              <div className="block md:hidden h-px w-32 bg-orange-500/60 my-4" />
              <div>
                <span className="text-8xl md:text-[10rem] font-black text-orange-500 leading-none tracking-tight">HOY</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {["Compra y Venta", "Casas", "Campos", "Terrenos"].map((item) => (
                <span key={item} className="bg-white/10 border border-white/20 backdrop-blur px-5 py-2 rounded-full text-sm font-semibold tracking-wide text-white/90 uppercase">
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/5492210000000"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-full text-lg font-semibold transition"
              >
                <FaWhatsapp />
                Contactar por WhatsApp
              </a>
              <Link
                href="/propiedades"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-3 rounded-full text-lg font-semibold transition"
              >
                Ver propiedades
              </Link>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
              <div className="w-1 h-2 bg-white/60 rounded-full" />
            </div>
          </div>
        </section>

        {/* SERVICIOS */}
        <section id="servicios" className="px-6 py-20 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center">¿En qué te ayudamos?</h2>
          <p className="text-white/50 text-center mb-12">Servicios pensados para cada etapa de tu proceso inmobiliario</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <FaHome size={28} />, titulo: "Compra y venta", descripcion: "Te asesoramos en todo el proceso de compra o venta de tu propiedad, con total transparencia y acompañamiento personalizado." },
              { icon: <FaHandshake size={28} />, titulo: "Alquileres", descripcion: "Gestionamos alquileres para propietarios e inquilinos, asegurándonos de que todo el proceso sea simple y seguro." },
              { icon: <FaChartLine size={28} />, titulo: "Inversiones", descripcion: "Identificamos las mejores oportunidades del mercado para que tu capital crezca con seguridad y rentabilidad." },
            ].map((servicio) => (
              <div key={servicio.titulo} className="bg-[#102A4C] rounded-2xl p-6 border border-white/10 hover:border-orange-500/40 transition group">
                <div className="text-orange-400 mb-4 group-hover:scale-110 transition">{servicio.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{servicio.titulo}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{servicio.descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PROPIEDADES DESTACADAS */}
        <section className="px-6 py-16 bg-[#102A4C] border-y border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold">Propiedades destacadas</h2>
                <p className="text-white/50 mt-1">Las mejores oportunidades del momento</p>
              </div>
              <Link href="/propiedades" className="hidden sm:inline-block text-orange-400 hover:text-orange-300 text-sm font-semibold transition">Ver todas →</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {propiedades.map((prop) => (
                <div key={prop.id} className="bg-[#0B1F3A] rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition border border-white/10 flex flex-col group">
                  <div className="relative w-full h-56 overflow-hidden">
                    <Image src={prop.imagenes[0]} alt={prop.titulo} fill className="object-cover group-hover:scale-105 transition duration-500" />
                    <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full">{prop.tipo}</span>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div>
                      <h3 className="text-lg font-semibold leading-tight min-h-[48px]">{prop.titulo}</h3>
                      <p className="text-white/50 text-sm mt-1 flex items-center gap-1"><FaMapMarkerAlt size={10} />{prop.ubicacion}</p>
                    </div>
                    <div className="mt-auto">
                      <p className="text-orange-400 font-bold text-xl mt-3">{prop.precio}</p>
                      <Link href={`/propiedades/${prop.id}`} className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-semibold transition w-full text-center">Ver propiedad</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/propiedades" className="inline-block bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-3 rounded-full font-semibold transition">Ver todas las propiedades</Link>
            </div>
          </div>
        </section>

        {/* SOBRE MATÍAS */}
        <section className="bg-[#0B1F3A] text-white py-20 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center">
              <div className="relative">
               
                <img src="/Matias.jpeg" alt="Matías Márquez" className="relative w-80 h-80 object-cover rounded-2xl shadow-xl" />
              </div>
            </div>
            <div>
              <span className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-3 block">Quién soy</span>
              <h2 className="text-3xl font-bold mb-1">Matías Márquez</h2>
              <p className="text-white/50 text-sm mb-4 font-medium tracking-wide">Agente Inmobiliario · Fundador de MarQuez</p>
              <p className="text-white/80 leading-relaxed mb-4">
                Soy Matías Márquez, agente inmobiliario y fundador de MarQuez Negocios Inmobiliarios.
                Me especializo en la compra, venta y asesoramiento de propiedades, acompañando a cada cliente en todo el proceso con un enfoque personalizado y transparente.
              </p>
              <p className="text-white/80 leading-relaxed mb-8">
                Mi objetivo es ayudarte a tomar la mejor decisión, ya sea para invertir, vender o encontrar tu próximo hogar.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {["Compra y venta", "Alquileres", "Inversiones", "Asesoramiento", "Tasaciones"].map((tag) => (
                  <span key={tag} className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-sm text-white/70">{tag}</span>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" className="bg-[#102A4C] text-white py-20 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <div>
              <span className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-3 block">Contacto</span>
              <h2 className="text-3xl font-bold mb-2">¿Tenés alguna consulta?</h2>
              <p className="text-white/50 mb-8">Dejanos tus datos y te respondemos a la brevedad.</p>
              <form className="grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Nombre" className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/40" />
                  <input type="tel" placeholder="Teléfono" className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/40" />
                </div>
                <input type="email" placeholder="Email (opcional)" className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/40" />
                <textarea placeholder="¿En qué te podemos ayudar?" rows={4} className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/40 resize-none" />
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold transition">Enviar consulta</button>
              </form>
            </div>
            <div className="flex flex-col justify-center gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Contacto directo</h3>
                <p className="text-white/60 text-sm">Podés comunicarte directamente con Matías para asesoramiento personalizado.</p>
              </div>
              <div className="flex flex-col gap-4">
                <a href="https://wa.me/5492210000000" target="_blank" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3 rounded-xl transition w-fit">
                  <FaWhatsapp className="text-orange-400" size={20} />
                  <div>
                    <p className="text-sm font-semibold">WhatsApp</p>
                    <p className="text-white/50 text-xs">Respuesta inmediata</p>
                  </div>
                </a>
                <a href="tel:+5492210000000" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3 rounded-xl transition w-fit">
                  <FaPhone className="text-orange-400" size={18} />
                  <div>
                    <p className="text-sm font-semibold">+54 9 221 000 0000</p>
                    <p className="text-white/50 text-xs">Lun a Sáb de 9 a 18hs</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 px-5 py-3">
                  <span className="text-orange-400">📍</span>
                  <div>
                    <p className="text-sm font-semibold">Buenos Aires, Argentina</p>
                    <p className="text-white/50 text-xs">Zona sur y alrededores</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#081629] text-white px-6 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            {/* Logo igual al navbar */}
            <div className="text-xl font-bold tracking-wide flex items-center gap-2 mb-4">
              <span className="text-orange-500 text-2xl">⌂</span>
              <span>
                MarQuez
                <span className="block text-xs tracking-widest text-gray-400">
                  NEGOCIOS INMOBILIARIOS
                </span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Negocios inmobiliarios enfocados en brindar asesoramiento personalizado,
              acompañando a cada cliente en todo el proceso de compra, venta o inversión.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li><Link href="/" className="hover:text-orange-400 transition">Inicio</Link></li>
              <li><Link href="/propiedades" className="hover:text-orange-400 transition">Propiedades</Link></li>
              <li><Link href="/#servicios" className="hover:text-orange-400 transition">Servicios</Link></li>
              <li><Link href="/#contacto" className="hover:text-orange-400 transition">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li><a href="tel:+5492210000000" className="hover:text-orange-400 transition">📞 +54 9 221 000 0000</a></li>
              <li>📍 Buenos Aires, Argentina</li>
              <li>
                <a href="https://wa.me/5492210000000" target="_blank" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition">
                  <FaWhatsapp />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-white/40 text-sm">
          © {new Date().getFullYear()} MarQuez Negocios Inmobiliarios. Todos los derechos reservados.
        </div>
      </footer>
    </>
  );
}
