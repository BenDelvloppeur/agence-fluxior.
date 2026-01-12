/**
 * Client Supabase côté client (navigateur)
 * Pour les composants React qui ont besoin d'accéder à Supabase
 */

import { createBrowserClient } from '@supabase/ssr';
import { env } from './env';

/**
 * Client Supabase pour le navigateur
 * Utilise createBrowserClient de @supabase/ssr pour une gestion optimale des cookies
 */
export const supabaseClient = createBrowserClient(
  env.supabase.url,
  env.supabase.anonKey
);
