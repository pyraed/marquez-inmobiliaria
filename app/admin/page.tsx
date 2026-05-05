"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase";
import { FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaTimes, FaSave, FaUpload, FaImage } from "react-icons/fa";

type Propiedad = {
  id?: number;
  titulo: string;
  tipo: "Venta" | "Alquiler";
  precio: string;
  ubicacion: string;
  descripcion: string;
  imagenes: string[];
  superficie?: string;
  ambientes?: number | string;
  banos?: number | string;
  garage?: boolean;
};

const propiedadVacia: Propiedad = {
  titulo: "",
  tipo: "Venta",
  precio: "",
  ubicacion: "",
  descripcion: "",
  imagenes: [],
  superficie: "",
  ambientes: "",
  banos: "",
  garage: false,
};

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();

  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Propiedad | null>(null);
  const [form, setForm] = useState<Propiedad>(propiedadVacia);
  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "ok" | "error" } | null>(null);
  const [subiendoFotos, setSubiendoFotos] = useState(false);
  const [fotosPreview, setFotosPreview] = useState<string[]>([]);

  const cargarPropiedades = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("propiedades")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setPropiedades(data);
    setLoading(false);
  };

  useEffect(() => {
    cargarPropiedades();
  }, []);

  const mostrarMensaje = (texto: string, tipo: "ok" | "error") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 3000);
  };

  const abrirNueva = () => {
    setEditando(null);
    setForm(propiedadVacia);
    setFotosPreview([]);
    setModalAbierto(true);
  };

  const abrirEditar = (prop: Propiedad) => {
    setEditando(prop);
    setForm(prop);
    setFotosPreview(prop.imagenes || []);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditando(null);
    setForm(propiedadVacia);
    setFotosPreview([]);
  };

  const subirFotos = async (archivos: FileList) => {
    setSubiendoFotos(true);
    const urlsNuevas: string[] = [];

    for (const archivo of Array.from(archivos)) {
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
    if (!form.titulo || !form.precio || !form.ubicacion || !form.descripcion) {
      mostrarMensaje("Completá todos los campos obligatorios.", "error");
      return;
    }

    setGuardando(true);
    const datos = {
      ...form,
      imagenes: fotosPreview,
      ambientes: form.ambientes ? Number(form.ambientes) : null,
      banos: form.banos ? Number(form.banos) : null,
    };

    if (editando?.id) {
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
      const { error } = await supabase.from("propiedades").insert(datos);
      if (error) {
        mostrarMensaje("Error al crear la propiedad.", "error");
      } else {
        mostrarMensaje("Propiedad creada correctamente.", "ok");
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

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white">

      {/* HEADER */}
      <header className="bg-[#102A4C] border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-orange-500 text-2xl">⌂</span>
          <div>
            <h1 className="font-bold text-lg leading-none">MarQuez</h1>
            <p className="text-white/50 text-xs">Panel de administración</p>
          </div>
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
                    <img src={prop.imagenes[0]} alt={prop.titulo} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaImage className="text-white/30" size={20} />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{prop.tipo}</span>
                      <span className="text-white/40 text-xs">{prop.imagenes?.length || 0} fotos</span>
                      {prop.superficie && <span className="text-white/40 text-xs">{prop.superficie} m²</span>}
                      {prop.ambientes && <span className="text-white/40 text-xs">{prop.ambientes} amb.</span>}
                    </div>
                    <h3 className="font-semibold">{prop.titulo}</h3>
                    <p className="text-white/50 text-sm">{prop.ubicacion}</p>
                    <p className="text-orange-400 font-bold text-sm mt-0.5">{prop.precio}</p>
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
                        onClick={() => eliminar(prop.id!)}
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
                      onClick={() => setConfirmarEliminar(prop.id!)}
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

            <div className="px-6 py-6 grid gap-4">

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Título *</label>
                  <input
                    type="text"
                    placeholder="Ej: Casa con pileta"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Tipo *</label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value as "Venta" | "Alquiler" })}
                    className="w-full px-4 py-3 rounded-lg bg-[#0B1F3A] border border-white/20 outline-none focus:border-orange-500 transition text-white"
                  >
                    <option value="Venta">Venta</option>
                    <option value="Alquiler">Alquiler</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Precio *</label>
                  <input
                    type="text"
                    placeholder="Ej: USD 80.000"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Ubicación *</label>
                  <input
                    type="text"
                    placeholder="Ej: La Plata, Buenos Aires"
                    value={form.ubicacion}
                    onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* CAMPOS NUEVOS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Superficie (m²)</label>
                  <input
                    type="text"
                    placeholder="Ej: 120"
                    value={form.superficie || ""}
                    onChange={(e) => setForm({ ...form, superficie: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Ambientes</label>
                  <input
                    type="number"
                    placeholder="Ej: 3"
                    value={form.ambientes || ""}
                    onChange={(e) => setForm({ ...form, ambientes: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Baños</label>
                  <input
                    type="number"
                    placeholder="Ej: 2"
                    value={form.banos || ""}
                    onChange={(e) => setForm({ ...form, banos: e.target.value })}
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
                        : "bg-white/10 border border-white/20 text-white/40"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${form.garage ? "border-orange-400 bg-orange-400" : "border-white/30"}`}>
                      {form.garage && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-sm">{form.garage ? "Sí" : "No"}</span>
                  </div>
                </div>
              </div>

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

              {/* SUBIDA DE FOTOS */}
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
                    {subiendoFotos ? "Subiendo fotos..." : "Hacé click o arrastrá fotos acá"}
                  </span>
                </label>

                {fotosPreview.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {fotosPreview.map((url, i) => (
                      <div key={i} className="relative group">
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
                )}

                {fotosPreview.length > 0 && (
                  <p className="text-white/30 text-xs mt-2">
                    {fotosPreview.length} foto(s) · La primera es la imagen principal · Pasá el mouse sobre una foto para eliminarla
                  </p>
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
