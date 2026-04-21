import { useEffect, useState, useMemo } from 'react';
import api from '../api/client.js';
import toast from 'react-hot-toast';
import { RefreshCw, Search, ChevronDown } from 'lucide-react';
import Loader from '../components/Loader.jsx';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_STYLE = {
  pending:   'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped:   'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/orders/all')
      .then((r) => setOrders(r.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const update = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success('Status updated');
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = useMemo(() => {
    let list = orders;
    if (statusFilter !== 'all') list = list.filter((o) => o.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) =>
        o._id.slice(-8).toLowerCase().includes(q) ||
        o.user?.name?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, statusFilter, search]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="display text-3xl md:text-4xl text-ink">Orders</h1>
          <p className="text-sm text-ink-soft mt-1">{filtered.length} of {orders.length} orders</p>
        </div>
        <button onClick={load} className="btn-outline gap-2"><RefreshCw className="w-4 h-4" /> Refresh</button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-mute pointer-events-none" />
          <input placeholder="Search by customer name, email or order ID…"
            value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9" />
        </div>
        <div className="flex rounded-xl border border-brand/20 overflow-hidden">
          {['all', ...STATUSES].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs font-semibold capitalize transition ${statusFilter === s ? 'bg-brand text-white' : 'bg-surface-soft text-ink-soft hover:bg-brand/10'}`}>
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-14 text-center text-ink-mute text-sm">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-soft/50 border-b border-brand/10">
                <tr className="text-left text-[11px] uppercase tracking-wider text-ink-soft">
                  <th className="p-3 pl-4">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o._id} className="border-t border-brand/5 hover:bg-brand-soft/30">
                    <td className="p-3 pl-4 font-mono text-xs font-bold text-ink">#{o._id.slice(-8).toUpperCase()}</td>
                    <td className="p-3">
                      <div className="font-medium text-ink text-sm">{o.user?.name || 'Unknown'}</div>
                      <div className="text-[11px] text-ink-mute">{o.user?.email}</div>
                    </td>
                    <td className="p-3 text-center font-semibold text-ink">{o.items?.length || 0}</td>
                    <td className="p-3 font-bold text-ink">₹{o.total?.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-xs text-ink-soft capitalize">{o.paymentMethod}</td>
                    <td className="p-3">
                      <div className="relative inline-block">
                        <select
                          value={o.status}
                          onChange={(e) => update(o._id, e.target.value)}
                          className={`appearance-none text-[11px] font-bold px-3 py-1 pr-6 rounded-full border-0 outline-none cursor-pointer capitalize ${STATUS_STYLE[o.status] || 'bg-gray-100 text-gray-700'}`}
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td className="p-3 text-xs text-ink-mute">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
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

