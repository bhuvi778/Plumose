import { useEffect, useState } from 'react';
import api from '../api/client.js';
import toast from 'react-hot-toast';
import { RefreshCw, AlertCircle } from 'lucide-react';
import Loader from '../components/Loader.jsx';

const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border border-purple-200',
  delivered: 'bg-green-100 text-green-800 border border-green-200',
  cancelled: 'bg-red-100 text-red-800 border border-red-200',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await api.get('/orders/all');
      setOrders(r.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const update = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success('Status updated');
      load();
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <Loader />;

  if (error) return (
    <div className="card p-12 text-center">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
      <p className="text-red-600 font-medium">{error}</p>
      <button onClick={load} className="btn-primary mt-4 flex items-center gap-2 mx-auto"><RefreshCw className="w-4 h-4" /> Retry</button>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-maroon-900">Orders</h2>
          <p className="text-maroon-600 text-sm mt-1">{filtered.length} of {orders.length} orders</p>
        </div>
        <div className="flex gap-2">
          <select className="input" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <button onClick={load} className="btn-outline p-2.5"><RefreshCw className="w-4 h-4" /></button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-14 text-center">
          <div className="text-5xl mb-4">📦</div>
          <div className="font-display text-xl font-bold text-maroon-900">No orders found</div>
          <p className="text-maroon-500 mt-2 text-sm">Orders from customers will appear here.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-saffron-50 text-maroon-700 text-xs uppercase">
                <tr>
                  <th className="text-left p-3 pl-4">Order ID</th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">Items</th>
                  <th className="text-left p-3">Total</th>
                  <th className="text-left p-3">Payment</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o._id} className="border-t border-saffron-100 hover:bg-saffron-50/40">
                    <td className="p-3 pl-4 font-mono text-xs font-semibold text-maroon-800">#{o._id.slice(-8).toUpperCase()}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-400 to-maroon-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {o.user?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-medium text-maroon-900">{o.user?.name || 'Unknown'}</div>
                          <div className="text-xs text-maroon-400">{o.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center font-medium">{o.items?.length || 0}</td>
                    <td className="p-3 font-bold text-maroon-900">₹{o.total}</td>
                    <td className="p-3 capitalize text-maroon-700">{o.paymentMethod}</td>
                    <td className="p-3">
                      <select
                        value={o.status}
                        onChange={(e) => update(o._id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1.5 rounded-lg border-0 outline-none cursor-pointer capitalize ${STATUS_COLORS[o.status] || 'bg-gray-100'}`}
                      >
                        {statuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </td>
                    <td className="p-3 text-xs text-maroon-500">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
