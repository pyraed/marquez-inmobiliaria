import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para uso en Client Components ("use client").
 * Usar en: admin, filtros, formularios interactivos.
 * NO usar en Server Components — usar supabase-server.ts en su lugar.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
