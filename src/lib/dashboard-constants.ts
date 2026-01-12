import { type LucideIcon } from 'lucide-react';
import { Target, Mail, MessageSquare, Check, X } from 'lucide-react';
import type { StatusConfigItem } from './types';

// ============================================
// CONSTANTES DASHBOARD - Configuration UI
// ============================================

/**
 * Configuration des statuts de leads pour l'affichage
 */
export const STATUS_CONFIG: Record<string, StatusConfigItem> = {
    new: { 
        label: 'Nouveau', 
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', 
        icon: Target 
    },
    contacted: { 
        label: 'Contacté', 
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', 
        icon: Mail 
    },
    negotiation: { 
        label: 'En Nego', 
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', 
        icon: MessageSquare 
    },
    signed: { 
        label: 'Signé', 
        color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', 
        icon: Check 
    },
    lost: { 
        label: 'Perdu', 
        color: 'bg-red-500/20 text-red-400 border-red-500/30', 
        icon: X 
    },
};
