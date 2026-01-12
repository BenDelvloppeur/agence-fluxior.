// ============================================
// RE-EXPORTS - Types et utilitaires centralisés
// ============================================
// Ce fichier sert de point d'import pour la compatibilité
// Tous les types sont maintenant centralisés dans src/lib/types.ts

// Re-export des types centralisés
export type {
    Lead,
    LeadNote,
    LeadTask,
    LeadActivity,
    LeadActivityType,
    LeadDetails,
    LeadSource,
    LeadStatus,
    Partner,
    Notification,
    NotificationType,
    UserRole,
    StatusConfigItem,
} from '../../../lib/types';

// Re-export des constantes
export { STATUS_CONFIG } from '../../../lib/dashboard-constants';

// Re-export des utilitaires
export { exportToCSV, getLast6MonthsData } from '../../../lib/dashboard-utils';
