import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client.js';
import { CheckCircle2 } from 'lucide-react';
import Loader from '../components/Loader.jsx';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { api.get(`/orders/${id}`).then((r) => setOrder(r.data)); }, [id]);
  if (!order) return <Loader />;

  return (
    <div className="container-x py-16 max-w-2xl text-center">
      <CheckCircle2 className="w-20 h-20 mx-auto text-green-600" />
      <h1 className="font-display text-4xl font-bold mt-4 text-maroon-900">Thank you for your order!</h1>
      <p className="font-devanagari text-xl text-saffron-700 mt-2">॥ शुभमस्तु ॥</p>
      <p className="mt-4 text-maroon-700">Your order <strong>#{order._id.slice(-8).toUpperCase()}</strong> has been placed and will be delivered soon.</p>
      <div className="card p-6 mt-8 text-left">
        <div className="flex justify-between text-sm"><span>Items total</span><span>₹{order.itemsTotal}</span></div>
        <div className="flex justify-between text-sm mt-1"><span>Shipping</span><span>₹{order.shippingFee}</span></div>
        <div className="flex justify-between text-sm mt-1"><span>Tax</span><span>₹{order.tax}</span></div>
        <div className="flex justify-between font-bold mt-3 pt-3 border-t border-saffron-200 text-maroon-900">
          <span>Total paid</span><span>₹{order.total}</span>
        </div>
      </div>
      <div className="mt-6 flex gap-3 justify-center">
        <Link to="/orders" className="btn-primary">View my orders</Link>
        <Link to="/shop" className="btn-outline">Continue shopping</Link>
      </div>
    </div>
  );
}
