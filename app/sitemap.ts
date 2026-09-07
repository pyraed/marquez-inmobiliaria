import { MetadataRoute } from "next";
import { createPublicClient } from "../lib/supabase-public";
import { SITE_URL } from "../lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicClient();

  const { data: propiedades } = await supabase
    .from("propiedades")
    .select("slug, updated_at")
    .in("estado", ["publicada", "reservada"]);

  const propiedadesUrls: MetadataRoute.Sitemap = (propiedades || []).map((p) => ({
    url: `${SITE_URL}/propiedades/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/propiedades`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tasaciones`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...propiedadesUrls,
  ];
}
