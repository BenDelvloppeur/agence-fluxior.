import React, { useState, Component, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Users, DollarSign, Target, Search, UserPlus, 
  LayoutDashboard, Kanban, TrendingUp,
  Trash2, ExternalLink, LogOut, Edit2, Eye,
  Download, Plus, GripVertical, ChevronRight,
  AlertCircle, Wallet, Shield, Briefcase, ArrowUpAZ, ArrowDownAZ, Calendar as CalendarIcon, DollarSign as DollarIcon,
  Menu, X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

// NEW IMPORTS
import { useDashboardData } from './dashboard/hooks/useDashboardData';
import { STATUS_CONFIG, exportToCSV, getLast6MonthsData, type Lead } from './dashboard/types';
import { LeadDetailsModal } from './dashboard/components/modals/LeadDetailsModal';
import { CreateLeadModal } from './dashboard/components/modals/CreateLeadModal';
import { Toast, SidebarItem, KPICard, SimpleBarChart } from './dashboard/components/ui/DashboardComponents';

// --- ERROR BOUNDARY ---
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-900/50 text-white border border-red-500 rounded-xl m-8">
          <h2 className="text-xl font-bold mb-2">Une erreur est survenue dans le Dashboard</h2>
          <pre className="text-sm bg-black/50 p-4 rounded overflow-auto">{this.state.error?.message}</pre>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors">Recharger la page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const DashboardContent = () => {
  // Use Custom Hook for Logic
  const { 
      leads, partners, setPartners, loading, role, currentPartnerId, currentUserName,
      filteredLeads, stats, notifications, notify, removeNotification, 
      sortConfig, setSortConfig, actions 
  } = useDashboardData();

  // Local UI State
  const [activeView, setActiveView] = useState<'dashboard' | 'leads' | 'partners'>('dashboard');
  const [leadsViewMode, setLeadsViewMode] = useState<'list' | 'kanban'>('kanban');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingPartner, setEditingPartner] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Derived UI Data
  const chartData = getLast6MonthsData(filteredLeads);

  // Handlers UI specific
  const handleLogout = async () => {
      await supabase.auth.signOut();
      window.location.href = '/admin/login';
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
      e.dataTransfer.setData('leadId', id);
  };
  
  const handleDrop = (e: React.DragEvent, newStatus: string) => {
      e.preventDefault();
      const leadId = e.dataTransfer.getData('leadId');
      if (leadId) actions.updateLead(leadId, { status: newStatus });
  };

  const handleExportCSV = () => {
      const dataToExport = filteredLeads.map(l => ({
          Date: new Date(l.created_at).toLocaleDateString(),
          Nom: l.name,
          Email: l.email,
          Société: l.company || '',
          Type: l.project_type || '',
          Budget: l.budget || '',
          Statut: l.status,
          Montant: l.deal_amount || 0,
          Partenaire: partners.find(p => p.id === l.partner_id)?.name || ''
      }));
      exportToCSV(dataToExport, `fluxior-leads-${new Date().toISOString().slice(0,10)}.csv`);
      notify("Export téléchargé", "info");
  };

  // Partner Handlers
  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newPartner = {
      name: formData.get('name'),
      email: formData.get('email'),
      commission_rate: parseFloat(formData.get('commission') as string),
      role: formData.get('role') 
    };

    const { error } = await supabase.from('partners').insert([newPartner]);
    if (!error) { 
        const { data } = await supabase.from('partners').select('*');
        if(data) setPartners(data);
        form.reset(); 
        notify("Partenaire ajouté");
    } else {
        notify("Erreur création partenaire", "error");
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!window.confirm("Supprimer ce partenaire ?")) return;
    const { error } = await supabase.from('partners').delete().eq('id', id);
    if (!error) {
      setPartners(prev => prev.filter(p => p.id !== id));
      notify("Partenaire supprimé");
    } else {
      notify("Erreur suppression", "error");
    }
  };

  const handleUpdatePartnerRate = async (id: string, newRate: number) => {
    setPartners(prev => prev.map(p => p.id === id ? { ...p, commission_rate: newRate } : p));
    const { error } = await supabase.from('partners').update({ commission_rate: newRate }).eq('id', id);
    if (error) notify("Erreur mise à jour", "error");
    else notify("Taux mis à jour");
    setEditingPartner(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <div className="text-gray-400 text-sm animate-pulse">Chargement du dashboard...</div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0f172a] text-white overflow-hidden font-sans selection:bg-primary/30">
      <Toast notifications={notifications} removeNotification={removeNotification} />
      
      {selectedLead && (
        (() => {
            const liveLead = leads.find(l => l.id === selectedLead.id) || selectedLead;
            return <LeadDetailsModal lead={liveLead} onClose={() => setSelectedLead(null)} onUpdate={actions.updateLead} currentUser={currentUserName} />;
        })()
      )}
      {showCreateLead && <CreateLeadModal onClose={() => setShowCreateLead(false)} onCreated={() => { setShowCreateLead(false); notify("Lead créé avec succès"); }} createAction={actions.createLead} />}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-surface/95 backdrop-blur-xl border-r border-white/5 flex flex-col p-4 z-50 md:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br shadow-lg flex items-center justify-center text-white ${role === 'admin' ? 'from-primary to-purple-600 shadow-primary/20' : 'from-emerald-500 to-teal-500 shadow-emerald-500/20'}`}>
                    <span className="font-bold text-lg">F</span>
                  </div>
                  <div>
                    <span className="font-bold text-lg font-display block leading-none">Fluxior</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">{role === 'admin' ? 'Administration' : 'Partenaire'}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Fermer le menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1.5 flex-1">
                <SidebarItem icon={LayoutDashboard} label="Vue d'ensemble" active={activeView === 'dashboard'} onClick={() => { setActiveView('dashboard'); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={Kanban} label={role === 'admin' ? "Pipeline Leads" : "Mes Leads"} active={activeView === 'leads'} onClick={() => { setActiveView('leads'); setIsMobileMenuOpen(false); }} badge={filteredLeads.filter(l => l.status === 'new').length} />
                {role === 'admin' && (
                  <SidebarItem icon={Users} label="Partenaires" active={activeView === 'partners'} onClick={() => { setActiveView('partners'); setIsMobileMenuOpen(false); }} />
                )}
              </nav>

              <div className="p-4 space-y-2 border-t border-white/5 bg-black/10 rounded-xl mt-4">
                <button onClick={() => { window.open('/', '_blank'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <ExternalLink size={16} />
                  <span>Voir le site</span>
                </button>
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                  <LogOut size={16} />
                  <span>Déconnexion</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar Desktop */}
      <div className="w-64 bg-surface/30 border-r border-white/5 flex flex-col p-4 backdrop-blur-xl hidden md:flex z-20">
        <div className="flex items-center gap-3 px-4 py-6 mb-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br shadow-lg flex items-center justify-center text-white ${role === 'admin' ? 'from-primary to-purple-600 shadow-primary/20' : 'from-emerald-500 to-teal-500 shadow-emerald-500/20'}`}>
                <span className="font-bold text-lg">F</span>
            </div>
            <div>
                <span className="font-bold text-lg font-display block leading-none">Fluxior</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">{role === 'admin' ? 'Administration' : 'Partenaire'}</span>
            </div>
        </div>

        <nav className="space-y-1.5 flex-1">
            <SidebarItem icon={LayoutDashboard} label="Vue d'ensemble" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
            <SidebarItem icon={Kanban} label={role === 'admin' ? "Pipeline Leads" : "Mes Leads"} active={activeView === 'leads'} onClick={() => setActiveView('leads')} badge={filteredLeads.filter(l => l.status === 'new').length} />
            {role === 'admin' && (
                <SidebarItem icon={Users} label="Partenaires" active={activeView === 'partners'} onClick={() => setActiveView('partners')} />
            )}
        </nav>

        <div className="p-4 space-y-2 border-t border-white/5 bg-black/10 rounded-xl mt-4">
            <button onClick={() => window.open('/', '_blank')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <ExternalLink size={16} />
                <span>Voir le site</span>
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                <LogOut size={16} />
                <span>Déconnexion</span>
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-[url('/grid.svg')] bg-fixed bg-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#0f172a]/95 to-[#1e1b4b]/90 pointer-events-none -z-10"></div>
        <div className="max-w-[1600px] mx-auto p-4 md:p-8">
            
            <div className="md:hidden flex justify-between items-center mb-6 bg-surface/50 p-4 rounded-xl backdrop-blur-md border border-white/10">
                 <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Ouvrir le menu"
                 >
                    <Menu size={24} />
                 </button>
                 <div className="font-bold flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">F</div>
                    Fluxior
                 </div>
                 <button 
                    onClick={handleLogout}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Déconnexion"
                 >
                    <LogOut size={20} />
                 </button>
            </div>

            <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 font-display flex items-center gap-3">
                        {activeView === 'dashboard' && <><LayoutDashboard className="text-primary" /> Tableau de Bord</>}
                        {activeView === 'leads' && <><Kanban className="text-primary" /> {role === 'admin' ? "Pipeline Commercial" : "Mes Opportunités"}</>}
                        {activeView === 'partners' && <><Users className="text-primary" /> Réseau Partenaires</>}
                    </h1>
                    <p className="text-sm text-gray-400">
                        {role === 'admin' ? "Vue globale de l'agence et gestion de l'activité." : "Suivez vos commissions et vos apports d'affaires."}
                    </p>
                </div>
                
                {activeView === 'leads' && (
                    <div className="flex items-center gap-2 bg-surface/30 p-1 rounded-lg border border-white/5 overflow-x-auto">
                        <button onClick={() => setShowCreateLead(true)} className="bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-md transition-colors flex items-center gap-2 shadow-lg shadow-primary/20 mr-2 whitespace-nowrap">
                            <Plus size={16} />
                            <span className="text-sm font-bold">Nouveau</span>
                        </button>
                        
                        <div className="flex items-center gap-1 bg-black/20 rounded-md p-0.5 border border-white/5 mr-2">
                             <button 
                                onClick={() => setSortConfig(prev => ({ ...prev, key: 'date', direction: prev.key === 'date' && prev.direction === 'desc' ? 'asc' : 'desc' }))}
                                className={`p-2 rounded hover:bg-white/5 transition-all relative group ${sortConfig.key === 'date' ? 'text-primary' : 'text-gray-400'}`}
                                title="Trier par date"
                             >
                                <CalendarIcon size={16} />
                                {sortConfig.key === 'date' && (
                                    <div className="absolute -bottom-1 -right-1">{sortConfig.direction === 'asc' ? <ArrowUpAZ size={10} /> : <ArrowDownAZ size={10} />}</div>
                                )}
                             </button>
                             <button 
                                onClick={() => setSortConfig(prev => ({ ...prev, key: 'amount', direction: prev.key === 'amount' && prev.direction === 'desc' ? 'asc' : 'desc' }))}
                                className={`p-2 rounded hover:bg-white/5 transition-all relative group ${sortConfig.key === 'amount' ? 'text-emerald-400' : 'text-gray-400'}`}
                                title="Trier par montant"
                             >
                                <DollarIcon size={16} />
                                {sortConfig.key === 'amount' && (
                                    <div className="absolute -bottom-1 -right-1">{sortConfig.direction === 'asc' ? <ArrowUpAZ size={10} /> : <ArrowDownAZ size={10} />}</div>
                                )}
                             </button>
                        </div>

                        <div className="w-px h-6 bg-white/10 mx-1"></div>
                        <button onClick={() => setLeadsViewMode('list')} className={`p-2 rounded-md transition-all ${leadsViewMode === 'list' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`} title="Vue Liste">
                            <LayoutDashboard size={18} />
                        </button>
                        <button onClick={() => setLeadsViewMode('kanban')} className={`p-2 rounded-md transition-all ${leadsViewMode === 'kanban' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`} title="Vue Kanban">
                            <Kanban size={18} />
                        </button>
                        <div className="w-px h-6 bg-white/10 mx-1"></div>
                        <button onClick={handleExportCSV} className="p-2 text-gray-400 hover:text-emerald-400 transition-colors" title="Exporter CSV">
                            <Download size={18} />
                        </button>
                    </div>
                )}
            </header>

            {/* DASHBOARD VIEW */}
            {activeView === 'dashboard' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <KPICard title={role === 'admin' ? "CA Encaissé (Signé)" : "CA Apporté (Signé)"} value={`${stats.totalRevenue.toLocaleString()} €`} icon={role === 'admin' ? DollarSign : Briefcase} color="text-emerald-300" gradient="from-emerald-900/40 to-emerald-900/10" />
                        <KPICard title="Pipeline (En cours)" value={`${stats.pipelineValue.toLocaleString()} €`} icon={Target} color="text-blue-300" gradient="from-blue-900/40 to-blue-900/10" />
                        <KPICard title="Taux de Conversion" value={`${stats.conversionRate} %`} icon={TrendingUp} color="text-amber-300" gradient="from-amber-900/40 to-amber-900/10" />
                        <KPICard title={role === 'admin' ? "Commissions à payer" : "Mes Commissions"} value={`${stats.totalCommissions.toLocaleString()} €`} icon={role === 'admin' ? Users : Wallet} color="text-purple-300" gradient="from-purple-900/40 to-purple-900/10" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-surface/30 border border-white/5 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6"><TrendingUp size={18} className="text-primary" /> {role === 'admin' ? 'Revenus Réalisés' : 'Mes Gains'}</h3>
                            {stats.totalRevenue === 0 && stats.pipelineValue === 0 ? (
                                <div className="h-[150px] flex flex-col items-center justify-center text-gray-500 text-sm border border-dashed border-white/10 rounded-xl">
                                    <p>Pas encore de données financières.</p>
                                </div>
                            ) : (
                                <SimpleBarChart data={chartData} />
                            )}
                        </div>

                        <div className="bg-surface/30 border border-white/5 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white">Activité Récente</h3>
                                <button onClick={() => setActiveView('leads')} className="text-xs text-primary hover:underline flex items-center gap-1">Tout voir <ChevronRight size={12} /></button>
                            </div>
                            <div className="space-y-3 overflow-y-auto flex-1 max-h-[300px] pr-2 custom-scrollbar">
                                {filteredLeads.slice(0, 5).map(lead => (
                                    <div key={lead.id} onClick={() => setSelectedLead(lead)} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xs font-bold shadow-lg group-hover:scale-110 transition-transform">{lead.name.charAt(0)}</div>
                                            <div>
                                                <div className="text-sm font-medium group-hover:text-primary transition-colors">{lead.name}</div>
                                                <div className="text-xs text-gray-500">{lead.project_type}</div>
                                            </div>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[lead.status]?.color.split(' ')[0].replace('/20', '')}`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* LEADS VIEW */}
            {activeView === 'leads' && (
                <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-200px)] flex flex-col">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
                         {leadsViewMode === 'list' && (
                             <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
                                {['all', 'new', 'contacted', 'negotiation', 'signed'].map(status => (
                                    <button 
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${filterStatus === status ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-transparent border-white/10 text-gray-400 hover:text-white hover:border-white/30'}`}
                                    >
                                        {status === 'all' ? 'Tous' : STATUS_CONFIG[status]?.label || status}
                                    </button>
                                ))}
                            </div>
                         )}

                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input 
                                type="text" 
                                placeholder="Rechercher (nom, email...)" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-surface/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                            />
                        </div>
                    </div>

                    {leadsViewMode === 'list' ? (
                        <div className="bg-surface/30 rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm flex-1 flex flex-col">
                            <div className="overflow-auto flex-1">
                                <table className="w-full text-left min-w-[1000px]">
                                    <thead className="bg-white/5 text-xs uppercase text-gray-400 font-medium sticky top-0 backdrop-blur-md z-10">
                                        <tr>
                                            <th className="p-4 pl-6">Prospect</th>
                                            <th className="p-4">Détails Projet</th>
                                            <th className="p-4">Statut</th>
                                            {role === 'admin' && <th className="p-4">Partenaire</th>}
                                            <th className="p-4 text-right">Montant</th>
                                            <th className="p-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredLeads
                                            .filter(l => filterStatus === 'all' || l.status === filterStatus)
                                            .filter(l => l.email.toLowerCase().includes(searchTerm.toLowerCase()) || l.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map((lead) => (
                                            <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="p-4 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center font-bold text-white text-xs border border-white/10">
                                                            {lead.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white text-sm cursor-pointer hover:text-primary transition-colors" onClick={() => setSelectedLead(lead)}>{lead.name}</div>
                                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                                <span className="truncate max-w-[150px]">{lead.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-gray-300 border border-white/10 w-fit">
                                                            {lead.project_type || 'N/A'}
                                                        </span>
                                                        <span className="text-xs text-gray-500">{lead.budget || '-'}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <select 
                                                        value={lead.status}
                                                        onChange={(e) => actions.updateLead(lead.id, { status: e.target.value })}
                                                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/20 transition-colors ${STATUS_CONFIG[lead.status]?.color || 'text-gray-400'}`}
                                                    >
                                                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                                            <option key={key} value={key} className="bg-slate-800 text-gray-300">{config.label}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                {role === 'admin' && (
                                                    <td className="p-4">
                                                        <select 
                                                            value={lead.partner_id || ""}
                                                            onChange={(e) => actions.updateLead(lead.id, { partner_id: e.target.value || null })}
                                                            className="bg-transparent text-sm text-gray-400 focus:text-white focus:outline-none cursor-pointer hover:bg-white/5 rounded px-2 py-1 max-w-[120px] truncate border border-transparent hover:border-white/10 transition-colors"
                                                        >
                                                            <option value="">-- Direct --</option>
                                                            {partners.map(p => (
                                                                <option key={p.id} value={p.id} className="bg-slate-800">{p.name}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                )}
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <input 
                                                            type="number"
                                                            placeholder="0"
                                                            value={lead.deal_amount || ''}
                                                            onChange={(e) => actions.updateLead(lead.id, { deal_amount: parseFloat(e.target.value) })}
                                                            className="bg-transparent text-right w-20 text-sm text-emerald-400 font-bold focus:outline-none border-b border-transparent focus:border-emerald-500/50 placeholder-gray-700 transition-colors"
                                                        />
                                                        <span className="text-emerald-400 text-sm">€</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => setSelectedLead(lead)} className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><Eye size={16} /></button>
                                                        {role === 'admin' && (
                                                            <button onClick={() => actions.deleteLead(lead.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                            <div className="flex gap-4 h-full min-w-[1200px]">
                                {Object.entries(STATUS_CONFIG).map(([statusKey, config]) => (
                                    <div key={statusKey} className="flex-1 min-w-[280px] bg-white/5 rounded-2xl flex flex-col border border-white/5" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, statusKey)}>
                                        <div className={`p-3 border-b border-white/5 flex justify-between items-center ${config.color.split(' ')[0]} bg-opacity-10 rounded-t-2xl`}>
                                            <div className="flex items-center gap-2 font-bold text-sm"><config.icon size={14} /> {config.label}</div>
                                            <span className="bg-black/20 text-[10px] px-2 py-0.5 rounded-full">{filteredLeads.filter(l => l.status === statusKey).length}</span>
                                        </div>
                                        <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                                            {filteredLeads
                                                .filter(l => l.status === statusKey)
                                                .filter(l => l.email.toLowerCase().includes(searchTerm.toLowerCase()) || l.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                                .map(lead => (
                                                <div key={lead.id} draggable onDragStart={(e) => handleDragStart(e, lead.id)} onClick={() => setSelectedLead(lead)} className="bg-[#1e293b] p-3 rounded-xl border border-white/5 shadow-sm hover:border-primary/5 cursor-grab active:cursor-grabbing hover:shadow-lg hover:shadow-primary/5 transition-all group relative">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="font-bold text-sm text-white group-hover:text-primary transition-colors">{lead.name}</div>
                                                        <div className="flex items-center gap-1">
                                                            {role === 'admin' && (
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); actions.deleteLead(lead.id); }} 
                                                                    className="text-gray-600 hover:text-red-400 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                                    title="Supprimer"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            )}
                                                            <GripVertical size={12} className="text-gray-600" />
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-400 mb-2 truncate">{lead.email}</div>
                                                    <div className="flex flex-wrap gap-1 mb-3">
                                                        {lead.project_type && <span className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-gray-300">{lead.project_type}</span>}
                                                        {lead.source === 'wizard' && <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/10 rounded border border-purple-500/20 text-purple-300">Wizard</span>}
                                                    </div>
                                                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                                        <div className="text-xs text-emerald-400 font-medium">{lead.deal_amount ? `${lead.deal_amount} €` : lead.budget || '-'}</div>
                                                        <div className="flex items-center gap-2">
                                                            {lead.details?.tasks && lead.details.tasks.some(t => !t.completed) && (
                                                                <div className="text-[10px] text-amber-400 flex items-center gap-0.5"><AlertCircle size={10} /> {lead.details.tasks.filter(t => !t.completed).length}</div>
                                                            )}
                                                            <div className="text-[10px] text-gray-600">{new Date(lead.created_at).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                    {role === 'admin' && (
                                                        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                                                            <select value={lead.partner_id || ""} onChange={(e) => actions.updateLead(lead.id, { partner_id: e.target.value || null })} className="bg-black/30 text-[10px] text-gray-400 hover:text-white rounded px-2 py-1 border border-transparent hover:border-white/10 focus:outline-none w-full cursor-pointer appearance-none">
                                                                <option value="">👤 Non assigné</option>
                                                                {partners.map(p => (
                                                                    <option key={p.id} value={p.id} className="bg-slate-800">{p.role === 'Directeur Général' ? '👑 ' : '👤 '}{p.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* PARTNERS VIEW */}
            {activeView === 'partners' && role === 'admin' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                    <div className="lg:col-span-2 space-y-4">
                        {partners.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 bg-surface/30 rounded-2xl border border-white/5">Aucun partenaire trouvé</div>
                        ) : (
                            partners.map(partner => {
                            const partnerLeads = leads.filter(l => l.partner_id === partner.id);
                            const partnerSales = partnerLeads.reduce((acc, l) => acc + (l.deal_amount || 0), 0);
                            const partnerCommissions = partnerSales * (partner.commission_rate / 100);
                            const isEditing = editingPartner === partner.id;

                            return (
                                <div key={partner.id} className="bg-surface/30 p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between group hover:border-primary/30 transition-all gap-4 relative overflow-hidden">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg ${partner.role === 'Directeur Général' ? 'bg-purple-500/20 text-purple-400' : 'bg-surfaceHighlight text-gray-400 group-hover:text-white group-hover:bg-primary'}`}>
                                            {partner.role === 'Directeur Général' ? <Shield size={20} /> : <UserPlus size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">
                                                {partner.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">{partner.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-6 sm:gap-8 justify-between sm:justify-end bg-black/20 p-3 rounded-xl border border-white/5">
                                        <div className="text-right">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Leads</div>
                                            <div className="font-bold text-white">{partnerLeads.length}</div>
                                        </div>
                                        <div className="text-right border-l border-white/10 pl-6">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Commissions</div>
                                            <div className="font-bold text-purple-400">{partnerCommissions.toLocaleString()} €</div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 min-w-[80px] border-l border-white/10 pl-6">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Taux</div>
                                            {isEditing ? (
                                                <div className="flex items-center gap-1">
                                                    <input type="number" className="w-12 bg-black/40 border border-primary/50 rounded px-1 text-sm text-right focus:outline-none" defaultValue={partner.commission_rate} autoFocus onBlur={(e) => handleUpdatePartnerRate(partner.id, parseFloat(e.target.value))} onKeyDown={(e) => e.key === 'Enter' && handleUpdatePartnerRate(partner.id, parseFloat((e.target as HTMLInputElement).value))} />
                                                    <span className="text-xs">%</span>
                                                </div>
                                            ) : (
                                                <button onClick={() => setEditingPartner(partner.id)} className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-sm font-mono flex items-center gap-1 group/edit transition-colors">
                                                    {partner.commission_rate}%
                                                    <Edit2 size={10} className="opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                                                </button>
                                            )}
                                        </div>
                                        <button onClick={() => handleDeletePartner(partner.id)} className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors ml-2"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            );
                        }))}
                    </div>

                    <div>
                        <div className="bg-surface/30 p-6 rounded-2xl border border-white/5 sticky top-8 backdrop-blur-md">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Plus size={18} className="text-primary" /> Ajouter un partenaire</h3>
                            <form onSubmit={handleCreatePartner} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Nom complet</label>
                                    <input name="name" type="text" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" required placeholder="Ex: Jean Dupont" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Rôle</label>
                                    <select name="role" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none appearance-none">
                                        <option value="Apporteur d'affaires">Apporteur d'affaires</option>
                                        <option value="Commercial">Commercial</option>
                                        <option value="Directeur Général">Directeur Général</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Email</label>
                                    <input name="email" type="email" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" required placeholder="jean@example.com" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Commission (%)</label>
                                    <input name="commission" type="number" defaultValue="10" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" required />
                                </div>
                                <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl text-sm mt-4 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                                    <UserPlus size={16} /> Créer le compte
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export const AdminDashboard = () => {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
};
