"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { OPERACIONES, TIPOS_PROPIEDAD } from "../../types/propiedad";

interface Props {
  localidades: string[];
  total: number;
}

export default function FiltrosPropiedades({ localidades, total }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const operacion = searchParams.get("operacion") ?? "";
  const tipo = searchParams.get("tipo") ?? "";
  const localidad = searchParams.get("localidad") ?? "";
  const precioMin = searchParams.get("precioMin") ?? "";
  const precioMax = searchParams.get("precioMax") ?? "";
  const orden = searchParams.get("orden") ?? "";
  const busqueda = searchParams.get("q") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      startTransition(() => {
        router.push(`/propiedades?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  const limpiar = () => {
    startTransition(() => {
      router.push("/propiedades", { scroll: false });
    });
  };

  const hayFiltros = operacion || tipo || localidad || precioMin || precioMax || orden || busqueda;

  return (
    <div className={`transition-opacity duration-200 ${isPending ? "opacity-60" : "opacity-100"}`}>

      {/* BÚSQUEDA */}
      <input
        type="search"
        placeholder="Buscar por título o ubicación..."
        defaultValue={busqueda}
        onChange={(e) => updateParams({ q: e.target.value })}
        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/40 text-sm"
        aria-label="Buscar propiedades"
      />

      {/* FILTROS FILA 1: OPERACIÓN + TIPO */}
      <div className="flex flex-wrap gap-2 mt-3">
        {/* Operación */}
        <button
          onClick={() => updateParams({ operacion: "" })}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            !operacion ? "bg-orange-500 text-white" : "bg-white/10 hover:bg-white/20 text-white/80"
          }`}
        >
          Todos
        </button>
        {OPERACIONES.map((op) => (
          <button
            key={op}
            onClick={() => updateParams({ operacion: operacion === op ? "" : op })}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              operacion === op ? "bg-orange-500 text-white" : "bg-white/10 hover:bg-white/20 text-white/80"
            }`}
          >
            {op}
          </button>
        ))}
      </div>

      {/* FILTROS FILA 2: TIPO + LOCALIDAD + PRECIO + ORDEN */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-3">

        {/* Tipo */}
        <select
          value={tipo}
          onChange={(e) => updateParams({ tipo: e.target.value })}
          className="px-3 py-2.5 rounded-xl bg-[#102A4C] border border-white/20 text-white text-sm outline-none focus:border-orange-500 transition min-w-[140px]"
          aria-label="Tipo de propiedad"
        >
          <option value="">Tipo de propiedad</option>
          {TIPOS_PROPIEDAD.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Localidad */}
        {localidades.length > 0 && (
          <select
            value={localidad}
            onChange={(e) => updateParams({ localidad: e.target.value })}
            className="px-3 py-2.5 rounded-xl bg-[#102A4C] border border-white/20 text-white text-sm outline-none focus:border-orange-500 transition min-w-[160px]"
            aria-label="Localidad"
          >
            <option value="">Todas las localidades</option>
            {localidades.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        )}

        {/* Precio mín */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xs">USD</span>
            <input
              type="number"
              placeholder="Precio mín"
              value={precioMin}
              onChange={(e) => updateParams({ precioMin: e.target.value })}
              className="pl-10 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition text-sm w-36 placeholder:text-white/30"
              aria-label="Precio mínimo"
              min={0}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xs">USD</span>
            <input
              type="number"
              placeholder="Precio máx"
              value={precioMax}
              onChange={(e) => updateParams({ precioMax: e.target.value })}
              className="pl-10 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition text-sm w-36 placeholder:text-white/30"
              aria-label="Precio máximo"
              min={0}
            />
          </div>
        </div>

        {/* Orden */}
        <select
          value={orden}
          onChange={(e) => updateParams({ orden: e.target.value })}
          className="px-3 py-2.5 rounded-xl bg-[#102A4C] border border-white/20 text-white text-sm outline-none focus:border-orange-500 transition min-w-[150px]"
          aria-label="Ordenar por"
        >
          <option value="">Más recientes</option>
          <option value="precio_asc">Menor precio</option>
          <option value="precio_desc">Mayor precio</option>
        </select>

        {/* Limpiar */}
        {hayFiltros && (
          <button
            onClick={limpiar}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm text-white/70 hover:text-white transition"
          >
            Limpiar filtros ×
          </button>
        )}
      </div>

      {/* CONTADOR */}
      <p className="text-white/40 text-xs mt-3">
        {isPending ? "Buscando..." : `${total} propiedad${total !== 1 ? "es" : ""} encontrada${total !== 1 ? "s" : ""}`}
      </p>
    </div>
  );
}
