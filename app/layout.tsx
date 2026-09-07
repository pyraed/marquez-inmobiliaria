import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import {
  NOMBRE_INMOBILIARIA,
  SEO_DESCRIPTION_DEFAULT,
  SITE_URL,
  PHONE_NUMBER,
  INSTAGRAM_URL,
  FACEBOOK_URL,
  LOCALIDAD_PRINCIPAL,
  PROVINCIA,
} from "../lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: NOMBRE_INMOBILIARIA,
    template: `%s | ${NOMBRE_INMOBILIARIA}`,
  },
  description: SEO_DESCRIPTION_DEFAULT,
  keywords: [
    "inmobiliaria",
    "propiedades",
    "venta de propiedades",
    "alquiler de propiedades",
    LOCALIDAD_PRINCIPAL,
    PROVINCIA,
    "casas en venta",
    "terrenos",
    "campos",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: NOMBRE_INMOBILIARIA,
    title: NOMBRE_INMOBILIARIA,
    description: SEO_DESCRIPTION_DEFAULT,
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: NOMBRE_INMOBILIARIA,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: NOMBRE_INMOBILIARIA,
    description: SEO_DESCRIPTION_DEFAULT,
    images: ["/og-default.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Schema.org RealEstateAgent (JSON-LD global)
const schemaOrg = {
  "@context": "https://schema.org",
  "@type": ["RealEstateAgent", "LocalBusiness"],
  name: NOMBRE_INMOBILIARIA,
  telephone: PHONE_NUMBER,
  url: SITE_URL,
  sameAs: [INSTAGRAM_URL, FACEBOOK_URL].filter(Boolean),
  address: {
    "@type": "PostalAddress",
    addressLocality: LOCALIDAD_PRINCIPAL,
    addressRegion: PROVINCIA,
    addressCountry: "AR",
  },
  openingHours: "Mo-Sa 09:00-18:00",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: PHONE_NUMBER,
    availableLanguage: "Spanish",
  },
};

// Root layout — completamente estático, sin await, sin headers(), sin cookies().
// Navbar/Footer están en app/(public)/layout.tsx (rutas públicas).
// Las rutas /admin tienen su propio layout sin Navbar/Footer.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0B1F3A] text-white">
        {children}
      </body>
    </html>
  );
}
