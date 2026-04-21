import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';
import { Package, ArrowRight } from 'lucide-react';
import { useVertical } from '../context/VerticalContext.jsx';

const STATUS_STYLE = {
  pending: 'bg-brand/15 text-brand-dark',
  confirmed: 'bg-brand text-white',
  shipped: 'bg-accent text-white',
  delivered: 'bg-green-600 text-white',
  cancelled: 'bg-red-500 text-white',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { config } = useVertical();
  const base = config.base;

  useEffect(() => {
    api.get('/orders/my').then((r) => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container-x py-10">
      <div className="mb-8 pb-6 border-b border-brand/15">
        <div className="kicker mb-2">Account</div>
        <h1 className="display text-4xl md:text-5xl">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="card p-16 text-center">
          <Package className="w-14 h-14 mx-auto text-brand/30 mb-4" />
          <h3 className="display text-2xl mb-3">No orders yet</h3>
          <p className="text-sm text-ink-soft mb-6">Aapne abhi tak koi order nahi kiya.</p>
          <Link to={`${base}/shop`} className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link
              to={`${base}/orders/${o._id}`}
              key={o._id}
              className="card-hover p-5 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 flex-1 min-w-[180px]">
                <div className="w-11 h-11 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-ink-soft">Order</div>
                  <div className="font-semibold text-ink">#{o._id.slice(-8).toUpperCase()}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-ink-soft">Date</div>
                <div className="text-sm text-ink">{new Date(o.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-xs text-ink-soft">Items</div>
                <div className="text-sm text-ink">{o.items.length}</div>
              </div>
              <div>
                <div className="text-xs text-ink-soft">Total</div>
                <div className="font-bold text-brand-dark">₹{o.total}</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLE[o.status] || 'bg-brand/10 text-ink'}`}>
                {o.status}
              </span>
              <ArrowRight className="w-4 h-4 text-ink-soft" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
