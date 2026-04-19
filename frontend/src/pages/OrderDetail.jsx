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
    <div className="container-x py-10 max-w-4xl">
      <h1 className="font-display text-3xl font-bold text-maroon-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
      <p className="text-maroon-600 text-sm">Placed on {new Date(order.createdAt).toLocaleString()}</p>

      {order.status !== 'cancelled' && (
        <div className="card p-6 mt-6">
          <div className="flex justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex-1 text-center">
                <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold ${i <= stepIdx ? 'bg-saffron-500 text-white' : 'bg-saffron-100 text-maroon-500'}`}>
                  {i + 1}
                </div>
                <div className="mt-2 text-xs capitalize">{s}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-6 mt-6">
        <h3 className="font-semibold mb-3">Items</h3>
        <div className="divide-y divide-saffron-100">
          {order.items.map((i, idx) => (
            <div key={idx} className="py-3 flex items-center gap-3">
              <img src={i.image} className="w-14 h-14 rounded-lg object-cover" alt="" />
              <div className="flex-1">
                <div className="font-semibold text-maroon-900">{i.name}</div>
                <div className="text-sm text-maroon-500">₹{i.price} × {i.quantity}</div>
              </div>
              <div className="font-bold">₹{i.price * i.quantity}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="card p-6">
          <h3 className="font-semibold mb-2">Shipping address</h3>
          <p className="text-sm text-maroon-700">
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.line1}, {order.shippingAddress.line2}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
            📞 {order.shippingAddress.phone}
          </p>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold mb-2">Payment summary</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between"><span>Items total</span><span>₹{order.itemsTotal}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>₹{order.shippingFee}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₹{order.tax}</span></div>
            <div className="flex justify-between font-bold pt-2 border-t border-saffron-200 mt-2 text-maroon-900"><span>Total</span><span>₹{order.total}</span></div>
            <div className="text-xs text-maroon-500 mt-2">Payment: {order.paymentMethod} • {order.isPaid ? 'Paid' : 'Pending'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
