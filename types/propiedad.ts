// Tipo base tal como viene de Supabase (lectura)
export type Propiedad = {
  id: number;
  slug: string;
  titulo: string;
  operacion: "Venta" | "Alquiler";
  tipo: "Casa" | "Departamento" | "Terreno" | "Campo" | "Local" | "Oficina" | "Cochera" | "Fondo de comercio" | "Otro";
  precio_valor: number | null;
  moneda: "USD" | "ARS";
  precio_display: string;
  ubicacion: string;
  localidad: string;
  descripcion: string;
  imagenes: string[];
  superficie_m2: number | null;
  superficie_ha: number | null;
  ambientes: number | null;
  dormitorios: number | null;
  banos: number | null;
  garage: boolean;
  financiacion: boolean;
  frente: number | null;
  fondo: number | null;
  unidades: number | null;
  destacada: boolean;
  estado: "publicada" | "pausada" | "reservada" | "vendida" | "alquilada";
  latitud: number | null;
  longitud: number | null;
  seo_titulo: string | null;
  seo_descripcion: string | null;
  created_at: string;
  updated_at: string;
};

// Subconjunto para cards del listado y home (SELECT parcial)
export type PropiedadCard = Pick<
  Propiedad,
  | "id"
  | "slug"
  | "titulo"
  | "operacion"
  | "tipo"
  | "precio_display"
  | "ubicacion"
  | "localidad"
  | "imagenes"
>;

// Tipo para el formulario del admin (sin id, slug, created_at, updated_at)
export type PropiedadForm = {
  titulo: string;
  operacion: "Venta" | "Alquiler";
  tipo: "Casa" | "Departamento" | "Terreno" | "Campo" | "Local" | "Oficina" | "Cochera" | "Fondo de comercio" | "Otro";
  precio_valor: string; // string en el form, se convierte a number al guardar
  moneda: "USD" | "ARS";
  precio_display: string;
  ubicacion: string;
  localidad: string;
  descripcion: string;
  imagenes: string[];
  superficie_m2: string; // string en el form
  superficie_ha: string; // string en el form
  ambientes: string;     // string en el form
  dormitorios: string;   // string en el form
  banos: string;         // string en el form
  garage: boolean;
  financiacion: boolean;
  frente: string;   // string en el form, se convierte a number al guardar
  fondo: string;    // string en el form
  unidades: string; // string en el form
  destacada: boolean;
  estado: "publicada" | "pausada" | "reservada" | "vendida" | "alquilada";
  seo_titulo: string;
  seo_descripcion: string;
};

export const OPERACIONES = ["Venta", "Alquiler"] as const;

export const TIPOS_PROPIEDAD = [
  "Casa",
  "Departamento",
  "Terreno",
  "Campo",
  "Local",
  "Oficina",
  "Cochera",
  "Fondo de comercio",
  "Otro",
] as const;

export const ESTADOS_PROPIEDAD = [
  "publicada",
  "pausada",
  "reservada",
  "vendida",
  "alquilada",
] as const;

export const MONEDAS = ["USD", "ARS"] as const;
