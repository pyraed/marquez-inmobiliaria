"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "../../lib/supabase";
import { FaMapMarkerAlt } from "react-icons/fa";

type Propiedad = {
  id: number;
  titulo: string;
  tipo: string;
  precio: string;
  ubicacion: string;
  descripcion: string;
  imagenes: string[];
};

export default function PropiedadesPage() {
  const supabase = createClient();

  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [orden, setOrden] = useState("default");

  useEffect(() => {
    const cargar = async () => {
      const { data, error } = await supabase
        .from("propiedades")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setPropiedades(data);
      setCargando(false);
    };
    cargar();
  }, []);

  const parsePrecio = (precio: string) => {
    return Number(precio.replace(/[^\d]/g, ""));
  };

  let propiedadesFiltradas = propiedades.filter((prop) => {
    const coincideTipo = filtro === "Todos" || prop.tipo === filtro;
    const coincideBusqueda =
      prop.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      prop.ubicacion.toLowerCase().includes(busqueda.toLowerCase());
    const precioNumero = parsePrecio(prop.precio);
    const cumpleMin = precioMin ? precioNumero >= Number(precioMin) : true;
    const cumpleMax = precioMax ? precioNumero <= Number(precioMax) : true;
    return coincideTipo && coincideBusqueda && cumpleMin && cumpleMax;
  });

  if (orden === "asc") {
    propiedadesFiltradas.sort((a, b) => parsePrecio(a.precio) - parsePrecio(b.precio));
  } else if (orden === "desc") {
    propiedadesFiltradas.sort((a, b) => parsePrecio(b.precio) - parsePrecio(a.precio));
  }

  return (
    <main className="bg-[#0B1F3A] text-white pt-24 min-h-screen px-6">

      <h1 className="text-4xl font-bold mb-10 text-center">
        Todas las propiedades
      </h1>

      {/* FILTROS */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col gap-4">

        <input
          type="text"
          placeholder="Buscar por ubicación o título..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/40"
        />

        <div className="flex flex-col md:flex-row gap-4">

          <div className="flex gap-2">
            {["Todos", "Venta", "Alquiler"].map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltro(tipo)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  filtro === tipo ? "bg-orange-500" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {tipo}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Precio mín"
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
              className="w-32 px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition"
            />
            <input
              type="number"
              placeholder="Precio máx"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              className="w-32 px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition"
            />
          </div>

          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white outline-none focus:border-orange-500 transition"
          >
            <option value="default" style={{ color: "black", background: "white" }}>Ordenar</option>
            <option value="asc" style={{ color: "black", background: "white" }}>Menor precio</option>
            <option value="desc" style={{ color: "black", background: "white" }}>Mayor precio</option>
          </select>

          <button
            onClick={() => {
              setFiltro("Todos");
              setBusqueda("");
              setPrecioMin("");
              setPrecioMax("");
              setOrden("default");
            }}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-sm transition"
          >
            Limpiar
          </button>

        </div>
      </div>

      {/* GRID */}
      {cargando ? (
        <div className="text-center py-20 text-white/50">Cargando propiedades...</div>
      ) : (
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {propiedadesFiltradas.map((prop) => (
            <div
              key={prop.id}
              className="bg-[#102A4C] rounded-2xl overflow-hidden shadow-lg transition border border-white/10 flex flex-col group hover:scale-[1.02]"
            >
              <div className="relative w-full h-56 overflow-hidden">
                <Image
                  src={prop.imagenes[0]}
                  alt={prop.titulo}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                  {prop.tipo}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <div>
                  <h3 className="text-lg font-semibold min-h-[48px]">{prop.titulo}</h3>
                  <p className="text-white/50 text-sm mt-1 flex items-center gap-1">
                    <FaMapMarkerAlt size={10} />
                    {prop.ubicacion}
                  </p>
                </div>
                <div className="mt-auto">
                  <p className="text-orange-400 font-bold text-xl mt-3">{prop.precio}</p>
                  <Link
                    href={`/propiedades/${prop.id}`}
                    className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-semibold transition w-full text-center"
                  >
                    Ver propiedad
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!cargando && propiedadesFiltradas.length === 0 && (
        <p className="text-center text-white/60 mt-10">
          No se encontraron propiedades con esos filtros
        </p>
      )}

    </main>
  );
}
