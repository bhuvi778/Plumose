import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import toast from 'react-hot-toast';
import { Plus, Banknote, Smartphone, CreditCard } from 'lucide-react';

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
  useEffect(() => { if (items.length === 0) navigate('/cart'); }, [items, navigate]);

  const saveAddress = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/addresses', { ...form, isDefault: addresses.length === 0 });
    setAddresses([data, ...addresses]);
    setSelected(data._id);
    setShowForm(false);
    toast.success('Address saved.');
  };

  const placeOrder = async () => {
    if (!selected) return toast.error('Please select an address');
    setLoading(true);
    try {
      const addr = addresses.find((a) => a._id === selected);
      const { data } = await api.post('/orders', {
        shippingAddress: { fullName: addr.fullName, phone: addr.phone, line1: addr.line1, line2: addr.line2, city: addr.city, state: addr.state, pincode: addr.pincode, country: addr.country },
        paymentMethod: payment,
      });
      await refresh();
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  const lbl = 'block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60 mb-1.5';

  return (
    <div className="container-x py-20">
      <div className="mb-10 border-b border-ink/20 pb-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-mono mb-2">Step 2 of 2</div>
        <h1 className="text-5xl text-ink leading-[0.85] tracking-tighter" style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}>Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-10">
          {/* â”€â”€ Shipping address â”€â”€ */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] uppercase tracking-[0.25em] text-ink/40 font-mono">Shipping Address</div>
              <button onClick={() => setShowForm(!showForm)} className="btn-brutal-outline text-[10px] py-1.5">
                <Plus className="w-3 h-3" /> New Address
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {addresses.map((a) => (
                <label key={a._id} className={`border p-4 cursor-pointer transition-colors ${selected === a._id ? 'border-ink bg-ink/3' : 'border-ink/20 hover:border-ink/50'}`}>
                  <input type="radio" checked={selected === a._id} onChange={() => setSelected(a._id)} className="sr-only" />
                  <div className="text-xs font-bold uppercase tracking-wide text-ink">{a.fullName}</div>
                  <div className="text-xs text-ink/60 font-body mt-1">{a.line1}, {a.city} â€” {a.pincode}</div>
                  <div className="text-[10px] font-mono text-ink/40 mt-0.5">{a.phone}</div>
                </label>
              ))}
            </div>

            {showForm && (
              <form onSubmit={saveAddress} className="border border-ink p-5 mt-4 grid md:grid-cols-2 gap-3">
                <div className="md:col-span-2"><label className={lbl}>Full Name</label><input required className="input-brutal text-xs" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
                <div><label className={lbl}>Phone</label><input required className="input-brutal text-xs" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div><label className={lbl}>Pincode</label><input required className="input-brutal text-xs" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} /></div>
                <div className="md:col-span-2"><label className={lbl}>Line 1</label><input required className="input-brutal text-xs" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} /></div>
                <div><label className={lbl}>City</label><input required className="input-brutal text-xs" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                <div><label className={lbl}>State</label><input required className="input-brutal text-xs" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
                <div className="md:col-span-2 flex gap-3">
                  <button className="btn-brutal text-xs flex-1 justify-center">Save Address</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-brutal-outline text-xs">Cancel</button>
                </div>
              </form>
            )}
          </section>

          {/* â”€â”€ Payment â”€â”€ */}
          <section>
            <div className="text-[10px] uppercase tracking-[0.25em] text-ink/40 font-mono mb-4">Payment Method</div>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { id: 'COD', label: 'Cash on Delivery', Icon: Banknote },
                { id: 'UPI', label: 'UPI / Wallet', Icon: Smartphone },
                { id: 'CARD', label: 'Card', Icon: CreditCard },
              ].map(({ id, label, Icon }) => (
                <label key={id} className={`border p-4 cursor-pointer transition-colors text-center ${payment === id ? 'border-ink bg-ink/3' : 'border-ink/20 hover:border-ink/50'}`}>
                  <input type="radio" checked={payment === id} onChange={() => setPayment(id)} className="sr-only" />
                  <Icon className="w-5 h-5 mx-auto text-ink/60 mb-2" strokeWidth={1.5} />
                  <div className="text-[10px] font-bold uppercase tracking-wide text-ink">{label}</div>
                </label>
              ))}
            </div>
          </section>

          {/* â”€â”€ Items â”€â”€ */}
          <section>
            <div className="text-[10px] uppercase tracking-[0.25em] text-ink/40 font-mono mb-4">Order Items</div>
            <div className="border border-ink/10">
              {items.map((i) => i.product && (
                <div key={i.product._id} className="flex items-center gap-4 p-4 border-b border-ink/10 last:border-0">
                  <div className="w-14 h-14 bg-ink/5 shrink-0">
                    {i.product.images?.[0] && <img src={i.product.images[0]} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold uppercase tracking-wide text-ink line-clamp-1">{i.product.name}</div>
                    <div className="text-[10px] font-mono text-ink/40 mt-0.5">Qty: {i.quantity}</div>
                  </div>
                  <div className="text-sm font-mono font-bold text-ink">${i.product.price * i.quantity}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* â”€â”€ Summary â”€â”€ */}
        <aside className="border border-ink p-6 h-fit lg:sticky lg:top-24">
          <div className="text-[10px] uppercase tracking-[0.25em] text-ink/40 font-mono mb-4">Order Summary</div>
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between"><span className="text-ink/40 uppercase tracking-wide">Subtotal</span><span>${subtotal}</span></div>
            <div className="flex justify-between"><span className="text-ink/40 uppercase tracking-wide">Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span></div>
            <div className="flex justify-between"><span className="text-ink/40 uppercase tracking-wide">Tax</span><span>${tax}</span></div>
            <div className="border-t border-ink/20 pt-3 flex justify-between font-bold text-sm">
              <span>Total</span><span>${total}</span>
            </div>
          </div>
          <button
            onClick={placeOrder}
            disabled={loading || !selected}
            className="btn-brutal w-full justify-center mt-6 disabled:opacity-40"
          >
            {loading ? 'Placingâ€¦' : `Place Order Â· $${total}`}
          </button>
        </aside>
      </div>
    </div>
  );
}
