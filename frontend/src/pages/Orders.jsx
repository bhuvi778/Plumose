import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';

const STATUS_STYLE = {
  pending:   'bg-concrete border border-ink/30 text-ink/60',
  confirmed: 'bg-ink text-concrete',
  shipped:   'bg-ink text-concrete',
  delivered: 'bg-ink text-concrete',
  cancelled: 'bg-accent text-white',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then((r) => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container-x py-20">
      <div className="mb-10 border-b border-ink/20 pb-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-mono mb-2">Account</div>
        <h1 className="text-5xl text-ink leading-[0.85] tracking-tighter" style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}>
          My Orders
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="border border-ink/20 p-16 text-center">
          <div className="text-5xl text-ink/10 font-mono mb-4">0</div>
          <h3 className="text-2xl text-ink mb-4" style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}>No Orders Yet</h3>
          <Link to="/shop" className="btn-brutal inline-flex">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-px border border-ink/10">
          {orders.map((o) => (
            <Link
              to={`/orders/${o._id}`}
              key={o._id}
              className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-ink/10 last:border-0 hover:bg-ink/3 transition-colors"
            >
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wide text-ink/40">Order ID</div>
                <div className="text-xs font-mono font-bold text-ink mt-0.5">#{o._id.slice(-8).toUpperCase()}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wide text-ink/40">Date</div>
                <div className="text-xs font-mono text-ink mt-0.5">{new Date(o.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wide text-ink/40">Items</div>
                <div className="text-xs font-mono text-ink mt-0.5">{o.items.length}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wide text-ink/40">Total</div>
                <div className="text-sm font-mono font-bold text-ink mt-0.5">${o.total}</div>
              </div>
              <span className={`px-2 py-1 text-[10px] font-bold font-mono uppercase tracking-wide ${STATUS_STYLE[o.status] || 'bg-ink/10 text-ink'}`}>
                {o.status}
              </span>
              <div className="flex gap-1.5 overflow-hidden">
                {o.items.slice(0, 5).map((i, idx) => (
                  <div key={idx} className="w-10 h-10 overflow-hidden bg-ink/5 shrink-0">
                    {i.image && <img src={i.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
