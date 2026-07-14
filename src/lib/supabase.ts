import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const TABLE_NAME =
  process.env.SUPABASE_TABLE_NAME ||
  process.env.NEXT_PUBLIC_SUPABASE_TABLE_NAME ||
  'pepecard_logins';
