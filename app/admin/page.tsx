"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "../../lib/supabase-browser";
import {
  FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaTimes,
  FaSave, FaUpload, FaImage, FaChevronDown, FaChevronUp,
} from "react-icons/fa";
import {
  Propiedad, PropiedadForm,
  OPERACIONES, TIPOS_PROPIEDAD, ESTADOS_PROPIEDAD, MONEDAS,
} from "../../types/propiedad";
import { buildSlug, formatPrecio, parseNumericField } from "../../utils/propiedades";

const FORM_VACIO: PropiedadForm = {
  titulo: "",
  operacion: "Venta",
  tipo: "Casa",
  precio_valor: "",
  moneda: "USD",
  precio_display: "",
  ubicacion: "",
  localidad: "",
  descripcion: "",
  imagenes: [],
  superficie_m2: "",
  superficie_ha: "",
  ambientes: "",
  dormitorios: "",
  banos: "",
  garage: false,
  financiacion: false,
  frente: "",
  fondo: "",
  unidades: "",
  destacada: false,
  estado: "publicada",
  seo_titulo: "",
  seo_descripcion: "",
};

const MAX_FOTO_MB = 10;

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();

  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Propiedad | null>(null);
  const [form, setForm] = useState<PropiedadForm>(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "ok" | "error" } | null>(null);
  const [subiendoFotos, setSubiendoFotos] = useState(false);
  const [fotosPreview, setFotosPreview] = useState<string[]>([]);
  const [seoAbierto, setSeoAbierto] = useState(false);

  const cargarPropiedades = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("propiedades")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setPropiedades(data as Propiedad[]);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void cargarPropiedades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mostrarMensaje = (texto: string, tipo: "ok" | "error") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 3000);
  };

  const abrirNueva = () => {
    setEditando(null);
    setForm(FORM_VACIO);
    setFotosPreview([]);
    setSeoAbierto(false);
    setModalAbierto(true);
  };

  const abrirEditar = (prop: Propiedad) => {
    setEditando(prop);
    setForm({
      titulo: prop.titulo,
      operacion: prop.operacion,
      tipo: prop.tipo,
      precio_valor: prop.precio_valor?.toString() ?? "",
      moneda: prop.moneda,
      precio_display: prop.precio_display,
      ubicacion: prop.ubicacion,
      localidad: prop.localidad,
      descripcion: prop.descripcion,
      imagenes: prop.imagenes,
      superficie_m2: prop.superficie_m2?.toString() ?? "",
      superficie_ha: prop.superficie_ha?.toString() ?? "",
      ambientes: prop.ambientes?.toString() ?? "",
      dormitorios: prop.dormitorios?.toString() ?? "",
      banos: prop.banos?.toString() ?? "",
      garage: prop.garage,
      financiacion: prop.financiacion,
      frente: prop.frente?.toString() ?? "",
      fondo: prop.fondo?.toString() ?? "",
      unidades: prop.unidades?.toString() ?? "",
      destacada: prop.destacada,
      estado: prop.estado,
      seo_titulo: prop.seo_titulo ?? "",
      seo_descripcion: prop.seo_descripcion ?? "",
    });
    setFotosPreview(prop.imagenes || []);
    setSeoAbierto(false);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditando(null);
    setForm(FORM_VACIO);
    setFotosPreview([]);
    setSeoAbierto(false);
  };

  // Autogenera precio_display cuando cambia precio_valor o moneda
  const handlePrecioValor = (valor: string) => {
    const num = parseNumericField(valor);
    const display = num ? formatPrecio(num, form.moneda) : "";
    setForm((prev) => ({ ...prev, precio_valor: valor, precio_display: display }));
  };

  const handleMoneda = (moneda: "USD" | "ARS") => {
    const num = parseNumericField(form.precio_valor);
    const display = num ? formatPrecio(num, moneda) : form.precio_display;
    setForm((prev) => ({ ...prev, moneda, precio_display: display }));
  };

  const subirFotos = async (archivos: FileList) => {
    setSubiendoFotos(true);
    const urlsNuevas: string[] = [];

    for (const archivo of Array.from(archivos)) {
      // Validar tamaño máximo
      if (archivo.size > MAX_FOTO_MB * 1024 * 1024) {
        mostrarMensaje(`"${archivo.name}" supera los ${MAX_FOTO_MB}MB. No se subió.`, "error");
        continue;
      }

      const extension = archivo.name.split(".").pop();
      const nombre = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

      const { error } = await supabase.storage
        .from("propiedades")
        .upload(nombre, archivo, { cacheControl: "3600", upsert: false });

      if (!error) {
        const { data: urlData } = supabase.storage
          .from("propiedades")
          .getPublicUrl(nombre);
        urlsNuevas.push(urlData.publicUrl);
      }
    }

    const todasLasFotos = [...fotosPreview, ...urlsNuevas];
    setFotosPreview(todasLasFotos);
    setForm((prev) => ({ ...prev, imagenes: todasLasFotos }));
    setSubiendoFotos(false);

    if (urlsNuevas.length > 0) {
      mostrarMensaje(`${urlsNuevas.length} foto(s) subida(s) correctamente.`, "ok");
    }
  };

  const eliminarFoto = (index: number) => {
    const nuevasFotos = fotosPreview.filter((_, i) => i !== index);
    setFotosPreview(nuevasFotos);
    setForm((prev) => ({ ...prev, imagenes: nuevasFotos }));
  };

  const guardar = async () => {
    // Validaciones
    if (!form.titulo.trim()) {
      mostrarMensaje("El título es obligatorio.", "error"); return;
    }
    if (!form.precio_display.trim()) {
      mostrarMensaje("El precio es obligatorio.", "error"); return;
    }
    if (!form.ubicacion.trim()) {
      mostrarMensaje("La ubicación es obligatoria.", "error"); return;
    }
    if (!form.localidad.trim()) {
      mostrarMensaje("La localidad es obligatoria.", "error"); return;
    }
    if (!form.descripcion.trim()) {
      mostrarMensaje("La descripción es obligatoria.", "error"); return;
    }

    setGuardando(true);

    const datos = {
      titulo: form.titulo.trim(),
      operacion: form.operacion,
      tipo: form.tipo,
      precio_valor: parseNumericField(form.precio_valor),
      moneda: form.moneda,
      precio_display: form.precio_display.trim(),
      ubicacion: form.ubicacion.trim(),
      localidad: form.localidad.trim(),
      descripcion: form.descripcion.trim(),
      imagenes: fotosPreview,
      superficie_m2: parseNumericField(form.superficie_m2),
      superficie_ha: parseNumericField(form.superficie_ha),
      ambientes: parseNumericField(form.ambientes),
      dormitorios: parseNumericField(form.dormitorios),
      banos: parseNumericField(form.banos),
      garage: form.garage,
      financiacion: form.financiacion,
      frente: parseNumericField(form.frente),
      fondo: parseNumericField(form.fondo),
      unidades: parseNumericField(form.unidades),
      destacada: form.destacada,
      estado: form.estado,
      seo_titulo: form.seo_titulo.trim() || null,
      seo_descripcion: form.seo_descripcion.trim() || null,
    };

    if (editando?.id) {
      // EDICIÓN — no regenerar slug
      const { error } = await supabase
        .from("propiedades")
        .update(datos)
        .eq("id", editando.id);

      if (error) {
        mostrarMensaje("Error al guardar los cambios.", "error");
      } else {
        mostrarMensaje("Propiedad actualizada correctamente.", "ok");
        cerrarModal();
        cargarPropiedades();
      }
    } else {
      // CREACIÓN — insertar primero para obtener el id, luego generar el slug
      const { data: nueva, error: errorInsert } = await supabase
        .from("propiedades")
        .insert(datos)
        .select("id")
        .single();

      if (errorInsert || !nueva) {
        mostrarMensaje("Error al crear la propiedad.", "error");
      } else {
        // Generar slug con el id real recién asignado
        const slug = buildSlug(datos.titulo, datos.localidad, nueva.id);
        const { error: errorSlug } = await supabase
          .from("propiedades")
          .update({ slug })
          .eq("id", nueva.id);

        if (errorSlug) {
          mostrarMensaje("Propiedad creada, pero hubo un error generando el slug.", "error");
        } else {
          mostrarMensaje("Propiedad creada correctamente.", "ok");
        }
        cerrarModal();
        cargarPropiedades();
      }
    }

    setGuardando(false);
  };

  const eliminar = async (id: number) => {
    setEliminandoId(id);
    const { error } = await supabase.from("propiedades").delete().eq("id", id);
    if (error) {
      mostrarMensaje("Error al eliminar la propiedad.", "error");
    } else {
      mostrarMensaje("Propiedad eliminada.", "ok");
      cargarPropiedades();
    }
    setEliminandoId(null);
    setConfirmarEliminar(null);
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const etiquetaEstado = (estado: string) => {
    const mapa: Record<string, string> = {
      publicada: "Publicada",
      pausada: "Pausada",
      reservada: "Reservada",
      vendida: "Vendida",
      alquilada: "Alquilada",
    };
    return mapa[estado] ?? estado;
  };

  const colorEstado = (estado: string) => {
    const mapa: Record<string, string> = {
      publicada: "bg-green-500/20 text-green-400 border-green-500/30",
      pausada: "bg-white/10 text-white/50 border-white/20",
      reservada: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      vendida: "bg-red-500/20 text-red-400 border-red-500/30",
      alquilada: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    };
    return mapa[estado] ?? "";
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white">

      {/* HEADER */}
      <header className="bg-[#102A4C] border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-marquez.png"
            alt="MarQuez Negocios Inmobiliarios"
            width={140}
            height={70}
            className="h-9 w-auto object-contain"
          />
        </div>
        <button
          onClick={cerrarSesion}
          className="flex items-center gap-2 text-white/60 hover:text-white transition text-sm"
        >
          <FaSignOutAlt />
          Cerrar sesión
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* TOAST */}
        {mensaje && (
          <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-lg ${
            mensaje.tipo === "ok" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}>
            {mensaje.texto}
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Propiedades</h2>
            <p className="text-white/50 text-sm mt-1">{propiedades.length} propiedades cargadas</p>
          </div>
          <button
            onClick={abrirNueva}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-5 py-2.5 rounded-xl font-semibold transition"
          >
            <FaPlus size={14} />
            Nueva propiedad
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/50">Cargando propiedades...</div>
        ) : propiedades.length === 0 ? (
          <div className="text-center py-20 text-white/50">
            <p className="text-lg mb-4">No hay propiedades cargadas</p>
            <button onClick={abrirNueva} className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl transition">
              Agregar la primera
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {propiedades.map((prop) => (
              <div
                key={prop.id}
                className="bg-[#102A4C] rounded-2xl border border-white/10 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <div className="flex gap-4 items-start">
                  {prop.imagenes?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={prop.imagenes[0]} alt={prop.titulo} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaImage className="text-white/30" size={20} />
                    </div>
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{prop.operacion}</span>
                      <span className="bg-white/10 text-white/70 text-xs px-2 py-0.5 rounded-full">{prop.tipo}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${colorEstado(prop.estado)}`}>
                        {etiquetaEstado(prop.estado)}
                      </span>
                      {prop.destacada && (
                        <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs px-2 py-0.5 rounded-full">
                          Destacada
                        </span>
                      )}
                      <span className="text-white/40 text-xs">{prop.imagenes?.length || 0} fotos</span>
                    </div>
                    <h3 className="font-semibold">{prop.titulo}</h3>
                    <p className="text-white/50 text-sm">{prop.localidad}</p>
                    <p className="text-orange-400 font-bold text-sm mt-0.5">{prop.precio_display}</p>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => abrirEditar(prop)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition"
                  >
                    <FaEdit size={12} />
                    Editar
                  </button>

                  {confirmarEliminar === prop.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => eliminar(prop.id)}
                        disabled={eliminandoId === prop.id}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition disabled:opacity-50"
                      >
                        {eliminandoId === prop.id ? "Eliminando..." : "Confirmar"}
                      </button>
                      <button
                        onClick={() => setConfirmarEliminar(null)}
                        className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmarEliminar(prop.id)}
                      className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 px-4 py-2 rounded-lg text-sm text-red-400 transition"
                    >
                      <FaTrash size={12} />
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center px-4 py-8 overflow-y-auto">
          <div className="bg-[#102A4C] rounded-2xl border border-white/10 w-full max-w-2xl shadow-2xl my-auto">

            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
              <h2 className="font-bold text-lg">
                {editando ? "Editar propiedad" : "Nueva propiedad"}
              </h2>
              <button onClick={cerrarModal} className="text-white/50 hover:text-white transition">
                <FaTimes size={18} />
              </button>
            </div>

            <div className="px-6 py-6 grid gap-5">

              {/* TÍTULO */}
              <div>
                <label className="text-sm text-white/60 mb-1 block">Título *</label>
                <input
                  type="text"
                  placeholder="Ej: Casa con pileta y quincho"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                />
              </div>

              {/* OPERACIÓN + TIPO */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Operación *</label>
                  <select
                    value={form.operacion}
                    onChange={(e) => setForm({ ...form, operacion: e.target.value as "Venta" | "Alquiler" })}
                    className="w-full px-4 py-3 rounded-lg bg-[#0B1F3A] border border-white/20 outline-none focus:border-orange-500 transition text-white"
                  >
                    {OPERACIONES.map((op) => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Tipo de propiedad *</label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value as PropiedadForm["tipo"] })}
                    className="w-full px-4 py-3 rounded-lg bg-[#0B1F3A] border border-white/20 outline-none focus:border-orange-500 transition text-white"
                  >
                    {TIPOS_PROPIEDAD.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PRECIO */}
              <div>
                <label className="text-sm text-white/60 mb-1 block">Precio</label>
                <div className="grid sm:grid-cols-3 gap-3">
                  <select
                    value={form.moneda}
                    onChange={(e) => handleMoneda(e.target.value as "USD" | "ARS")}
                    className="px-4 py-3 rounded-lg bg-[#0B1F3A] border border-white/20 outline-none focus:border-orange-500 transition text-white"
                  >
                    {MONEDAS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="80000"
                    value={form.precio_valor}
                    onChange={(e) => handlePrecioValor(e.target.value)}
                    className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                  <input
                    type="text"
                    placeholder="Ej: A convenir"
                    value={form.precio_display}
                    onChange={(e) => setForm({ ...form, precio_display: e.target.value })}
                    className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                </div>
                <p className="text-white/30 text-xs mt-1">
                  El texto de display se genera automáticamente. Podés editarlo si necesitás mostrar &quot;A convenir&quot; u otro valor especial.
                </p>
              </div>

              {/* UBICACIÓN + LOCALIDAD */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Ubicación visible *</label>
                  <input
                    type="text"
                    placeholder="Ej: Av. Principal 456, Gonzalez Chaves"
                    value={form.ubicacion}
                    onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Localidad *</label>
                  <input
                    type="text"
                    placeholder="Ej: Adolfo Gonzalez Chaves"
                    value={form.localidad}
                    onChange={(e) => setForm({ ...form, localidad: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* CARACTERÍSTICAS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Superficie m²</label>
                  <input
                    type="number"
                    placeholder="120"
                    value={form.superficie_m2}
                    onChange={(e) => setForm({ ...form, superficie_m2: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Superficie ha</label>
                  <input
                    type="number"
                    placeholder="1500"
                    value={form.superficie_ha}
                    onChange={(e) => setForm({ ...form, superficie_ha: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Ambientes</label>
                  <input
                    type="number"
                    placeholder="3"
                    value={form.ambientes}
                    onChange={(e) => setForm({ ...form, ambientes: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Dormitorios</label>
                  <input
                    type="number"
                    placeholder="2"
                    value={form.dormitorios}
                    onChange={(e) => setForm({ ...form, dormitorios: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Baños</label>
                  <input
                    type="number"
                    placeholder="2"
                    value={form.banos}
                    onChange={(e) => setForm({ ...form, banos: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Frente (m)</label>
                  <input
                    type="number"
                    placeholder="12.5"
                    value={form.frente}
                    onChange={(e) => setForm({ ...form, frente: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Fondo (m)</label>
                  <input
                    type="number"
                    placeholder="35"
                    value={form.fondo}
                    onChange={(e) => setForm({ ...form, fondo: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Unidades</label>
                  <input
                    type="number"
                    placeholder="1"
                    value={form.unidades}
                    onChange={(e) => setForm({ ...form, unidades: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Garage</label>
                  <div
                    onClick={() => setForm({ ...form, garage: !form.garage })}
                    className={`w-full px-4 py-3 rounded-lg border cursor-pointer transition flex items-center gap-2 ${
                      form.garage
                        ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
                        : "bg-white/10 border-white/20 text-white/40"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${form.garage ? "border-orange-400 bg-orange-400" : "border-white/30"}`}>
                      {form.garage && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-sm">{form.garage ? "Sí" : "No"}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Destacada</label>
                  <div
                    onClick={() => setForm({ ...form, destacada: !form.destacada })}
                    className={`w-full px-4 py-3 rounded-lg border cursor-pointer transition flex items-center gap-2 ${
                      form.destacada
                        ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
                        : "bg-white/10 border-white/20 text-white/40"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${form.destacada ? "border-orange-400 bg-orange-400" : "border-white/30"}`}>
                      {form.destacada && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-sm">{form.destacada ? "Sí" : "No"}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Financiación</label>
                  <div
                    onClick={() => setForm({ ...form, financiacion: !form.financiacion })}
                    className={`w-full px-4 py-3 rounded-lg border cursor-pointer transition flex items-center gap-2 ${
                      form.financiacion
                        ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
                        : "bg-white/10 border-white/20 text-white/40"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${form.financiacion ? "border-orange-400 bg-orange-400" : "border-white/30"}`}>
                      {form.financiacion && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-sm">{form.financiacion ? "Sí" : "No"}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Estado</label>
                  <select
                    value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value as PropiedadForm["estado"] })}
                    className="w-full px-4 py-3 rounded-lg bg-[#0B1F3A] border border-white/20 outline-none focus:border-orange-500 transition text-white"
                  >
                    {ESTADOS_PROPIEDAD.map((e) => (
                      <option key={e} value={e} style={{ textTransform: "capitalize" }}>
                        {e.charAt(0).toUpperCase() + e.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DESCRIPCIÓN */}
              <div>
                <label className="text-sm text-white/60 mb-1 block">Descripción *</label>
                <textarea
                  placeholder="Describí la propiedad en detalle..."
                  rows={5}
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30 resize-none"
                />
              </div>

              {/* FOTOS */}
              <div>
                <label className="text-sm text-white/60 mb-2 block">Fotos de la propiedad</label>
                <label className={`flex items-center justify-center gap-2 w-full px-4 py-4 rounded-lg border-2 border-dashed cursor-pointer transition ${
                  subiendoFotos
                    ? "border-orange-500/50 bg-orange-500/10 cursor-wait"
                    : "border-white/20 hover:border-orange-500/50 hover:bg-white/5"
                }`}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    disabled={subiendoFotos}
                    onChange={(e) => e.target.files && subirFotos(e.target.files)}
                  />
                  <FaUpload className={subiendoFotos ? "text-orange-400 animate-bounce" : "text-white/40"} size={16} />
                  <span className={`text-sm ${subiendoFotos ? "text-orange-400" : "text-white/40"}`}>
                    {subiendoFotos ? "Subiendo fotos..." : `Hacé click o arrastrá fotos acá (máx ${MAX_FOTO_MB}MB c/u)`}
                  </span>
                </label>

                {fotosPreview.length > 0 && (
                  <>
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {fotosPreview.map((url, i) => (
                        <div key={i} className="relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`foto-${i}`} className="w-full h-20 object-cover rounded-lg" />
                          <button
                            onClick={() => eliminarFoto(i)}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            <FaTimes size={8} />
                          </button>
                          {i === 0 && (
                            <span className="absolute bottom-1 left-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded">
                              Principal
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-white/30 text-xs mt-2">
                      {fotosPreview.length} foto(s) · La primera es la imagen principal · Pasá el mouse sobre una foto para eliminarla
                    </p>
                  </>
                )}
              </div>

              {/* SEO COLAPSABLE */}
              <div className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSeoAbierto(!seoAbierto)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 transition text-sm text-white/60"
                >
                  <span>Opciones de SEO (opcional)</span>
                  {seoAbierto ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </button>
                {seoAbierto && (
                  <div className="px-4 py-4 grid gap-4">
                    <p className="text-white/40 text-xs">
                      Si los dejás vacíos, el SEO se genera automáticamente a partir del título y la descripción.
                    </p>
                    <div>
                      <label className="text-sm text-white/60 mb-1 block">Título SEO</label>
                      <input
                        type="text"
                        placeholder="Título para buscadores (máx 60 caracteres)"
                        value={form.seo_titulo}
                        onChange={(e) => setForm({ ...form, seo_titulo: e.target.value })}
                        maxLength={60}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60 mb-1 block">Descripción SEO</label>
                      <textarea
                        placeholder="Descripción para buscadores (máx 155 caracteres)"
                        rows={2}
                        value={form.seo_descripcion}
                        onChange={(e) => setForm({ ...form, seo_descripcion: e.target.value })}
                        maxLength={155}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

            <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={cerrarModal}
                className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                disabled={guardando || subiendoFotos}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 transition text-sm font-semibold"
              >
                <FaSave size={13} />
                {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear propiedad"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
