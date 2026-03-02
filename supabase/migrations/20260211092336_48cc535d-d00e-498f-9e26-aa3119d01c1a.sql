
DROP INDEX IF EXISTS idx_colleges_name_trgm;
DROP EXTENSION IF EXISTS pg_trgm CASCADE;
CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA extensions;
CREATE INDEX idx_colleges_name_trgm ON public.colleges USING gin (name extensions.gin_trgm_ops);
