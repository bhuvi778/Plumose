import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Cart() {
  const { cart, updateQty, removeItem, subtotal } = useCart();
  const { user } = useAuth();
  const items = cart.items || [];
  const shipping = subtotal > 999 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  if (!user) return (
    <div className="container-x py-32 text-center">
      <ShoppingBag className="w-12 h-12 mx-auto text-ink/20 mb-4" strokeWidth={1} />
      <h2 className="text-3xl text-ink mb-2" style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}>
        Sign in to view cart
      </h2>
      <Link to="/login" className="btn-brutal mt-6 inline-flex">Sign In</Link>
    </div>
  );

  if (items.length === 0) return (
    <div className="container-x py-32 text-center">
      <div className="text-7xl text-ink/10 mb-4 font-mono">0</div>
      <h2 className="text-3xl text-ink mb-2" style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}>
        Cart Is Empty
      </h2>
      <p className="text-xs uppercase tracking-widest text-ink/40 font-mono mb-6">Nothing added yet.</p>
      <Link to="/shop" className="btn-brutal inline-flex">Start Shopping</Link>
    </div>
  );

  return (
    <div className="container-x py-20">
      <div className="mb-8 border-b border-ink/20 pb-6">
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-mono mb-2">Checkout</div>
        <h1 className="text-5xl text-ink leading-[0.85] tracking-tighter" style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}>
          Your Cart
        </h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-10">
        {/* Line items */}
        <div className="space-y-px border border-ink/10">
          {items.map((i) => i.product && (
            <div key={i.product._id} className="flex gap-4 p-4 border-b border-ink/10 last:border-0">
              <Link to={`/product/${i.product.slug}`} className="w-24 h-24 shrink-0 overflow-hidden bg-ink/5">
                {i.product.images?.[0]
                  ? <img src={i.product.images[0]} alt="" className="w-full h-full object-cover img-cinematic" />
                  : <div className="w-full h-full flex items-center justify-center text-ink/20 text-xl font-mono">P</div>
                }
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${i.product.slug}`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-ink line-clamp-1 hover:line-through">
                    {i.product.name}
                  </div>
                </Link>
                {i.product.material && (
                  <div className="text-[10px] font-mono text-ink/40 uppercase mt-0.5">{i.product.material}</div>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center border border-ink">
                    <button onClick={() => updateQty(i.product._id, i.quantity - 1)} className="p-2 hover:bg-ink hover:text-concrete transition-colors"><Minus className="w-3 h-3" /></button>
                    <span className="px-3 text-xs font-mono">{i.quantity}</span>
                    <button onClick={() => updateQty(i.product._id, i.quantity + 1)} className="p-2 hover:bg-ink hover:text-concrete transition-colors"><Plus className="w-3 h-3" /></button>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-ink">${i.product.price * i.quantity}</div>
                    <button onClick={() => removeItem(i.product._id)} className="text-[10px] uppercase tracking-wide text-ink/30 hover:text-accent inline-flex items-center gap-1 mt-1 font-mono">
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <aside className="border border-ink p-6 h-fit lg:sticky lg:top-24">
          <div className="text-[10px] uppercase tracking-[0.25em] text-ink/40 font-mono mb-4">Order Summary</div>
          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between"><span className="text-ink/60 uppercase tracking-wide">Subtotal</span><span>${subtotal}</span></div>
            <div className="flex justify-between"><span className="text-ink/60 uppercase tracking-wide">Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span></div>
            <div className="flex justify-between"><span className="text-ink/60 uppercase tracking-wide">Tax (5%)</span><span>${tax}</span></div>
            <div className="border-t border-ink/20 pt-3 flex justify-between font-bold text-sm">
              <span>Total</span><span>${total}</span>
            </div>
          </div>
          <Link to="/checkout" className="btn-brutal w-full justify-center mt-6 block text-center">
            Checkout
          </Link>
          <Link to="/shop" className="block text-center text-[10px] uppercase tracking-widest font-mono text-ink/40 hover:text-ink mt-4 link-strike">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
