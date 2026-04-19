import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then((r) => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container-x py-10">
      <h1 className="font-display text-4xl font-bold text-maroon-900 mb-6">My orders</h1>
      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="font-display text-2xl font-bold">No orders yet</h3>
          <Link to="/shop" className="btn-primary mt-4 inline-flex">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link to={`/orders/${o._id}`} key={o._id} className="card p-5 hover:shadow-glow block transition">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-maroon-500">Order ID</div>
                  <div className="font-semibold">#{o._id.slice(-8).toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-xs text-maroon-500">Placed on</div>
                  <div className="text-sm">{new Date(o.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-xs text-maroon-500">Items</div>
                  <div className="text-sm">{o.items.length}</div>
                </div>
                <div>
                  <div className="text-xs text-maroon-500">Total</div>
                  <div className="font-bold text-maroon-900">₹{o.total}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[o.status]}`}>
                  {o.status.toUpperCase()}
                </span>
              </div>
              <div className="flex gap-2 mt-4 overflow-hidden">
                {o.items.slice(0, 5).map((i, idx) => (
                  <img key={idx} src={i.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-saffron-100" />
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
