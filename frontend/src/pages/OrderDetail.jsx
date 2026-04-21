import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';
import { Check } from 'lucide-react';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { api.get(`/orders/${id}`).then((r) => setOrder(r.data)); }, [id]);
  if (!order) return <Loader />;

  const steps = ['pending', 'confirmed', 'shipped', 'delivered'];
  const labels = ['Placed', 'Confirmed', 'Shipped', 'Delivered'];
  const stepIdx = steps.indexOf(order.status);

  return (
    <div className="container-x py-10 max-w-4xl">
      <div className="mb-8 pb-6 border-b border-brand/15">
        <div className="kicker mb-2">Order</div>
        <h1 className="display text-3xl md:text-4xl">#{order._id.slice(-8).toUpperCase()}</h1>
        <p className="text-sm text-ink-soft mt-2">{new Date(order.createdAt).toLocaleString()}</p>
      </div>

      {/* Progress */}
      {order.status !== 'cancelled' && (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex-1 flex flex-col items-center relative">
                {i > 0 && (
                  <div className={`absolute right-1/2 top-5 h-0.5 w-full -z-0 ${i <= stepIdx ? 'bg-brand' : 'bg-brand/15'}`} />
                )}
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                  i <= stepIdx ? 'bg-brand text-white' : 'bg-brand/15 text-ink-mute'
                }`}>
                  {i <= stepIdx ? <Check className="w-5 h-5" /> : i + 1}
                </div>
                <div className="mt-2 text-[11px] text-ink-soft text-center">{labels[i]}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {order.status === 'cancelled' && (
        <div className="card p-5 mb-6 border-l-4 border-red-500">
          <div className="font-semibold text-red-600">Order cancelled</div>
          <div className="text-sm text-ink-soft mt-1">This order has been cancelled.</div>
        </div>
      )}

      {/* Items */}
      <div className="card mb-6">
        <div className="px-5 py-3 border-b border-brand/10 text-sm font-semibold text-ink">Items</div>
        {order.items.map((i, idx) => (
          <div key={idx} className="flex items-center gap-4 p-4 border-b border-brand/10 last:border-0">
            <div className="w-14 h-14 rounded-lg bg-brand-soft overflow-hidden shrink-0">
              {i.image && <img src={i.image} className="w-full h-full object-cover" alt="" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-ink line-clamp-1">{i.name}</div>
              <div className="text-xs text-ink-soft">₹{i.price} × {i.quantity}</div>
            </div>
            <div className="font-bold text-ink">₹{i.price * i.quantity}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="label">Shipping Address</div>
          <div className="text-sm text-ink leading-relaxed">
            <div className="font-semibold">{order.shippingAddress.fullName}</div>
            <div className="text-ink-soft">
              {order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
            </div>
            <div className="text-ink-soft">{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</div>
            <div className="text-ink-soft mt-1">{order.shippingAddress.phone}</div>
          </div>
        </div>

        <div className="card p-5">
          <div className="label">Payment Summary</div>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span className="text-ink-soft">Items</span><span>₹{order.itemsTotal}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Shipping</span><span>₹{order.shippingFee}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Tax</span><span>₹{order.tax}</span></div>
            <div className="flex justify-between font-bold text-lg border-t border-brand/15 pt-2 mt-1">
              <span>Total</span><span className="text-brand-dark">₹{order.total}</span>
            </div>
            <div className="text-xs text-ink-soft pt-1">{order.paymentMethod} · {order.isPaid ? 'Paid' : 'Pending'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
