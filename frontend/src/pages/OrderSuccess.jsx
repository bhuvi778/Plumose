import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { api.get(`/orders/${id}`).then((r) => setOrder(r.data)); }, [id]);
  if (!order) return <Loader />;

  return (
    <div className="container-x py-24 max-w-xl">
      <div className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-mono mb-4">Order Confirmed</div>
      <h1
        className="text-6xl text-ink leading-[0.85] tracking-tighter mb-6"
        style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}
      >
        Thank You
      </h1>
      <p className="text-sm text-ink/60 font-body leading-relaxed mb-8">
        Your order <strong className="text-ink font-mono">#{order._id.slice(-8).toUpperCase()}</strong> is confirmed and will be dispatched shortly.
      </p>

      <div className="border border-ink p-6 space-y-3 font-mono text-xs mb-8">
        <div className="flex justify-between"><span className="text-ink/40 uppercase tracking-wide">Items</span><span>${order.itemsTotal}</span></div>
        <div className="flex justify-between"><span className="text-ink/40 uppercase tracking-wide">Shipping</span><span>${order.shippingFee}</span></div>
        <div className="flex justify-between"><span className="text-ink/40 uppercase tracking-wide">Tax</span><span>${order.tax}</span></div>
        <div className="flex justify-between font-bold text-sm border-t border-ink/20 pt-3">
          <span>Total Paid</span><span>${order.total}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Link to="/orders" className="btn-brutal">View Orders</Link>
        <Link to="/shop" className="btn-brutal-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}
