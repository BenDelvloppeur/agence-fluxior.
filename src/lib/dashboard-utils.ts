import type { Lead } from './types';

// ============================================
// UTILITAIRES DASHBOARD
// ============================================

/**
 * Exporte des données au format CSV
 */
export const exportToCSV = (data: Record<string, unknown>[], filename: string): void => {
    if (data.length === 0) {
        console.warn('No data to export');
        return;
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
        Object.values(obj).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};

/**
 * Génère les données des 6 derniers mois pour les graphiques
 */
export const getLast6MonthsData = (leads: Lead[]): Array<{ name: string; key: string; revenus: number }> => {
    const months: Array<{ name: string; key: string; revenus: number }> = [];
    const today = new Date();
    
    // Générer les 6 derniers mois (incluant le mois actuel)
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = d.toLocaleString('fr-FR', { month: 'short' });
        const key = `${d.getMonth()}-${d.getFullYear()}`;
        months.push({ 
            name: monthName.charAt(0).toUpperCase() + monthName.slice(1), 
            key, 
            revenus: 0 
        });
    }

    // Agréger les revenus des leads SIGNÉS
    leads.forEach(lead => {
        if (lead.status === 'signed' && lead.deal_amount) {
            const leadDate = new Date(lead.created_at);
            const leadKey = `${leadDate.getMonth()}-${leadDate.getFullYear()}`;
            
            const month = months.find(m => m.key === leadKey);
            if (month) {
                month.revenus += lead.deal_amount;
            }
        }
    });

    return months;
};
