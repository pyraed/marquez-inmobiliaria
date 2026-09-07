import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase público — sin cookies(), sin funciones dinámicas de Next.js.
 *
 * Usar en páginas públicas (home, propiedades, ficha, contacto, tasaciones, sitemap).
 * Permite que revalidate / ISR funcione correctamente.
 *
 * RLS sigue activo: la anon_key solo puede leer filas
 * con estado IN ('publicada', 'reservada'), según las policies definidas.
 *
 * NO usar en admin ni en ningún contexto que requiera autenticación.
 * Para esos casos usar lib/supabase-server.ts (con cookies).
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
