import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = String(import.meta.env.VITE_SUPABASE_URL ?? "").trim();
const SUPABASE_PUBLISHABLE_KEY = String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "").trim();

let client: SupabaseClient<Database> | null = null;
let warned = false;

export function supabaseConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_PUBLISHABLE_KEY.length > 0;
}

export function getSupabase(): SupabaseClient<Database> | null {
  if (!supabaseConfigured()) {
    if (!warned) {
      warned = true;
      console.warn("Supabase URL or publishable key is unset. Auth stays signed out and no host is contacted.");
    }
    return null;
  }
  if (!client) {
    client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return client;
}
