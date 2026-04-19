import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import toast from 'react-hot-toast';
import { MapPin, Plus, Banknote, Smartphone, CreditCard } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, subtotal, refresh } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [payment, setPayment] = useState('COD');
  const [form, setForm] = useState({
    fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', type: 'home',
  });
  const [loading, setLoading] = useState(false);

  const items = cart.items || [];
  const shipping = subtotal > 999 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const loadAddrs = () => {
    api.get('/addresses').then((r) => {
      setAddresses(r.data);
      const def = r.data.find((a) => a.isDefault) || r.data[0];
      if (def) setSelected(def._id);
      else setShowForm(true);
    });
  };

  useEffect(loadAddrs, []);

  useEffect(() => {
    if (items.length === 0) navigate('/cart');
  }, [items, navigate]);

  const saveAddress = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/addresses', { ...form, isDefault: addresses.length === 0 });
    setAddresses([data, ...addresses]);
    setSelected(data._id);
    setShowForm(false);
    toast.success('Address saved');
  };

  const placeOrder = async () => {
    if (!selected) return toast.error('Please select an address');
    setLoading(true);
    try {
      const addr = addresses.find((a) => a._id === selected);
      const { data } = await api.post('/orders', {
        shippingAddress: {
          fullName: addr.fullName, phone: addr.phone, line1: addr.line1, line2: addr.line2,
          city: addr.city, state: addr.state, pincode: addr.pincode, country: addr.country,
        },
        paymentMethod: payment,
      });
      await refresh();
      toast.success('Order placed!');
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-x py-10">
      <h1 className="font-display text-4xl font-bold text-maroon-900 mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-8">
          {/* Addresses */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold flex items-center gap-2"><MapPin className="w-5 h-5" /> Shipping address</h2>
              <button onClick={() => setShowForm(!showForm)} className="btn-outline text-sm">
                <Plus className="w-4 h-4" /> Add new
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {addresses.map((a) => (
                <label key={a._id} className={`card p-4 cursor-pointer transition ${selected === a._id ? 'border-saffron-500 shadow-glow' : ''}`}>
                  <input type="radio" checked={selected === a._id} onChange={() => setSelected(a._id)} className="sr-only" />
                  <div className="font-semibold text-maroon-900">{a.fullName} <span className="chip text-[10px] ml-1">{a.type}</span></div>
                  <div className="text-sm text-maroon-700 mt-1">{a.line1}, {a.line2}</div>
                  <div className="text-sm text-maroon-700">{a.city}, {a.state} - {a.pincode}</div>
                  <div className="text-sm text-maroon-600 mt-1">📞 {a.phone}</div>
                </label>
              ))}
            </div>

            {showForm && (
              <form onSubmit={saveAddress} className="card p-5 mt-4 grid md:grid-cols-2 gap-3">
                <div><label className="label">Full name</label><input required className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
                <div><label className="label">Phone</label><input required className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="md:col-span-2"><label className="label">Address line 1</label><input required className="input" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} /></div>
                <div className="md:col-span-2"><label className="label">Address line 2</label><input className="input" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} /></div>
                <div><label className="label">City</label><input required className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                <div><label className="label">State</label><input required className="input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
                <div><label className="label">Pincode</label><input required className="input" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} /></div>
                <div><label className="label">Type</label>
                  <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="home">Home</option><option value="work">Work</option><option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <button className="btn-primary">Save address</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
                </div>
              </form>
            )}
          </section>

          {/* Payment */}
          <section>
            <h2 className="font-display text-xl font-bold mb-4">Payment method</h2>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { id: 'COD', label: 'Cash on Delivery', icon: Banknote },
                { id: 'UPI', label: 'UPI / Wallet', icon: Smartphone },
                { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard },
              ].map(({ id, label, icon: Icon }) => (
                <label key={id} className={`card p-4 cursor-pointer text-center transition ${payment === id ? 'border-saffron-500 shadow-glow' : ''}`}>
                  <input type="radio" checked={payment === id} onChange={() => setPayment(id)} className="sr-only" />
                  <Icon className="w-6 h-6 mx-auto text-saffron-600" />
                  <div className="mt-2 text-sm font-semibold text-maroon-900">{label}</div>
                </label>
              ))}
            </div>
          </section>

          {/* Items */}
          <section>
            <h2 className="font-display text-xl font-bold mb-4">Order items</h2>
            <div className="card divide-y divide-saffron-100">
              {items.map((i) => i.product && (
                <div key={i.product._id} className="p-3 flex items-center gap-3">
                  <img src={i.product.images?.[0]} alt="" className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-maroon-900">{i.product.name}</div>
                    <div className="text-xs text-maroon-500">Qty: {i.quantity}</div>
                  </div>
                  <div className="font-semibold">₹{i.product.price * i.quantity}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="card p-6 h-fit sticky top-28">
          <h3 className="font-display text-xl font-bold">Order summary</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₹{tax}</span></div>
            <div className="border-t border-saffron-200 pt-3 mt-3 flex justify-between font-bold text-lg text-maroon-900">
              <span>Total</span><span>₹{total}</span>
            </div>
          </div>
          <button onClick={placeOrder} disabled={loading || !selected} className="btn-primary w-full mt-6">
            {loading ? 'Placing order...' : `Place order • ₹${total}`}
          </button>
        </aside>
      </div>
    </div>
  );
}
