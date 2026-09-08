-- ============================================================
-- MarQuez Negocios Inmobiliarios — Supabase Schema
-- ============================================================
-- Instrucciones:
-- 1. Abrir el proyecto en Supabase Dashboard
-- 2. Ir a SQL Editor
-- 3. Pegar y ejecutar este archivo completo
-- 4. Verificar con las queries de la sección VERIFICACIÓN al final
-- ============================================================

-- ============================================================
-- TABLA PRINCIPAL: propiedades
-- ============================================================
CREATE TABLE propiedades (
  id              bigserial PRIMARY KEY,
  slug            text UNIQUE NOT NULL,
  titulo          text NOT NULL,
  operacion       text NOT NULL
                    CHECK (operacion IN ('Venta', 'Alquiler')),
  tipo            text NOT NULL
                    CHECK (tipo IN (
                      'Casa', 'Departamento', 'Terreno', 'Campo',
                      'Local', 'Oficina', 'Cochera', 'Fondo de comercio', 'Otro'
                    )),
  precio_valor    numeric(15,2),
  moneda          text NOT NULL DEFAULT 'USD'
                    CHECK (moneda IN ('USD', 'ARS')),
  precio_display  text NOT NULL,
  ubicacion       text NOT NULL,
  localidad       text NOT NULL,
  descripcion     text NOT NULL,
  imagenes        text[] NOT NULL DEFAULT '{}',
  superficie_m2   numeric(10,2),
  superficie_ha   numeric(10,2),
  ambientes       integer,
  dormitorios     integer,
  banos           integer,
  garage          boolean NOT NULL DEFAULT false,
  financiacion    boolean NOT NULL DEFAULT false,
  frente          numeric(8,2),
  fondo           numeric(8,2),
  unidades        integer,
  destacada       boolean NOT NULL DEFAULT false,
  estado          text NOT NULL DEFAULT 'publicada'
                    CHECK (estado IN (
                      'publicada', 'pausada', 'reservada',
                      'vendida', 'alquilada'
                    )),
  latitud         numeric(10,7),
  longitud        numeric(10,7),
  seo_titulo      text,
  seo_descripcion text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TRIGGER: actualiza updated_at automáticamente en cada UPDATE
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_propiedades_updated_at
  BEFORE UPDATE ON propiedades
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_propiedades_estado      ON propiedades(estado);
CREATE INDEX idx_propiedades_operacion   ON propiedades(operacion);
CREATE INDEX idx_propiedades_tipo        ON propiedades(tipo);
CREATE INDEX idx_propiedades_localidad   ON propiedades(localidad);
CREATE INDEX idx_propiedades_destacada   ON propiedades(destacada);
CREATE INDEX idx_propiedades_precio      ON propiedades(precio_valor);
CREATE INDEX idx_propiedades_created_at  ON propiedades(created_at DESC);

-- Índice compuesto para el listado público (query más frecuente)
CREATE INDEX idx_propiedades_listado
  ON propiedades(estado, operacion, tipo, created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE propiedades ENABLE ROW LEVEL SECURITY;

-- SELECT: autenticados ven todo; público solo ve publicada y reservada
CREATE POLICY "select_policy" ON propiedades
  FOR SELECT
  USING (
    auth.role() = 'authenticated'
    OR estado IN ('publicada', 'reservada')
  );

-- INSERT, UPDATE, DELETE: solo usuarios autenticados (admin)
CREATE POLICY "insert_policy" ON propiedades
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "update_policy" ON propiedades
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "delete_policy" ON propiedades
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE — Policies del bucket "propiedades"
-- IMPORTANTE: el bucket debe crearse primero desde el dashboard
-- Storage → New bucket → nombre: propiedades → Public: No
-- Luego ejecutar estas policies:
-- ============================================================

-- Lectura pública de imágenes
CREATE POLICY "storage_select_policy"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'propiedades');

-- Subida: solo autenticados
CREATE POLICY "storage_insert_policy"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'propiedades'
    AND auth.role() = 'authenticated'
  );

-- Actualización: solo autenticados
CREATE POLICY "storage_update_policy"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'propiedades'
    AND auth.role() = 'authenticated'
  );

-- Eliminación: solo autenticados
CREATE POLICY "storage_delete_policy"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'propiedades'
    AND auth.role() = 'authenticated'
  );

-- ============================================================
-- VERIFICACIÓN — Ejecutar por separado para confirmar
-- ============================================================

-- Verificar columnas de la tabla:
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'propiedades'
-- ORDER BY ordinal_position;

-- Verificar policies:
-- SELECT policyname, cmd, qual
-- FROM pg_policies
-- WHERE tablename = 'propiedades';

-- Verificar índices:
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'propiedades';
