/**
 * Validation et configuration des variables d'environnement
 */

/**
 * Valide que les variables d'environnement requises sont présentes
 * @throws {Error} Si une variable requise est manquante
 */
export function validateEnv(): void {
  const required = {
    PUBLIC_SUPABASE_URL: import.meta.env.PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY: import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  };

  const missing: string[] = [];

  for (const [key, value] of Object.entries(required)) {
    if (!value || value === 'placeholder' || value.includes('your-')) {
      missing.push(key);
    }
  }

  if (missing.length > 0 && import.meta.env.PROD) {
    throw new Error(
      `Variables d'environnement manquantes ou invalides: ${missing.join(', ')}\n` +
      `Veuillez définir ces variables dans votre fichier .env ou votre plateforme de déploiement.\n` +
      `Consultez .env.example pour voir les variables requises.`
    );
  }

  // En développement, afficher un avertissement
  if (missing.length > 0 && import.meta.env.DEV) {
    console.warn(
      `⚠️  Variables d'environnement manquantes: ${missing.join(', ')}\n` +
      `L'application fonctionnera avec des valeurs placeholder.\n` +
      `Créez un fichier .env basé sur .env.example pour configurer correctement l'application.`
    );
  }
}

/**
 * Variables d'environnement typées
 */
export const env = {
  supabase: {
    url: import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    anonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
  },
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
  // Variables optionnelles
  sentryDsn: import.meta.env.PUBLIC_SENTRY_DSN,
  analyticsId: import.meta.env.PUBLIC_ANALYTICS_ID,
} as const;

// Valider au chargement du module (en production uniquement)
if (import.meta.env.PROD) {
  validateEnv();
}
