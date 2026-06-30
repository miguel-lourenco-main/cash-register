import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"
import { LOCAL_SUPABASE_ANON_KEY, LOCAL_SUPABASE_URLS } from "./local-supabase"

// Fall back to the local CLI stack when env vars are unset (dev / static export).
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? LOCAL_SUPABASE_URLS.api
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? LOCAL_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
