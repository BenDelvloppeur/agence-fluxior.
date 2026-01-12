/**
 * Gestion centralisée des erreurs de l'application
 */

import { logger } from './logger';

/**
 * Classe d'erreur personnalisée pour l'application
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Types d'erreurs de l'application
 */
export enum ErrorCode {
  // Erreurs de validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Erreurs d'authentification
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  AUTH_INVALID = 'AUTH_INVALID',
  AUTH_EXPIRED = 'AUTH_EXPIRED',

  // Erreurs de base de données
  DB_ERROR = 'DB_ERROR',
  DB_NOT_FOUND = 'DB_NOT_FOUND',
  DB_CONSTRAINT = 'DB_CONSTRAINT',

  // Erreurs réseau
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',

  // Erreurs génériques
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

/**
 * Messages d'erreur user-friendly
 */
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.VALIDATION_ERROR]: 'Les données fournies ne sont pas valides.',
  [ErrorCode.INVALID_INPUT]: 'Les informations saisies sont incorrectes.',
  [ErrorCode.AUTH_REQUIRED]: 'Vous devez être connecté pour effectuer cette action.',
  [ErrorCode.AUTH_INVALID]: 'Identifiants incorrects.',
  [ErrorCode.AUTH_EXPIRED]: 'Votre session a expiré. Veuillez vous reconnecter.',
  [ErrorCode.DB_ERROR]: 'Une erreur est survenue lors de l\'enregistrement.',
  [ErrorCode.DB_NOT_FOUND]: 'L\'élément demandé n\'a pas été trouvé.',
  [ErrorCode.DB_CONSTRAINT]: 'Cette action n\'est pas autorisée.',
  [ErrorCode.NETWORK_ERROR]: 'Problème de connexion. Vérifiez votre connexion internet.',
  [ErrorCode.TIMEOUT]: 'La requête a pris trop de temps. Veuillez réessayer.',
  [ErrorCode.UNKNOWN_ERROR]: 'Une erreur inattendue est survenue.',
  [ErrorCode.INTERNAL_ERROR]: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
};

/**
 * Gère une erreur et retourne un message user-friendly
 */
export function handleError(error: unknown): {
  message: string;
  code: string;
  statusCode: number;
} {
  // Erreur personnalisée de l'application
  if (error instanceof AppError) {
    logger.error(error, error.context);
    return {
      message: error.message || ERROR_MESSAGES[error.code as ErrorCode] || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  // Erreur Supabase
  if (error && typeof error === 'object' && 'message' in error) {
    const supabaseError = error as { message: string; code?: string };
    
    // Mapper les erreurs Supabase communes
    if (supabaseError.code === 'PGRST116') {
      logger.error(error);
      return {
        message: ERROR_MESSAGES[ErrorCode.DB_NOT_FOUND],
        code: ErrorCode.DB_NOT_FOUND,
        statusCode: 404,
      };
    }

    if (supabaseError.code?.startsWith('235')) {
      logger.error(error);
      return {
        message: ERROR_MESSAGES[ErrorCode.DB_CONSTRAINT],
        code: ErrorCode.DB_CONSTRAINT,
        statusCode: 400,
      };
    }
  }

  // Erreur réseau
  if (error instanceof TypeError && error.message.includes('fetch')) {
    logger.error(error);
    return {
      message: ERROR_MESSAGES[ErrorCode.NETWORK_ERROR],
      code: ErrorCode.NETWORK_ERROR,
      statusCode: 503,
    };
  }

  // Erreur générique
  logger.error(error);
  return {
    message: ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
    code: ErrorCode.UNKNOWN_ERROR,
    statusCode: 500,
  };
}

/**
 * Crée une erreur de validation
 */
export function createValidationError(message: string, context?: Record<string, unknown>): AppError {
  return new AppError(message, ErrorCode.VALIDATION_ERROR, 400, context);
}

/**
 * Crée une erreur d'authentification
 */
export function createAuthError(message: string = ERROR_MESSAGES[ErrorCode.AUTH_REQUIRED]): AppError {
  return new AppError(message, ErrorCode.AUTH_REQUIRED, 401);
}

/**
 * Crée une erreur "non trouvé"
 */
export function createNotFoundError(resource: string): AppError {
  return new AppError(
    `${resource} n'a pas été trouvé`,
    ErrorCode.DB_NOT_FOUND,
    404,
    { resource }
  );
}
