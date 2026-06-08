import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = "https://sgtfstuunasmhvizhjvp.supabase.co";
const SUPABASE_ANON = "sb_publishable_fSuQQbst2_EDBSLmyTdH7A_QdSyx5au";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
