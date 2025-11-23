import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnnonKey = import.meta.env.VITE_SUPABASE_ANNON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnnonKey);
