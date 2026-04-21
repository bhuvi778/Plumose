import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import { Users, Package, Tag, ShoppingCart, IndianRupee, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react';
import Loader from '../components/Loader.jsx';

const STATUS_BADGE = {
  pending: 'bg-concrete text-ink border border-ink/20',
  confirmed: 'bg-concrete text-ink border border-ink/20',
  shipped: 'bg-ink text-concrete',
  delivered: 'bg-ink text-concrete',
  cancelled: 'bg-accent text-white',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/admin/stats')
      .then((r) => setStats(r.data))
      .catch(() => setError('Failed to load dashboard statistics.'));
  }, []);

  if (error) return (
    <div className="border border-ink p-12 text-center">
      <AlertCircle className="w-12 h-12 text-accent mx-auto mb-4" />
      <p className="text-accent font-mono text-sm">{error}</p>
      <button onClick={() => window.location.reload()} className="btn-brutal mt-4">Reload page</button>
    </div>
  );

  if (!stats) return <Loader />;

  const statCards = [
    { label: 'Revenue', value: `₹${(stats.revenue || 0).toLocaleString('en-IN')}`, icon: IndianRupee, sub: 'Lifetime earnings' },
    { label: 'Orders', value: stats.orders || 0, icon: ShoppingCart, sub: 'All time' },
    { label: 'Products', value: stats.products || 0, icon: Package, sub: 'In catalogue' },
    { label: 'Categories', value: stats.categories || 0, icon: Tag, sub: 'Active' },
    { label: 'Users', value: stats.users || 0, icon: Users, sub: 'Registered' },
  ];

  const quickLinks = [
    { to: '/admin/products', label: 'Manage Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: Tag },
    { to: '/admin/orders', label: 'View Orders', icon: ShoppingCart },
    { to: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border border-ink p-8">
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink/40 mb-2">Admin / Overview</div>
        <h1 className="text-4xl uppercase tracking-tighter leading-[0.9]" style={{ fontFamily: 'Anton, Impact, sans-serif' }}>Dashboard</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-ink">
        {statCards.map(({ label, value, icon: Icon, sub }) => (
          <div key={label} className="bg-concrete p-6">
            <Icon className="w-4 h-4 text-ink/40 mb-4" />
            <div className="text-3xl font-mono font-bold text-ink leading-none">{value}</div>
            <div className="text-[10px] uppercase tracking-widest text-ink font-bold mt-2">{label}</div>
            <div className="text-[10px] text-ink/40 mt-0.5 font-mono">{sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink/40 mb-3">Quick Actions</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className="flex items-center gap-3 p-4 border border-ink text-ink font-bold text-sm hover:bg-ink hover:text-concrete transition-colors duration-150">
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              <ArrowRight className="w-3 h-3 ml-auto" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="border border-ink">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink/40 flex items-center gap-2">
            <TrendingUp className="w-3 h-3" /> Recent Orders
          </div>
          <Link to="/admin/orders" className="text-[10px] font-mono uppercase tracking-widest text-ink/40 hover:text-ink flex items-center gap-1 link-strike">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {!stats.recentOrders?.length ? (
          <div className="p-10 text-center font-mono text-sm text-ink/40">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-ink/40 text-[10px] uppercase tracking-widest font-mono bg-ink/5">
                <tr>
                  <th className="text-left px-5 py-3">Order</th>
                  <th className="text-left px-5 py-3">Customer</th>
                  <th className="text-left px-5 py-3">Total</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr key={o._id} className="border-t border-ink/10 hover:bg-ink/5">
                    <td className="px-5 py-3 font-mono text-xs font-bold text-ink">#{o._id.slice(-8).toUpperCase()}</td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-ink text-sm">{o.user?.name}</div>
                      <div className="text-xs text-ink/40 font-mono">{o.user?.email}</div>
                    </td>
                    <td className="px-5 py-3 font-mono font-bold text-ink">₹{o.total}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider capitalize ${STATUS_BADGE[o.status] || 'bg-concrete text-ink border border-ink/20'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-ink/40 font-mono">
                      {new Date(o.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
