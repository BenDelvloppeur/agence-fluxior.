import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Users, DollarSign, Package, LogOut, Trash2 } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  customer: string;
  total: number;
  status: 'En attente' | 'Expédiée' | 'Livrée';
  items: any[];
}

export const KalyAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders on mount and when opening dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const savedOrders = JSON.parse(localStorage.getItem('kaly_orders') || '[]');
      setOrders(savedOrders);
    }
  }, [isAuthenticated, isOpen]);

  // Listen for custom event to open admin login
  useEffect(() => {
    const handleOpenAdmin = () => setShowLoginModal(true);
    window.addEventListener('open-kaly-admin', handleOpenAdmin);
    return () => window.removeEventListener('open-kaly-admin', handleOpenAdmin);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setIsOpen(true);
      setPassword('');
    } else {
      alert('Mot de passe incorrect (Indice: admin)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsOpen(false);
  };

  const updateOrderStatus = (orderId: string) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const nextStatus = 
          order.status === 'En attente' ? 'Expédiée' :
          order.status === 'Expédiée' ? 'Livrée' : 'En attente';
        return { ...order, status: nextStatus };
      }
      return order;
    });
    setOrders(updatedOrders as Order[]);
    localStorage.setItem('kaly_orders', JSON.stringify(updatedOrders));
  };

  const clearData = () => {
    if (confirm('Voulez-vous vraiment supprimer toutes les commandes ?')) {
      localStorage.removeItem('kaly_orders');
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
        <div className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <h3 className="font-['Playfair_Display'] font-bold text-2xl mb-1">Administration</h3>
              <p className="text-gray-500 text-sm">Veuillez vous identifier</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Mot de passe</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-600 transition-colors" 
                  placeholder="•••••"
                />
                <p className="text-[10px] text-gray-400 mt-1 italic">Indice: admin</p>
              </div>
              <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors">
                Connexion
              </button>
            </form>
            <button onClick={() => setShowLoginModal(false)} className="mt-4 text-xs text-gray-400 underline w-full text-center hover:text-black">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Admin Dashboard Overlay */}
      {isOpen && isAuthenticated && (
        <div className="fixed inset-0 z-[155] bg-[#F5F5F0] overflow-y-auto font-sans text-slate-800">
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 p-6 hidden md:flex flex-col fixed h-full">
              <h2 className="font-['Playfair_Display'] font-black italic text-2xl mb-10">
                Kaly<span className="text-pink-600 not-italic">.</span>
                <br/>
                <span className="text-xs text-gray-400 font-sans tracking-widest uppercase not-italic font-normal">Admin Panel</span>
              </h2>
              
              <nav className="space-y-2 flex-1">
                <a href="#" className="flex items-center gap-3 px-4 py-3 bg-pink-50 text-pink-600 rounded-xl font-bold text-sm">
                  <Package className="w-5 h-5" />
                  Commandes
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-bold text-sm transition-colors">
                  <Users className="w-5 h-5" />
                  Clients
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-bold text-sm transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                  Produits
                </a>
              </nav>

              <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black mt-auto px-4 py-3">
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 p-8 pt-20">
              <header className="flex justify-between items-center mb-10">
                <h1 className="font-['Playfair_Display'] text-3xl font-bold">Gestion des Commandes</h1>
                <div className="flex items-center gap-4">
                  <div className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2 border border-gray-100">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-bold">En ligne</span>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </header>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Chiffre d'affaires</p>
                    <DollarSign className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="font-['Playfair_Display'] text-3xl font-bold">{stats.revenue.toFixed(2)} €</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                   <div className="flex justify-between items-start mb-4">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Commandes en attente</p>
                    <Package className="w-5 h-5 text-pink-500" />
                  </div>
                  <p className="font-['Playfair_Display'] text-3xl font-bold text-pink-600">{stats.pending}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                   <div className="flex justify-between items-start mb-4">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Panier Moyen</p>
                    <ShoppingBag className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="font-['Playfair_Display'] text-3xl font-bold">{stats.avgCart.toFixed(2)} €</p>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-lg">Commandes Récentes</h3>
                  <button onClick={clearData} className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Réinitialiser
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-6 py-4 font-bold tracking-wider">ID</th>
                        <th className="px-6 py-4 font-bold tracking-wider">Client</th>
                        <th className="px-6 py-4 font-bold tracking-wider">Date</th>
                        <th className="px-6 py-4 font-bold tracking-wider">Total</th>
                        <th className="px-6 py-4 font-bold tracking-wider">Statut</th>
                        <th className="px-6 py-4 font-bold tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                            Aucune commande pour le moment.
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-bold font-mono">{order.id}</td>
                            <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                            <td className="px-6 py-4 text-gray-500">{order.date}</td>
                            <td className="px-6 py-4 font-bold">{order.total.toFixed(2)} €</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider 
                                ${order.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' : 
                                  order.status === 'Expédiée' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-green-100 text-green-800'}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => updateOrderStatus(order.id)}
                                className="text-xs font-bold text-black border-b border-black hover:text-pink-600 hover:border-pink-600 transition-colors"
                              >
                                Changer statut
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
