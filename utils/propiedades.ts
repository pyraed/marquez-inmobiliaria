/**
 * Genera un slug URL-friendly a partir del título, localidad e id.
 * Se genera UNA SOLA VEZ al crear la propiedad. No se regenera en ediciones.
 *
 * Ejemplo: buildSlug("Casa con pileta", "Adolfo Gonzalez Chaves", 12)
 * → "casa-con-pileta-adolfo-gonzalez-chaves-12"
 */
export function buildSlug(titulo: string, localidad: string, id: number): string {
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // elimina tildes
      .replace(/[^a-z0-9\s]/g, "")     // elimina caracteres especiales
      .trim()
      .replace(/\s+/g, "-");           // espacios → guiones

  return `${slugify(titulo)}-${slugify(localidad)}-${id}`;
}

/**
 * Formatea precio_valor + moneda como texto display.
 * Usado para autogenerar precio_display en el admin.
 *
 * Ejemplos:
 *   formatPrecio(80000, "USD") → "USD 80.000"
 *   formatPrecio(15000000, "ARS") → "ARS 15.000.000"
 *   formatPrecio(null, "USD") → "" (el admin debe completar manualmente)
 */
export function formatPrecio(valor: number | null, moneda: "USD" | "ARS"): string {
  if (!valor) return "";
  const formatted = valor.toLocaleString("es-AR"); // 80000 → "80.000"
  return `${moneda} ${formatted}`;
}

/**
 * Convierte string del formulario a number | null.
 * Retorna null si el string está vacío o no es un número válido.
 */
export function parseNumericField(value: string): number | null {
  if (!value || value.trim() === "") return null;
  const parsed = Number(value);
  return isNaN(parsed) ? null : parsed;
}
