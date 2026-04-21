import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { api.get(`/orders/${id}`).then((r) => setOrder(r.data)); }, [id]);
  if (!order) return <Loader />;
  const steps = ['pending', 'confirmed', 'shipped', 'delivered'];
  const stepIdx = steps.indexOf(order.status);

  return (
    <div className="container-x py-20 max-w-4xl">
      <div className="mb-10 border-b border-ink/20 pb-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-mono mb-2">Order</div>
        <h1 className="text-4xl md:text-5xl text-ink leading-[0.85] tracking-tighter" style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}>
          #{order._id.slice(-8).toUpperCase()}
        </h1>
        <p className="text-[10px] font-mono text-ink/40 mt-2 uppercase tracking-wide">
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Status track */}
      {order.status !== 'cancelled' && (
        <div className="border border-ink/20 p-6 mb-8">
          <div className="flex justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex-1 text-center">
                <div className={`w-8 h-8 mx-auto flex items-center justify-center text-xs font-bold font-mono ${i <= stepIdx ? 'bg-ink text-concrete' : 'border border-ink/20 text-ink/20'}`}>
                  {i + 1}
                </div>
                <div className="mt-2 text-[10px] uppercase tracking-wide font-mono text-ink/50">{s}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="border border-ink/10 mb-6">
        <div className="px-5 py-3 border-b border-ink/10">
          <div className="text-[10px] uppercase tracking-[0.25em] text-ink/40 font-mono">Items</div>
        </div>
        {order.items.map((i, idx) => (
          <div key={idx} className="flex items-center gap-4 p-4 border-b border-ink/10 last:border-0">
            <div className="w-14 h-14 bg-ink/5 shrink-0">
              {i.image && <img src={i.image} className="w-full h-full object-cover" alt="" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold uppercase tracking-wide text-ink line-clamp-1">{i.name}</div>
              <div className="text-[10px] font-mono text-ink/40 mt-0.5">${i.price} Ã— {i.quantity}</div>
            </div>
            <div className="text-sm font-mono font-bold text-ink">${i.price * i.quantity}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Address */}
        <div className="border border-ink/20 p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-ink/40 font-mono mb-3">Shipping Address</div>
          <div className="text-xs font-body text-ink/70 leading-relaxed space-y-0.5">
            <div className="font-bold text-ink">{order.shippingAddress.fullName}</div>
            <div>{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}</div>
            <div>{order.shippingAddress.city}, {order.shippingAddress.state} â€” {order.shippingAddress.pincode}</div>
            <div className="font-mono text-[10px] mt-1">{order.shippingAddress.phone}</div>
          </div>
        </div>

        {/* Payment summary */}
        <div className="border border-ink/20 p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-ink/40 font-mono mb-3">Payment</div>
          <div className="font-mono text-xs space-y-2">
            <div className="flex justify-between"><span className="text-ink/40 uppercase tracking-wide">Items</span><span>${order.itemsTotal}</span></div>
            <div className="flex justify-between"><span className="text-ink/40 uppercase tracking-wide">Shipping</span><span>${order.shippingFee}</span></div>
            <div className="flex justify-between"><span className="text-ink/40 uppercase tracking-wide">Tax</span><span>${order.tax}</span></div>
            <div className="flex justify-between font-bold text-sm border-t border-ink/20 pt-2 mt-2"><span>Total</span><span>${order.total}</span></div>
            <div className="text-[10px] text-ink/40 uppercase tracking-wide pt-1">{order.paymentMethod} Â· {order.isPaid ? 'Paid' : 'Pending'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
