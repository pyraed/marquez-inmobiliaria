// ============================================================
// CONFIGURACIÓN GLOBAL — MarQuez Negocios Inmobiliarios
// Actualizar aquí cuando cambien los datos de contacto.
// ============================================================

export const NOMBRE_INMOBILIARIA = "MarQuez Negocios Inmobiliarios";
export const NOMBRE_AGENTE = "Matias Marquez";

// Contacto
export const WHATSAPP_NUMBER = "5492983340336";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const PHONE_NUMBER = "+54 9 298 334 0336";
export const PHONE_HREF = "tel:+5492983340336";

// Ubicación
export const LOCALIDAD_PRINCIPAL = "Adolfo Gonzalez Chaves";
export const PROVINCIA = "Buenos Aires";
export const UBICACION_DISPLAY = "Adolfo Gonzalez Chaves, Buenos Aires";

// Horario
export const HORARIO = "Lun a Sáb de 9 a 18hs";

// Redes sociales — completar con las URLs reales
export const INSTAGRAM_URL = ""; // Ej: "https://instagram.com/marquezinmobiliaria"
export const FACEBOOK_URL = "";  // Ej: "https://facebook.com/marquezinmobiliaria"

// Dominio — actualizar cuando esté definido
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://marquezinmobiliaria.com.ar";

// SEO
export const SEO_TITLE_DEFAULT = `${NOMBRE_INMOBILIARIA} | Propiedades en ${LOCALIDAD_PRINCIPAL}`;
export const SEO_DESCRIPTION_DEFAULT =
  `Compra, venta y alquiler de propiedades en ${LOCALIDAD_PRINCIPAL} y alrededores. Asesoramiento profesional personalizado.`;
