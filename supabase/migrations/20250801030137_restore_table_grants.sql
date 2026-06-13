-- Newer Supabase CLI images (>= mid-2026) no longer grant DML on migration-created
-- tables to anon/authenticated by default, so a fresh `db reset` left the app
-- unable to read products/orders locally (42501). RLS is enabled with policies on
-- every table — these grants just restore the layer the policies were designed on.

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Keep future tables/sequences created by migrations consistent
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated;
