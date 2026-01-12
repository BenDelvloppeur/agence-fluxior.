import React, { useState, useRef } from 'react';
import { 
    X, Check, Mail, Phone, Building, Calendar, Clock, 
    Settings, Palette, MessageSquare, Plus, Trash2, Send, CheckSquare,
    History, ArrowRight, User, ChevronDown, ChevronUp, Edit, Save
} from 'lucide-react';
import type { Lead, LeadNote, LeadTask, LeadActivity } from '../../types';
import { STATUS_CONFIG } from '../../types';

interface LeadDetailsModalProps {
    lead: Lead;
    onClose: () => void;
    onUpdate: (id: string, updates: Partial<Lead>) => void;
    currentUser: string;
}

const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
};

const ExpandableNote = ({ note }: { note: LeadNote }) => {
    const [expanded, setExpanded] = useState(false);
    const isLong = note.content.length > 150 || note.content.split('\n').length > 3;

    return (
        <div className="bg-surface/30 p-3 rounded-lg border border-white/5 text-sm animate-in slide-in-from-bottom-2">
            <div className={`text-gray-300 mb-2 whitespace-pre-wrap transition-all ${!expanded ? 'line-clamp-3' : ''}`}>
                {note.content}
            </div>
            
            {isLong && (
                <button 
                    onClick={() => setExpanded(!expanded)} 
                    className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1 mb-2 font-medium"
                >
                    {expanded ? <><ChevronUp size={10} /> Réduire</> : <><ChevronDown size={10} /> Voir plus</>}
                </button>
            )}

            <div className="flex justify-between items-center text-[10px] text-gray-500 pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary border border-primary/30">
                        {getInitials(note.author)}
                    </div>
                    <span>{note.author}</span>
                </div>
                <span>{new Date(note.date).toLocaleDateString()}</span>
            </div>
        </div>
    );
};

export const LeadDetailsModal = ({ lead, onClose, onUpdate, currentUser }: LeadDetailsModalProps) => {
    const isWizard = lead.source === 'wizard';
    const details = lead.details || {};
    const [note, setNote] = useState("");
    const [activeTab, setActiveTab] = useState<'info' | 'tasks' | 'history'>('info');
    const [newTaskContent, setNewTaskContent] = useState("");
    const [newTaskDate, setNewTaskDate] = useState("");
    const notesContainerRef = useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedLead, setEditedLead] = useState<Partial<Lead>>({});

    const handleAddNote = () => {
        if (!note.trim()) return;
        const newNote: LeadNote = {
            id: Math.random().toString(36).substr(2, 9),
            content: note,
            date: new Date().toISOString(),
            author: currentUser
        };
        
        // Log activity also
        const newActivity: LeadActivity = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'note_added',
            description: 'Note ajoutée',
            date: new Date().toISOString(),
            user: currentUser
        };

        const updatedNotes = [newNote, ...(details.notes || [])];
        const updatedHistory = [newActivity, ...(details.history || [])];

        onUpdate(lead.id, { 
            details: { 
                ...details, 
                notes: updatedNotes,
                history: updatedHistory
            } 
        });
        setNote("");
        setTimeout(() => {
            if(notesContainerRef.current) notesContainerRef.current.scrollTop = notesContainerRef.current.scrollHeight;
        }, 100);
    };

    const handleAddTask = () => {
        if(!newTaskContent.trim()) return;
        const newTask: LeadTask = {
            id: Math.random().toString(36).substr(2, 9),
            content: newTaskContent,
            dueDate: newTaskDate || new Date().toISOString(),
            completed: false,
            createdAt: new Date().toISOString()
        };
        const updatedTasks = [...(details.tasks || []), newTask];
        onUpdate(lead.id, { details: { ...details, tasks: updatedTasks } });
        setNewTaskContent("");
        setNewTaskDate("");
    };

    const toggleTask = (taskId: string) => {
        const updatedTasks = (details.tasks || []).map(t => 
            t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        onUpdate(lead.id, { details: { ...details, tasks: updatedTasks } });
    };

    const deleteTask = (taskId: string) => {
        const updatedTasks = (details.tasks || []).filter(t => t.id !== taskId);
        onUpdate(lead.id, { details: { ...details, tasks: updatedTasks } });
    };

    const startEditing = () => {
        setEditedLead({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            company: lead.company,
            project_type: lead.project_type,
            deal_amount: lead.deal_amount
        });
        setIsEditing(true);
    };

    const saveChanges = () => {
        onUpdate(lead.id, editedLead);
        setIsEditing(false);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setEditedLead({});
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] h-[90vh] overflow-hidden shadow-2xl flex flex-col relative" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-start bg-[#1e293b] shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={editedLead.name || ""} 
                                    onChange={(e) => setEditedLead({...editedLead, name: e.target.value})}
                                    className="bg-black/20 border border-white/10 rounded px-2 py-1 text-xl font-bold text-white focus:outline-none focus:border-primary/50"
                                />
                            ) : (
                                <h2 className="text-2xl font-bold text-white">{lead.name}</h2>
                            )}
                            <span className={`text-[10px] px-2 py-0.5 rounded border ${STATUS_CONFIG[lead.status]?.color}`}>
                                {STATUS_CONFIG[lead.status]?.label}
                            </span>
                        </div>
                        <div className="text-gray-400 text-sm flex items-center gap-4">
                             <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(lead.created_at).toLocaleDateString()}</span>
                             <span className="flex items-center gap-1"><Clock size={14} /> {new Date(lead.created_at).toLocaleTimeString()}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {activeTab === 'info' && (
                             isEditing ? (
                                <div className="flex gap-2 mr-2">
                                    <button onClick={saveChanges} className="p-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg transition-colors" title="Sauvegarder">
                                        <Save size={18} />
                                    </button>
                                    <button onClick={cancelEditing} className="p-2 bg-white/5 text-gray-400 hover:bg-white/10 rounded-lg transition-colors" title="Annuler">
                                        <X size={18} />
                                    </button>
                                </div>
                             ) : (
                                <button onClick={startEditing} className="p-2 mr-2 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Modifier">
                                    <Edit size={18} />
                                </button>
                             )
                        )}
                        <div className="flex bg-black/20 p-1 rounded-lg border border-white/5">
                            <button 
                                onClick={() => setActiveTab('info')} 
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'info' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Infos
                            </button>
                            <button 
                                onClick={() => setActiveTab('tasks')} 
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-2 ${activeTab === 'tasks' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Tâches
                                {details.tasks && details.tasks.filter(t => !t.completed).length > 0 && (
                                    <span className="bg-white/20 text-white px-1.5 rounded-full text-[9px]">{details.tasks.filter(t => !t.completed).length}</span>
                                )}
                            </button>
                             <button 
                                onClick={() => setActiveTab('history')} 
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-2 ${activeTab === 'history' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Historique
                            </button>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
                    {/* Left Column */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 border-r border-white/5 custom-scrollbar">
                        {activeTab === 'info' && (
                            <InfoTab 
                                lead={lead} 
                                details={details} 
                                isWizard={isWizard} 
                                isEditing={isEditing} 
                                editedLead={editedLead} 
                                setEditedLead={setEditedLead} 
                            />
                        )}
                        {activeTab === 'tasks' && (
                            <TasksTab 
                                tasks={details.tasks || []} 
                                newTaskContent={newTaskContent}
                                setNewTaskContent={setNewTaskContent}
                                newTaskDate={newTaskDate}
                                setNewTaskDate={setNewTaskDate}
                                handleAddTask={handleAddTask}
                                toggleTask={toggleTask}
                                deleteTask={deleteTask}
                            />
                        )}
                        {activeTab === 'history' && <HistoryTab history={details.history || []} />}
                    </div>

                    {/* Right Column: Notes */}
                    <div className="md:w-80 bg-[#162032] flex flex-col h-full min-h-0 border-t md:border-t-0 md:border-l border-white/5 shrink-0">
                        <div className="p-4 border-b border-white/5 shrink-0">
                             <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold">Notes & Suivi</h3>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 custom-scrollbar" ref={notesContainerRef}>
                            {details.notes && details.notes.length > 0 ? (
                                details.notes.map((n: LeadNote) => (
                                    <ExpandableNote key={n.id} note={n} />
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-600 text-xs italic">
                                    Aucune note pour le moment.
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-[#111a2b] border-t border-white/5 shrink-0 z-10">
                            <div className="relative">
                                <textarea 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pr-10 text-sm text-white focus:outline-none focus:border-primary/50 resize-none h-20 custom-scrollbar"
                                    placeholder="Ajouter une note..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    onKeyDown={(e) => {
                                        if(e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAddNote();
                                        }
                                    }}
                                />
                                <button 
                                    onClick={handleAddNote}
                                    disabled={!note.trim()}
                                    className="absolute bottom-2 right-2 p-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-components
const HistoryTab = ({ history }: { history: LeadActivity[] }) => (
    <div className="relative border-l border-white/10 ml-3 space-y-8 py-2">
        {history && history.length > 0 ? history.map((activity, idx) => (
             <div key={activity.id || idx} className="relative pl-6 animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full border border-[#0f172a] z-10 ${
                    activity.type === 'status_change' ? 'bg-blue-400' :
                    activity.type === 'note_added' ? 'bg-yellow-400' :
                    activity.type === 'created' ? 'bg-emerald-400' :
                    'bg-gray-400'
                }`}></div>
                
                <div className="bg-surface/30 p-3 rounded-lg border border-white/5 text-sm group hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary border border-primary/30">
                                {getInitials(activity.user)}
                            </div>
                            <span className="font-medium text-gray-300 text-xs">{activity.user}</span>
                        </div>
                        <span className="text-[10px] text-gray-500">
                            {new Date(activity.date).toLocaleDateString()} {new Date(activity.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                    <div className="text-gray-400 text-xs pl-7">
                        {activity.description}
                    </div>
                </div>
            </div>
        )) : (
            <div className="pl-6 text-gray-500 text-sm italic">Aucun historique disponible.</div>
        )}
    </div>
);

const InfoTab = ({ lead, details, isWizard, isEditing, editedLead, setEditedLead }: any) => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"/> Contact</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors"><Mail size={16} /></div>
                        {isEditing ? (
                            <input 
                                type="email"
                                value={editedLead.email || ""}
                                onChange={(e) => setEditedLead({...editedLead, email: e.target.value})}
                                className="bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-white w-full focus:outline-none focus:border-primary/50"
                                placeholder="Email"
                            />
                        ) : (
                            <a href={`mailto:${lead.email}`} className="text-gray-300 hover:text-white transition-colors text-sm truncate">{lead.email}</a>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors"><Phone size={16} /></div>
                        {isEditing ? (
                             <input 
                                type="text"
                                value={editedLead.phone || ""}
                                onChange={(e) => setEditedLead({...editedLead, phone: e.target.value})}
                                className="bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-white w-full focus:outline-none focus:border-primary/50"
                                placeholder="Téléphone"
                            />
                        ) : (
                            lead.phone ? (
                                <a href={`tel:${lead.phone}`} className="text-gray-300 hover:text-white transition-colors text-sm">{lead.phone}</a>
                            ) : <span className="text-gray-500 text-xs italic">Pas de téléphone</span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors"><Building size={16} /></div>
                        {isEditing ? (
                             <input 
                                type="text"
                                value={editedLead.company || ""}
                                onChange={(e) => setEditedLead({...editedLead, company: e.target.value})}
                                className="bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-white w-full focus:outline-none focus:border-primary/50"
                                placeholder="Entreprise"
                            />
                        ) : (
                            <div className="text-gray-300 text-sm">{lead.company || <span className="text-gray-500 text-xs italic">Pas d'entreprise</span>}</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Projet</h3>
                <div className="space-y-3">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                        <span className="text-gray-500 text-xs block mb-1">Type</span>
                        {isEditing ? (
                             <input 
                                type="text"
                                value={editedLead.project_type || ""}
                                onChange={(e) => setEditedLead({...editedLead, project_type: e.target.value})}
                                className="bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-white w-full focus:outline-none focus:border-primary/50"
                                placeholder="Type de projet"
                            />
                        ) : (
                             <span className="text-white font-medium text-sm">{lead.project_type || 'Non spécifié'}</span>
                        )}
                    </div>
                    
                    {/* BUDGET UNIFIÉ (KPI) */}
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                        <span className="text-gray-500 text-xs block mb-1">Budget estimé (€)</span>
                        {isEditing ? (
                             <div className="flex items-center gap-2">
                                <input 
                                    type="number"
                                    value={editedLead.deal_amount || 0}
                                    onChange={(e) => setEditedLead({...editedLead, deal_amount: parseFloat(e.target.value)})}
                                    className="bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-white w-full focus:outline-none focus:border-primary/50 font-mono text-right"
                                    placeholder="0"
                                />
                                <span className="text-gray-400 text-sm">€</span>
                             </div>
                        ) : (
                            <div className="flex flex-col">
                                <span className="text-emerald-400 font-bold text-sm font-mono">
                                    {lead.deal_amount ? `${lead.deal_amount} €` : (lead.budget ? `${lead.budget} (txt)` : '-')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {isWizard && (
            <div className="space-y-4 bg-gradient-to-br from-white/5 to-transparent p-5 rounded-xl border border-white/5">
                <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2 flex items-center gap-2"><Settings size={14} /> Contexte Technique</h3>
                {details.goals && details.goals.length > 0 && (
                    <div className="mb-4">
                        <span className="text-xs text-gray-500 block mb-2">Objectifs :</span>
                        <div className="flex flex-wrap gap-2">
                            {details.goals.map((g: string) => (
                                <span key={g} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-md border border-primary/20">{g}</span>
                            ))}
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                    {details.designStyle && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Palette size={16} className="text-pink-400" /> 
                            <span className="capitalize">{details.designStyle}</span>
                        </div>
                    )}
                    {details.deadline && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Clock size={16} className="text-orange-400" /> 
                            <span className="capitalize">{details.deadline}</span>
                        </div>
                    )}
                </div>
            </div>
        )}

        <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold flex items-center gap-2">
                <MessageSquare size={14} />
                {isWizard ? "Détails supplémentaires" : "Message initial"}
            </h3>
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                {lead.message || details.additional_details || "Aucun message supplémentaire."}
            </div>
        </div>
    </>
);

const TasksTab = ({ tasks, newTaskContent, setNewTaskContent, newTaskDate, setNewTaskDate, handleAddTask, toggleTask, deleteTask }: any) => (
    <div className="space-y-6">
        <div className="flex gap-2">
            <input 
                type="text" 
                placeholder="Nouvelle tâche à faire..."
                value={newTaskContent}
                onChange={(e) => setNewTaskContent(e.target.value)}
                className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <input 
                type="date"
                value={newTaskDate}
                onChange={(e) => setNewTaskDate(e.target.value)}
                className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
            />
            <button onClick={handleAddTask} disabled={!newTaskContent} className="bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50">
                <Plus size={18} />
            </button>
        </div>

        <div className="space-y-3">
            {tasks && tasks.length > 0 ? (
                tasks.sort((a: any,b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map((task: any) => (
                    <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${task.completed ? 'bg-white/5 border-white/5 opacity-60' : 'bg-surface/30 border-white/10'}`}>
                        <button onClick={() => toggleTask(task.id)} className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.completed ? 'bg-primary border-primary text-white' : 'border-gray-500 hover:border-white'}`}>
                            {task.completed && <Check size={12} />}
                        </button>
                        <div className="flex-1">
                            <p className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{task.content}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] flex items-center gap-1 ${new Date(task.dueDate) < new Date() && !task.completed ? 'text-red-400' : 'text-gray-500'}`}>
                                    <Calendar size={10} /> {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <button onClick={() => deleteTask(task.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-gray-500 text-sm">
                    <CheckSquare size={40} className="mx-auto mb-2 opacity-20" />
                    Aucune tâche pour ce lead.
                </div>
            )}
        </div>
    </div>
);
