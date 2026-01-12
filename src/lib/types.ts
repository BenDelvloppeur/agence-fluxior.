import { type LucideIcon } from 'lucide-react';

// ============================================
// TYPES CENTRALISÉS - Source unique de vérité
// ============================================

/**
 * Types de source d'un lead
 */
export type LeadSource = 'contact_form' | 'wizard';

/**
 * Statuts possibles d'un lead
 */
export type LeadStatus = 'new' | 'contacted' | 'negotiation' | 'signed' | 'lost';

/**
 * Note associée à un lead
 */
export type LeadNote = {
    id: string;
    content: string;
    date: string;
    author: string;
};

/**
 * Tâche associée à un lead
 */
export type LeadTask = {
    id: string;
    content: string;
    dueDate: string;
    completed: boolean;
    createdAt: string;
};

/**
 * Type d'activité d'un lead
 */
export type LeadActivityType = 
    | 'status_change' 
    | 'note_added' 
    | 'task_added' 
    | 'info_update' 
    | 'partner_assigned' 
    | 'created';

/**
 * Activité sur un lead (historique)
 */
export type LeadActivity = {
    id: string;
    type: LeadActivityType;
    description: string;
    date: string;
    user: string;
    metadata?: Record<string, unknown>;
};

/**
 * Détails supplémentaires d'un lead
 */
export type LeadDetails = {
    goals?: string[];
    designStyle?: string;
    deadline?: string;
    additional_details?: string;
    notes?: LeadNote[];
    tasks?: LeadTask[];
    history?: LeadActivity[];
    [key: string]: unknown;
};

/**
 * Type principal Lead
 * Utilisé dans toute l'application
 */
export type Lead = {
    id: string;
    created_at: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    project_type?: string;
    budget?: string;
    message?: string;
    source: LeadSource;
    status: LeadStatus;
    partner_id?: string | null;
    deal_amount?: number;
    details?: LeadDetails;
};

/**
 * Partenaire/Apporteur d'affaires
 */
export type Partner = {
    id: string;
    name: string;
    email: string;
    commission_rate: number;
    role?: string;
};

/**
 * Type de notification
 */
export type NotificationType = 'success' | 'error' | 'info';

/**
 * Notification système
 */
export type Notification = {
    id: string;
    type: NotificationType;
    message: string;
};

/**
 * Rôle utilisateur
 */
export type UserRole = 'admin' | 'partner';

/**
 * Configuration d'un statut (pour l'affichage)
 */
export type StatusConfigItem = {
    label: string;
    color: string;
    icon: LucideIcon;
};
