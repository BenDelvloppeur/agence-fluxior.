/**
 * @deprecated Utilisez supabaseClient depuis './supabase-client' pour le navigateur
 * ou createSupabaseServerClient depuis './supabase-server' pour le serveur
 * 
 * Ce fichier est conservé pour compatibilité mais sera supprimé dans une future version
 */

import { createBrowserClient } from '@supabase/ssr';
import { env } from './env';

// Types centralisés - voir src/lib/types.ts
export type { Lead, LeadSource, LeadStatus } from './types';

/**
 * @deprecated Utilisez supabaseClient depuis './supabase-client' à la place
 * Client Supabase pour compatibilité (legacy)
 */
export const supabase = createBrowserClient(
  env.supabase.url,
  env.supabase.anonKey
);

// Re-export du client moderne
export { supabaseClient } from './supabase-client';
