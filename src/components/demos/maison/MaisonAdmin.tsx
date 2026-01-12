import React, { useState, useEffect } from 'react';
import { X, ShoppingBasket, Users, DollarSign, Package, LogOut, Trash2, CheckCircle, Clock } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  customer: string;
  total: number;
  status: 'En attente' | 'Prête' | 'Livrée';
  items: any[];
}

export const MaisonAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      const loadOrders = () => {
        const savedOrders = JSON.parse(localStorage.getItem('maison_orders') || '[]');
        setOrders(savedOrders);
      };
      loadOrders();
      window.addEventListener('storage-maison', loadOrders); // Custom event listener
      return () => window.removeEventListener('storage-maison', loadOrders);
    }
  }, [isAuthenticated, isOpen]);

  useEffect(() => {
    const handleOpenAdmin = () => setShowLoginModal(true);
    window.addEventListener('open-maison-admin', handleOpenAdmin);
    return () => window.removeEventListener('open-maison-admin', handleOpenAdmin);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'chef') { // Different password for immersion
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setIsOpen(true);
      setPassword('');
    } else {
      alert('Mot de passe incorrect (Indice: chef)');
    }
  };

  const updateOrderStatus = (orderId: string) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const nextStatus = 
          order.status === 'En attente' ? 'Prête' :
          order.status === 'Prête' ? 'Livrée' : 'En attente';
        return { ...order, status: nextStatus };
      }
      return order;
    });
    setOrders(updatedOrders as Order[]);
    localStorage.setItem('maison_orders', JSON.stringify(updatedOrders));
  };

  const clearData = () => {
    if (confirm('Vider l\'historique des commandes ?')) {
      localStorage.removeItem('maison_orders');
      setOrders([]);
    }
  };

  const stats = {
    revenue: orders.reduce((acc, o) => acc + o.total, 0),
    pending: orders.filter(o => o.status === 'En attente').length,
    avgCart: orders.length > 0 ? orders.reduce((acc, o) => acc + o.total, 0) / orders.length : 0
  };

  if (!showLoginModal && !isOpen) return null;

  return (
    <>
      {/* Login Modal */}
      {showLoginModal && !isAuthenticated && (
        <div className="fixed inset-0 z-[160] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] p-8 rounded-sm border border-[#d4af37]/30 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="font-['Cinzel'] font-bold text-2xl text-[#d4af37] mb-1">Espace Artisan</h3>
              <p className="text-gray-400 text-sm">Accès réservé au personnel</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#a3a3a3]">Code d'accès</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#262626] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors" 
                  placeholder="••••"
                />
                <p className="text-[10px] text-gray-500 mt-1 italic">Indice: chef</p>
              </div>
              <button type="submit" className="w-full bg-[#d4af37] text-[#1a1a1a] py-3 rounded-sm font-bold uppercase tracking-widest hover:bg-white transition-colors">
                Entrer
              </button>
            </form>
            <button onClick={() => setShowLoginModal(false)} className="mt-4 text-xs text-gray-500 underline w-full text-center hover:text-white">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Admin Dashboard Overlay */}
      {isOpen && isAuthenticated && (
        <div className="fixed inset-0 z-[155] bg-[#121212] overflow-y-auto font-sans text-[#e5e5e5]">
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-[#1a1a1a] border-r border-white/5 p-6 hidden md:flex flex-col fixed h-full">
              <h2 className="font-['Cinzel'] text-xl font-bold mb-10 text-center border-b border-white/5 pb-4">
                Maison <span className="text-[#d4af37]">TRADITION</span>
              </h2>
              
              <nav className="space-y-2 flex-1">
                <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 rounded-sm font-bold text-sm">
                  <Package className="w-5 h-5" />
                  Commandes
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-sm font-bold text-sm transition-colors">
                  <Users className="w-5 h-5" />
                  Clients
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-sm font-bold text-sm transition-colors">
                  <ShoppingBasket className="w-5 h-5" />
                  Catalogue
                </a>
              </nav>

              <button onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white mt-auto px-4 py-3">
                <LogOut className="w-5 h-5" />
                Fermer
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 p-8 pt-20">
              <header className="flex justify-between items-center mb-10">
                <h1 className="font-['Cinzel'] text-3xl font-bold text-white">Carnet de Commandes</h1>
                <div className="flex items-center gap-4">
                   <div className="bg-[#262626] border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-bold text-gray-300">Service Ouvert</span>
                  </div>
                </div>
              </header>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-[#1a1a1a] p-6 rounded-sm border border-white/5">
                  <p className="text-[#a3a3a3] text-xs font-bold uppercase tracking-wider mb-2">Chiffre du jour</p>
                  <p className="font-serif text-3xl font-bold text-[#d4af37]">{stats.revenue.toFixed(2)} €</p>
                </div>
                <div className="bg-[#1a1a1a] p-6 rounded-sm border border-white/5">
                  <p className="text-[#a3a3a3] text-xs font-bold uppercase tracking-wider mb-2">À préparer</p>
                  <p className="font-serif text-3xl font-bold text-white">{stats.pending}</p>
                </div>
                <div className="bg-[#1a1a1a] p-6 rounded-sm border border-white/5">
                  <p className="text-[#a3a3a3] text-xs font-bold uppercase tracking-wider mb-2">Panier Moyen</p>
                  <p className="font-serif text-3xl font-bold text-gray-300">{stats.avgCart.toFixed(2)} €</p>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-[#1a1a1a] rounded-sm border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <h3 className="font-bold text-lg font-serif text-[#d4af37]">Dernières Réservations</h3>
                  <button onClick={clearData} className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 border-b border-red-900 pb-0.5">
                    <Trash2 className="w-3 h-3" /> Effacer tout
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#262626] text-xs uppercase text-[#a3a3a3]">
                      <tr>
                        <th className="px-6 py-4 font-bold tracking-wider">Réf</th>
                        <th className="px-6 py-4 font-bold tracking-wider">Client</th>
                        <th className="px-6 py-4 font-bold tracking-wider">Détail</th>
                        <th className="px-6 py-4 font-bold tracking-wider">Total</th>
                        <th className="px-6 py-4 font-bold tracking-wider">État</th>
                        <th className="px-6 py-4 font-bold tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-600 italic">
                            Le carnet est vide pour le moment.
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-mono text-[#d4af37]">{order.id}</td>
                            <td className="px-6 py-4 font-bold text-white">{order.customer}</td>
                            <td className="px-6 py-4 text-gray-500 text-xs">{order.items.length} articles</td>
                            <td className="px-6 py-4 font-bold">{order.total.toFixed(2)} €</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider 
                                ${order.status === 'En attente' ? 'bg-yellow-900/30 text-yellow-500 border border-yellow-500/20' : 
                                  order.status === 'Prête' ? 'bg-blue-900/30 text-blue-400 border border-blue-400/20' : 
                                  'bg-green-900/30 text-green-400 border border-green-400/20'}`}>
                                {order.status === 'En attente' && <Clock className="w-3 h-3" />}
                                {order.status === 'Livrée' && <CheckCircle className="w-3 h-3" />}
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => updateOrderStatus(order.id)}
                                className="text-xs font-bold text-[#d4af37] hover:text-white transition-colors border-b border-[#d4af37]/30 hover:border-white pb-0.5"
                              >
                                Avancer &gt;
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
