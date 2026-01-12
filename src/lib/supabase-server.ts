/**
 * Client Supabase côté serveur pour Astro
 * Utilise @supabase/ssr pour une gestion sécurisée des sessions
 */

import { createServerClient } from '@supabase/ssr';
import type { AstroCookies } from 'astro';
import { env } from './env';

/**
 * Crée un client Supabase côté serveur avec gestion des cookies
 * @param cookies - Les cookies Astro de la requête
 * @returns Client Supabase configuré
 */
export function createSupabaseServerClient(cookies: AstroCookies) {
  return createServerClient(env.supabase.url, env.supabase.anonKey, {
    cookies: {
      get(key: string) {
        return cookies.get(key)?.value;
      },
      set(key: string, value: string, options) {
        try {
          cookies.set(key, value, options);
        } catch (error) {
          // Peut échouer si les cookies sont en lecture seule (pre-rendering)
          // On ignore silencieusement en développement
          if (import.meta.env.DEV) {
            console.warn(`Failed to set cookie ${key}:`, error);
          }
        }
      },
      remove(key: string, options) {
        try {
          cookies.delete(key, options);
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn(`Failed to remove cookie ${key}:`, error);
          }
        }
      },
    },
  });
}

/**
 * Vérifie si l'utilisateur est authentifié
 * @param cookies - Les cookies Astro de la requête
 * @returns true si authentifié, false sinon
 */
export async function isAuthenticated(cookies: AstroCookies): Promise<boolean> {
  try {
    const supabase = createSupabaseServerClient(cookies);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

/**
 * Récupère la session utilisateur
 * @param cookies - Les cookies Astro de la requête
 * @returns Session ou null
 */
export async function getSession(cookies: AstroCookies) {
  try {
    const supabase = createSupabaseServerClient(cookies);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}
