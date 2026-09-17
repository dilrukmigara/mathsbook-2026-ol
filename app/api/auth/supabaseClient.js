import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://etnkhxifqvpqdvalzuwx.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_C9mMNJ5jXkWbZqJPvlfLKg_2nisFVk9';

let client;
try {
  client = createClient(supabaseUrl, supabaseAnonKey);
} catch (e) {
  console.warn('[Supabase] Init failed, falling back to offline mode:', e.message);
  client = {
    from: () => ({
      select: () => ({ order: () => ({ eq: () => Promise.resolve({ data: null, error: new Error('Offline') }) }) }),
      insert: () => Promise.resolve({ error: new Error('Offline') }),
      update: () => ({ eq: () => Promise.resolve({ error: new Error('Offline') }) }),
      delete: () => ({ eq: () => Promise.resolve({ error: new Error('Offline') }) })
    }),
    rpc: () => Promise.resolve({ error: new Error('Offline') })
  };
}

export const supabase = client;

