/**
 * Local Supabase ports — must stay in sync with supabase/config.toml.
 * After changing config.toml, update this file and run `pnpm supabase:env-sync`.
 */
export const LOCAL_SUPABASE_HOST = "127.0.0.1" as const

/** Ports defined in supabase/config.toml */
export const LOCAL_SUPABASE_PORTS = {
  api: 54621,
  db: 54622,
  shadowDb: 54320,
  pooler: 54629,
  studio: 54623,
  inbucket: 54624,
  inbucketSmtp: 54625,
  analytics: 54627,
  edgeInspector: 8083,
} as const

export const LOCAL_SUPABASE_URLS = {
  api: `http://${LOCAL_SUPABASE_HOST}:${LOCAL_SUPABASE_PORTS.api}`,
  rest: `http://${LOCAL_SUPABASE_HOST}:${LOCAL_SUPABASE_PORTS.api}/rest/v1`,
  studio: `http://${LOCAL_SUPABASE_HOST}:${LOCAL_SUPABASE_PORTS.studio}`,
  inbucket: `http://${LOCAL_SUPABASE_HOST}:${LOCAL_SUPABASE_PORTS.inbucket}`,
  graphql: `http://${LOCAL_SUPABASE_HOST}:${LOCAL_SUPABASE_PORTS.api}/graphql/v1`,
  storage: `http://${LOCAL_SUPABASE_HOST}:${LOCAL_SUPABASE_PORTS.api}/storage/v1`,
} as const

export const LOCAL_SUPABASE_DB_URL = `postgresql://postgres:postgres@${LOCAL_SUPABASE_HOST}:${LOCAL_SUPABASE_PORTS.db}/postgres`

/** Default anon key for local Supabase CLI (JWT demo secret) */
export const LOCAL_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
