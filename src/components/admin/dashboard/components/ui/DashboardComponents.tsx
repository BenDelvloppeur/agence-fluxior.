import React from 'react';
import { Check, X, Bell, TrendingUp } from 'lucide-react';
import type { Notification } from '../../types';

// --- TOAST ---
export const Toast = ({ notifications, removeNotification }: { notifications: Notification[], removeNotification: (id: string) => void }) => (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {notifications.map(notif => (
        <div 
          key={notif.id} 
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md animate-in slide-in-from-right-full duration-300 ${
            notif.type === 'success' ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200' : 
            notif.type === 'error' ? 'bg-red-950/80 border-red-500/50 text-red-200' :
            'bg-blue-950/80 border-blue-500/50 text-blue-200'
          }`}
        >
          {notif.type === 'success' ? <Check size={16} /> : notif.type === 'error' ? <X size={16} /> : <Bell size={16} />}
          <span className="text-sm font-medium">{notif.message}</span>
          <button onClick={() => removeNotification(notif.id)} className="ml-2 opacity-50 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
);

// --- SIDEBAR ITEM ---
export const SidebarItem = ({ icon: Icon, label, active, onClick, badge }: { icon: any, label: string, active: boolean, onClick: () => void, badge?: number }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
            active 
            ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/20 border border-white/10' 
            : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
        }`}
    >
        <div className="flex items-center gap-3">
            <Icon size={20} className={active ? 'text-white' : 'text-gray-500 group-hover:text-white transition-colors'} />
            <span className="font-medium text-sm hidden md:block">{label}</span>
        </div>
        {badge ? (
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full hidden md:block">
                {badge}
            </span>
        ) : null}
    </button>
);

// --- KPI CARD ---
export const KPICard = ({ title, value, icon: Icon, color, gradient, change }: { title: string, value: string, icon: any, color: string, gradient: string, change?: string }) => (
    <div className={`p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-32 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 bg-noise opacity-5"></div>
        <div className={`absolute top-4 right-4 p-2 rounded-lg bg-white/10 backdrop-blur-sm ${color}`}>
            <Icon size={20} />
        </div>
        <div className="text-sm text-gray-300 font-medium z-10">{title}</div>
        <div className="flex items-baseline gap-2 z-10">
            <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
            {change && <span className="text-xs text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 border border-emerald-500/20"><TrendingUp size={10} /> {change}</span>}
        </div>
    </div>
);

// --- SIMPLE CHART ---
export const SimpleBarChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return null;
  const maxValue = Math.max(...data.map(d => d.revenus), 1);
  const height = 150;
  
  return (
    <div className="w-full h-[200px] flex items-end justify-between gap-2 pt-8 relative">
       <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
          {[...Array(5)].map((_, i) => <div key={i} className="w-full h-px bg-white"></div>)}
       </div>
      {data.map((item, i) => {
        const barHeight = maxValue > 0 ? (item.revenus / maxValue) * height : 0;
        return (
          <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
            <div className="opacity-0 group-hover:opacity-100 absolute -top-4 bg-slate-800 text-white text-xs px-2 py-1 rounded border border-white/10 transition-opacity z-10 shadow-xl whitespace-nowrap">
                {item.revenus.toLocaleString()} €
            </div>
            <div 
                className="w-full max-w-[30px] md:max-w-[40px] bg-gradient-to-t from-primary/50 to-primary rounded-t-sm hover:from-primary hover:to-primary/80 transition-all relative group-hover:shadow-[0_0_15px_rgba(var(--color-primary),0.5)]" 
                style={{ height: `${barHeight}px` }}
            ></div>
            <span className="text-[10px] md:text-xs text-gray-400 font-medium">{item.name}</span>
          </div>
        );
      })}
    </div>
  );
};
