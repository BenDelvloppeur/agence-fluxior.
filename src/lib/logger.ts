/**
 * Système de logging centralisé
 * Remplace console.log/error pour une meilleure gestion en production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDev = import.meta.env.DEV;
  private isProd = import.meta.env.PROD;

  /**
   * Log de débogage - uniquement en développement
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDev) {
      console.log('[DEBUG]', message, context || '');
    }
  }

  /**
   * Log d'information - développement uniquement
   */
  info(message: string, context?: LogContext): void {
    if (this.isDev) {
      console.info('[INFO]', message, context || '');
    }
    // En production, pourrait être envoyé à un service de logging
  }

  /**
   * Avertissement - toujours loggé
   */
  warn(message: string, context?: LogContext): void {
    console.warn('[WARN]', message, context || '');
  }

  /**
   * Erreur - toujours loggé, mais sanitizé en production
   */
  error(error: Error | unknown, context?: LogContext): void {
    const sanitizedContext = this.sanitizeContext(context);

    if (this.isDev) {
      // En développement : log complet
      console.error('[ERROR]', error, sanitizedContext);
    } else {
      // En production : log minimal sans stack trace
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[ERROR]', errorMessage, sanitizedContext);

      // TODO: Intégrer Sentry ou autre service de monitoring
      // if (error instanceof Error) {
      //   Sentry.captureException(error, { extra: sanitizedContext });
      // }
    }
  }

  /**
   * Sanitize le contexte pour supprimer les données sensibles
   */
  private sanitizeContext(context?: LogContext): LogContext | undefined {
    if (!context) return undefined;

    const sanitized: LogContext = { ...context };

    // Masquer les emails
    if (sanitized.email && typeof sanitized.email === 'string') {
      sanitized.email = this.maskEmail(sanitized.email);
    }

    // Supprimer les tokens
    const sensitiveKeys = ['token', 'password', 'secret', 'key', 'auth', 'session'];
    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        delete sanitized[key];
      }
    }

    return sanitized;
  }

  /**
   * Masque partiellement un email pour le logging
   */
  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (!domain) return email;

    if (localPart.length <= 2) {
      return `${localPart[0]}***@${domain}`;
    }

    const masked = `${localPart.slice(0, 2)}***${localPart.slice(-1)}`;
    return `${masked}@${domain}`;
  }
}

/**
 * Instance singleton du logger
 */
export const logger = new Logger();
