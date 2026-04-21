import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import { useVertical } from '../context/VerticalContext.jsx';
import toast from 'react-hot-toast';
import { Plus, Banknote, Smartphone, CreditCard } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, subtotal, refresh } = useCart();
  const { config } = useVertical();
  const base = config.base;

  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [payment, setPayment] = useState('COD');
  const [form, setForm] = useState({
    fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', type: 'home',
  });
  const [loading, setLoading] = useState(false);

  const items = cart.items || [];
  const shipping = subtotal > 499 ? 0 : 49;
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
  useEffect(() => { if (items.length === 0) navigate(`${base}/cart`); }, [items, navigate, base]);

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
      navigate(`${base}/order-success/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-x py-10">
      <div className="mb-8 pb-6 border-b border-brand/15">
        <div className="kicker mb-2">Checkout</div>
        <h1 className="display text-4xl md:text-5xl">Confirm your order</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-8">
          {/* Address */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-ink">Shipping address</h3>
              <button onClick={() => setShowForm(!showForm)} className="btn-outline text-xs py-1.5">
                <Plus className="w-3 h-3" /> New Address
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {addresses.map((a) => (
                <label key={a._id} className={`card p-4 cursor-pointer transition ${selected === a._id ? 'border-brand ring-2 ring-brand/30' : ''}`}>
                  <input type="radio" checked={selected === a._id} onChange={() => setSelected(a._id)} className="sr-only" />
                  <div className="text-sm font-semibold text-ink">{a.fullName}</div>
                  <div className="text-xs text-ink-soft mt-1 leading-relaxed">
                    {a.line1}, {a.city} — {a.pincode}
                  </div>
                  <div className="text-xs text-ink-soft mt-0.5">{a.phone}</div>
                </label>
              ))}
            </div>

            {showForm && (
              <form onSubmit={saveAddress} className="card p-5 mt-4 grid md:grid-cols-2 gap-3">
                <div className="md:col-span-2"><label className="label">Full Name</label><input required className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
                <div><label className="label">Phone</label><input required className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div><label className="label">Pincode</label><input required className="input" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} /></div>
                <div className="md:col-span-2"><label className="label">Address Line 1</label><input required className="input" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} /></div>
                <div><label className="label">City</label><input required className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                <div><label className="label">State</label><input required className="input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
                <div className="md:col-span-2 flex gap-3">
                  <button className="btn-primary flex-1">Save Address</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
                </div>
              </form>
            )}
          </section>

          {/* Payment */}
          <section>
            <h3 className="text-lg font-semibold text-ink mb-4">Payment method</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { id: 'COD', label: 'Cash on Delivery', Icon: Banknote },
                { id: 'UPI', label: 'UPI / Wallet', Icon: Smartphone },
                { id: 'CARD', label: 'Card', Icon: CreditCard },
              ].map(({ id, label, Icon }) => (
                <label key={id} className={`card p-4 cursor-pointer text-center transition ${payment === id ? 'border-brand ring-2 ring-brand/30' : ''}`}>
                  <input type="radio" checked={payment === id} onChange={() => setPayment(id)} className="sr-only" />
                  <Icon className="w-6 h-6 mx-auto text-brand mb-2" />
                  <div className="text-sm font-semibold text-ink">{label}</div>
                </label>
              ))}
            </div>
          </section>

          {/* Items */}
          <section>
            <h3 className="text-lg font-semibold text-ink mb-4">Items in your order</h3>
            <div className="card divide-y divide-brand/10">
              {items.map((i) =>
                i.product && (
                  <div key={i.product._id} className="flex items-center gap-4 p-4">
                    <div className="w-14 h-14 rounded-lg bg-brand-soft overflow-hidden shrink-0">
                      {i.product.images?.[0] && <img src={i.product.images[0]} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-ink line-clamp-1">{i.product.name}</div>
                      <div className="text-xs text-ink-soft">Qty: {i.quantity}</div>
                    </div>
                    <div className="font-semibold text-ink">₹{i.product.price * i.quantity}</div>
                  </div>
                )
              )}
            </div>
          </section>
        </div>

        <aside className="card p-6 h-fit lg:sticky lg:top-24">
          <div className="label">Order summary</div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-ink-soft">Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Tax</span><span>₹{tax}</span></div>
            <div className="border-t border-brand/15 pt-3 flex justify-between font-bold text-lg">
              <span>Total</span><span className="text-brand-dark">₹{total}</span>
            </div>
          </div>
          <button
            onClick={placeOrder}
            disabled={loading || !selected}
            className="btn-primary w-full justify-center mt-5"
          >
            {loading ? 'Placing…' : `Place Order · ₹${total}`}
          </button>
        </aside>
      </div>
    </div>
  );
}
