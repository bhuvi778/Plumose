import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { useVertical } from '../context/VerticalContext.jsx';

export default function OrderSuccess() {
  const { id } = useParams();
  const { config } = useVertical();
  const base = config.base;
  const [order, setOrder] = useState(null);
  useEffect(() => { api.get(`/orders/${id}`).then((r) => setOrder(r.data)); }, [id]);
  if (!order) return <Loader />;

  return (
    <div className="container-x py-20 max-w-xl mx-auto text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-brand/15 text-brand flex items-center justify-center mb-5 animate-slide-up">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h1 className="display text-4xl md:text-5xl mb-3">Thank you!</h1>
      <p className="text-base text-ink-soft leading-relaxed mb-8">
        Aapka order <strong className="text-brand-dark">#{order._id.slice(-8).toUpperCase()}</strong> successfully
        place ho gaya hai. Hum jald hi dispatch karenge.
      </p>

      <div className="card p-6 text-left space-y-3 text-sm mb-8">
        <div className="flex justify-between"><span className="text-ink-soft">Items total</span><span>₹{order.itemsTotal}</span></div>
        <div className="flex justify-between"><span className="text-ink-soft">Shipping</span><span>₹{order.shippingFee}</span></div>
        <div className="flex justify-between"><span className="text-ink-soft">Tax</span><span>₹{order.tax}</span></div>
        <div className="border-t border-brand/15 pt-3 flex justify-between font-bold text-lg">
          <span>Total paid</span><span className="text-brand-dark">₹{order.total}</span>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Link to={`${base}/orders/${order._id}`} className="btn-primary"><Package className="w-4 h-4" /> View Order</Link>
        <Link to={`${base}/shop`} className="btn-outline">Continue Shopping <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  );
}
