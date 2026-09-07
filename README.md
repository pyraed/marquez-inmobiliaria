# MarQuez Negocios Inmobiliarios

Web inmobiliaria profesional construida con Next.js 16, Supabase y Tailwind CSS.

---

## Stack

- **Framework:** Next.js 16 (App Router)
- **Base de datos:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Estilos:** Tailwind CSS v4
- **Lenguaje:** TypeScript

---

## Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Completar `.env.local` con las credenciales del proyecto Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Inicializar la base de datos

En el SQL Editor de Supabase, ejecutar el archivo:

```
supabase/schema.sql
```

Este archivo crea:
- Tabla `propiedades` con todos los campos
- Índices
- Trigger `updated_at`
- Políticas RLS

### 4. Crear usuario administrador

En Supabase → Authentication → Users → Add user:
- Email: el email del administrador
- Password: contraseña segura

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

### 6. Panel de administración

Acceder a `/admin/login` con las credenciales creadas en el paso 4.

---

## Configuración adicional

### Redes sociales

Editar `lib/config.ts` y completar:

```ts
export const INSTAGRAM_URL = "https://instagram.com/tu-usuario";
export const FACEBOOK_URL = "https://facebook.com/tu-usuario";
```

### Dominio en producción

Actualizar en `lib/config.ts`:

```ts
export const SITE_URL = "https://tudominio.com.ar";
```

Y también la variable de entorno `NEXT_PUBLIC_SITE_URL`.

### Imagen OG

Reemplazar `public/og-default.svg` con una imagen real de 1200×630px
(puede ser JPG o PNG) para el preview en redes sociales.

---

## Estructura del proyecto

```
app/
├── layout.tsx              # Layout global + metadata + Schema.org
├── page.tsx                # Home
├── not-found.tsx           # Página 404
├── robots.ts               # robots.txt dinámico
├── sitemap.ts              # Sitemap dinámico
├── propiedades/
│   ├── page.tsx            # Listado con filtros (Server Component)
│   └── [slug]/page.tsx     # Ficha de propiedad + metadata
├── contacto/page.tsx       # Página de contacto
├── tasaciones/page.tsx     # Página para propietarios
└── admin/
    ├── page.tsx            # Panel de administración
    └── login/page.tsx      # Login

components/
├── layout/Footer.tsx
├── propiedades/
│   ├── PropiedadCard.tsx
│   └── FiltrosPropiedades.tsx
├── ui/
│   ├── WhatsAppFloat.tsx
│   └── ShareButton.tsx
├── Navbar.tsx
├── Galeria.tsx
├── ContactForm.tsx
└── ScrollReveal.tsx

lib/
├── config.ts               # Constantes globales (WA, tel, redes, etc.)
├── supabase-server.ts      # Cliente Supabase para Server Components
└── supabase-browser.ts     # Cliente Supabase para Client Components

types/propiedad.ts          # Tipos TypeScript del esquema
utils/propiedades.ts        # buildSlug, formatPrecio, parseNumericField
supabase/schema.sql         # SQL completo para inicializar la DB
```

---

## Build para producción

```bash
npm run build
npm start
```

---

## Deploy

Compatible con Vercel, Railway, o cualquier plataforma que soporte Node.js.

Asegurarse de configurar las variables de entorno en la plataforma de deploy.
