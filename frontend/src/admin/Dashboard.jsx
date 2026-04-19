import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import { Users, Package, Tag, ShoppingCart, IndianRupee, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react';
import Loader from '../components/Loader.jsx';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
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
    <div className="card p-12 text-center">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <p className="text-red-600 font-medium">{error}</p>
      <button onClick={() => window.location.reload()} className="btn-primary mt-4">Reload page</button>
    </div>
  );

  if (!stats) return <Loader />;

  const statCards = [
    { label: 'Total Revenue', value: `₹${(stats.revenue || 0).toLocaleString('en-IN')}`, icon: IndianRupee, gradient: 'from-green-500 to-emerald-700', sub: 'Lifetime earnings' },
    { label: 'Orders', value: stats.orders || 0, icon: ShoppingCart, gradient: 'from-saffron-500 to-saffron-700', sub: 'All time' },
    { label: 'Products', value: stats.products || 0, icon: Package, gradient: 'from-blue-500 to-blue-700', sub: 'In catalogue' },
    { label: 'Categories', value: stats.categories || 0, icon: Tag, gradient: 'from-purple-500 to-purple-700', sub: 'Active' },
    { label: 'Users', value: stats.users || 0, icon: Users, gradient: 'from-pink-500 to-rose-600', sub: 'Registered devotees' },
  ];

  const quickLinks = [
    { to: '/admin/products', label: 'Manage Products', icon: Package, cls: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
    { to: '/admin/categories', label: 'Manage Categories', icon: Tag, cls: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
    { to: '/admin/orders', label: 'View Orders', icon: ShoppingCart, cls: 'bg-saffron-50 text-saffron-700 hover:bg-saffron-100' },
    { to: '/admin/users', label: 'Manage Users', icon: Users, cls: 'bg-green-50 text-green-700 hover:bg-green-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="card p-6 bg-gradient-to-r from-maroon-900 to-maroon-800 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold">Welcome back 🙏</h2>
            <p className="text-saffron-200/80 mt-1">Here's your Devapi store overview for today.</p>
          </div>
          <div className="text-4xl opacity-30 font-devanagari">ॐ</div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map(({ label, value, icon: Icon, gradient, sub }) => (
          <div key={label} className={`rounded-2xl bg-gradient-to-br ${gradient} text-white p-5 shadow-soft relative overflow-hidden`}>
            <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full bg-white/10" />
            <Icon className="w-6 h-6 opacity-80 relative z-10" />
            <div className="mt-3 text-3xl font-bold relative z-10 leading-none">{value}</div>
            <div className="text-sm font-medium mt-1 relative z-10">{label}</div>
            <div className="text-xs opacity-60 mt-0.5 relative z-10">{sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-display text-lg font-bold text-maroon-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map(({ to, label, icon: Icon, cls }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-3 p-4 rounded-xl font-medium text-sm transition-colors ${cls}`}>
              <Icon className="w-5 h-5 shrink-0" />
              <span>{label}</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-saffron-100">
          <h3 className="font-display text-xl font-bold text-maroon-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-saffron-600" /> Recent Orders
          </h3>
          <Link to="/admin/orders"
            className="text-saffron-700 text-sm font-semibold hover:text-saffron-600 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {!stats.recentOrders?.length ? (
          <div className="p-10 text-center text-maroon-500 text-sm">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-maroon-500 text-xs uppercase bg-saffron-50/50">
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
                  <tr key={o._id} className="border-t border-saffron-100 hover:bg-saffron-50/40">
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-maroon-800">
                      #{o._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-400 to-maroon-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {o.user?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-medium text-maroon-900">{o.user?.name}</div>
                          <div className="text-xs text-maroon-400">{o.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-bold text-maroon-900">₹{o.total}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-700'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-maroon-500">
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
