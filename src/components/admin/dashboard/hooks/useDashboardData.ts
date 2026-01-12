import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../../lib/supabase';
import type { Lead, Partner, UserRole, Notification, LeadActivity } from '../types';
import { STATUS_CONFIG } from '../types';

export const useDashboardData = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<UserRole>('admin');
    const [currentPartnerId, setCurrentPartnerId] = useState<string | null>(null);
    const [currentUserName, setCurrentUserName] = useState<string>("Admin"); // Default
    const [notifications, setNotifications] = useState<Notification[]>([]);
    
    // UI State managed here for filtering efficiency
    const [sortConfig, setSortConfig] = useState<{ key: 'date' | 'amount' | 'status', direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });

    const notify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        setNotifications(prev => [...prev, { id, type, message }]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: { session } } = await supabase.auth.getSession();
                const userEmail = session?.user?.email;

                const [leadsResponse, partnersResponse] = await Promise.all([
                    supabase.from('leads').select('*').order('created_at', { ascending: false }),
                    supabase.from('partners').select('*')
                ]);

                if (leadsResponse.data) setLeads(leadsResponse.data);
                if (partnersResponse.data) setPartners(partnersResponse.data);

                const partnerMatch = partnersResponse.data?.find(p => p.email === userEmail);
                const roleString = partnerMatch?.role || "";
                const isDirector = roleString.toLowerCase().includes('directeur') || roleString.toLowerCase().includes('ceo') || roleString.toLowerCase().includes('gérant');

                if (partnerMatch) {
                    setCurrentUserName(partnerMatch.name);
                }

                if (partnerMatch && !isDirector) {
                    setRole('partner');
                    setCurrentPartnerId(partnerMatch.id);
                } else {
                    setRole('admin');
                    if (partnerMatch) setCurrentPartnerId(partnerMatch.id);
                }

            } catch (err) {
                console.error("Error fetching dashboard data", err);
                notify("Erreur de chargement des données", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const channel = supabase
            .channel('public:leads')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    // Check if lead already exists to avoid duplication with manual addition
                    const newLead = payload.new as Lead;
                    setLeads(prev => {
                        if (prev.some(l => l.id === newLead.id)) return prev;
                        notify(`Nouveau lead : ${newLead.name}`, 'info');
                        return [newLead, ...prev];
                    });
                } else if (payload.eventType === 'UPDATE') {
                    const updatedLead = payload.new as Lead;
                    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
                } else if (payload.eventType === 'DELETE') {
                    const deletedId = payload.old.id;
                    setLeads(prev => prev.filter(l => l.id !== deletedId));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // --- ACTIONS INTELLIGENTES ---

    const addActivityLog = (lead: Lead, type: LeadActivity['type'], description: string): LeadActivity[] => {
        const newLog: LeadActivity = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            description,
            date: new Date().toISOString(),
            user: currentUserName
        };
        const currentHistory = lead.details?.history || [];
        return [newLog, ...currentHistory];
    };

    const updateLead = async (id: string, updates: Partial<Lead>) => {
        // Find current lead to compare
        const currentLead = leads.find(l => l.id === id);
        if (!currentLead) return;

        let enrichedUpdates = { ...updates };
        let logMessage = "";
        let logType: LeadActivity['type'] | null = null;

        // Detect Changes for Logging
        if (updates.status && updates.status !== currentLead.status) {
            const oldStatusLabel = STATUS_CONFIG[currentLead.status]?.label || currentLead.status;
            const newStatusLabel = STATUS_CONFIG[updates.status]?.label || updates.status;
            logMessage = `Statut changé de "${oldStatusLabel}" à "${newStatusLabel}"`;
            logType = 'status_change';
        } else if (updates.partner_id !== undefined && updates.partner_id !== currentLead.partner_id) {
            const partnerName = partners.find(p => p.id === updates.partner_id)?.name || "Non assigné";
            logMessage = `Assigné à ${partnerName}`;
            logType = 'partner_assigned';
        } else if (updates.deal_amount && updates.deal_amount !== currentLead.deal_amount) {
            logMessage = `Montant mis à jour : ${updates.deal_amount}€`;
            logType = 'info_update';
        }

        // Apply Log if exists
        if (logType && logMessage) {
            const newHistory = addActivityLog(currentLead, logType, logMessage);
            enrichedUpdates = {
                ...enrichedUpdates,
                details: {
                    ...(currentLead.details || {}),
                    ...(updates.details || {}),
                    history: newHistory
                }
            };
        }

        // Optimistic UI
        setLeads(prev => prev.map(l => l.id === id ? { ...l, ...currentLead.details, ...enrichedUpdates } : l));

        const payload = { ...enrichedUpdates };
        if (payload.partner_id === "") payload.partner_id = null;

        const { error } = await supabase.from('leads').update(payload).eq('id', id);

        if (error) {
            console.error("Update error:", error);
            notify(`Erreur sauvegarde: ${error.message}`, "error");
            // Rollback
            setLeads(prev => prev.map(l => l.id === id ? currentLead : l));
        } else {
            if (logMessage) notify(logMessage);
            else notify("Sauvegardé");
        }
    };

    const deleteLead = async (id: string) => {
        if (!window.confirm("Supprimer ce lead définitivement ?")) return;
        const previousLeads = [...leads];
        setLeads(prev => prev.filter(l => l.id !== id));
        const { error } = await supabase.from('leads').delete().eq('id', id);
        if (error) {
            setLeads(previousLeads);
            notify("Erreur suppression", "error");
        } else {
            notify("Lead supprimé");
        }
    };

    const createLead = async (leadData: Partial<Lead>) => {
        try {
            // Init history on create
            const newLeadData = {
                ...leadData,
                // Nettoyage des champs optionnels vides pour éviter des erreurs type "invalid input syntax"
                phone: leadData.phone || null,
                company: leadData.company || null,
                budget: leadData.budget || null,
                // Ajout historique initial
                details: {
                    ...(leadData.details || {}),
                    history: [{
                        id: Math.random().toString(36).substr(2, 9),
                        type: 'created',
                        description: 'Lead créé manuellement',
                        date: new Date().toISOString(),
                        user: currentUserName
                    }]
                }
            };

            const { data, error } = await supabase.from('leads').insert([newLeadData]).select().single();
            
            if (error) {
                console.error("Erreur Supabase création:", error);
                notify(`Erreur: ${error.message}`, "error");
                return false;
            }
            
            // Manually add to state immediately
            if (data) {
                setLeads(prev => [data, ...prev]);
            }

            return true;
        } catch (e: any) {
            console.error("Erreur inattendue:", e);
            notify(`Erreur inattendue: ${e.message}`, "error");
            return false;
        }
    };

    // --- COMPUTED DATA (Memoized with Sort) ---
    
    const filteredLeads = useMemo(() => {
        let result = role === 'admin' ? leads : leads.filter(l => l.partner_id === currentPartnerId);
        
        // Sorting Logic
        return result.sort((a, b) => {
            if (sortConfig.key === 'date') {
                return sortConfig.direction === 'asc' 
                    ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            } else if (sortConfig.key === 'amount') {
                const valA = a.deal_amount || parseFloat(a.budget?.replace(/[^0-9]/g, '') || '0');
                const valB = b.deal_amount || parseFloat(b.budget?.replace(/[^0-9]/g, '') || '0');
                return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
            }
            return 0;
        });

    }, [leads, role, currentPartnerId, sortConfig]);

    const stats = useMemo(() => {
        const signed = filteredLeads.filter(l => l.status === 'signed');
        const pipeline = filteredLeads.filter(l => ['new', 'contacted', 'negotiation'].includes(l.status));
        
        const totalRevenue = signed.reduce((acc, l) => acc + (l.deal_amount || 0), 0);
        const pipelineValue = pipeline.reduce((acc, l) => acc + (l.deal_amount || 0), 0);
        
        const conversionRate = filteredLeads.length > 0 
            ? Math.round((signed.length / filteredLeads.length) * 100) 
            : 0;
            
        const totalCommissions = signed.reduce((acc, lead) => {
            const partner = role === 'admin' 
                ? partners.find(p => p.id === lead.partner_id) 
                : partners.find(p => p.id === currentPartnerId);
            return acc + ((lead.deal_amount || 0) * (partner?.commission_rate || 0) / 100);
        }, 0);

        return { totalRevenue, pipelineValue, conversionRate, totalCommissions };
    }, [filteredLeads, partners, role, currentPartnerId]);

    return {
        leads,
        partners,
        setPartners,
        loading,
        role,
        currentPartnerId,
        currentUserName,
        filteredLeads,
        stats,
        notifications,
        notify,
        removeNotification,
        sortConfig,
        setSortConfig,
        actions: {
            updateLead,
            deleteLead,
            createLead
        }
    };
};
