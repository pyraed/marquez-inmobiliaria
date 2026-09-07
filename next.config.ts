import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Supabase Storage — el hostname cambia según el proyecto.
        // Formato: <project-ref>.supabase.co
        // Actualizar NEXT_PUBLIC_SUPABASE_URL y este hostname
        // cuando se conecte el proyecto Supabase real.
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
