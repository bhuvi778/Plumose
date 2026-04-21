import { useEffect, useState } from 'react';
import api from '../api/client.js';
import toast from 'react-hot-toast';
import { RefreshCw, AlertCircle } from 'lucide-react';
import Loader from '../components/Loader.jsx';

const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_BADGE = {
  pending: 'border border-ink/30 text-ink/60',
  confirmed: 'border border-ink text-ink',
  shipped: 'bg-ink text-concrete',
  delivered: 'bg-ink text-concrete',
  cancelled: 'bg-accent text-white',
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
    <div className="border border-ink p-12 text-center">
      <AlertCircle className="w-12 h-12 text-accent mx-auto mb-3" />
      <p className="text-accent font-mono text-sm">{error}</p>
      <button onClick={load} className="btn-brutal mt-4 flex items-center gap-2 mx-auto"><RefreshCw className="w-4 h-4" /> Retry</button>
    </div>
  );

  return (
    <div>
      <div className="border border-ink p-8 mb-8">
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink/40 mb-2">Admin / Orders</div>
        <h1 className="text-4xl uppercase tracking-tighter leading-[0.9]" style={{ fontFamily: 'Anton, Impact, sans-serif' }}>Orders</h1>
        <p className="font-mono text-xs text-ink/40 mt-2">{filtered.length} of {orders.length} orders</p>
      </div>
      <div className="flex gap-2 mb-6">
        <select className="input-brutal" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <button onClick={load} className="btn-brutal-outline p-2.5"><RefreshCw className="w-4 h-4" /></button>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-ink p-14 text-center">
          <div className="font-mono text-sm text-ink/40">No orders found</div>
        </div>
      ) : (
        <div className="border border-ink overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-ink/40 text-[10px] uppercase tracking-widest font-mono bg-ink/5 border-b border-ink/10">
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
                  <tr key={o._id} className="border-t border-ink/10 hover:bg-ink/5">
                    <td className="p-3 pl-4 font-mono text-xs font-bold text-ink">#{o._id.slice(-8).toUpperCase()}</td>
                    <td className="p-3">
                      <div className="font-medium text-ink">{o.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-ink/40 font-mono">{o.user?.email}</div>
                    </td>
                    <td className="p-3 text-center font-mono font-medium">{o.items?.length || 0}</td>
                    <td className="p-3 font-mono font-bold text-ink">₹{o.total}</td>
                    <td className="p-3 capitalize text-ink/70 font-mono text-xs">{o.paymentMethod}</td>
                    <td className="p-3">
                      <select
                        value={o.status}
                        onChange={(e) => update(o._id, e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider border-0 outline-none cursor-pointer ${STATUS_BADGE[o.status] || 'border border-ink/30 text-ink/60'}`}
                      >
                        {statuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </td>
                    <td className="p-3 text-xs text-ink/40 font-mono">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
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
