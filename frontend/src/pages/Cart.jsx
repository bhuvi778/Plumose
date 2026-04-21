import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useVertical } from '../context/VerticalContext.jsx';

export default function Cart() {
  const { cart, updateQty, removeItem, subtotal } = useCart();
  const { user } = useAuth();
  const { config } = useVertical();
  const base = config.base;

  const items = cart.items || [];
  const shipping = subtotal > 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  if (!user)
    return (
      <div className="container-x py-24 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-brand/10 text-brand flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="display text-3xl mb-3">Sign in to view cart</h2>
        <p className="text-sm text-ink-soft mb-6">Saving your items requires an account.</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );

  if (items.length === 0)
    return (
      <div className="container-x py-24 text-center">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="display text-3xl mb-2">Cart is empty</h2>
        <p className="text-sm text-ink-soft mb-6">Aapne abhi tak kuch add nahi kiya.</p>
        <Link to={`${base}/shop`} className="btn-primary">Start Shopping</Link>
      </div>
    );

  return (
    <div className="container-x py-10">
      <div className="mb-8 pb-6 border-b border-brand/15">
        <div className="kicker mb-2">Your Cart</div>
        <h1 className="display text-4xl md:text-5xl">Review & checkout</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-3">
          {items.map(
            (i) =>
              i.product && (
                <div key={i.product._id} className="card p-4 flex gap-4">
                  <Link to={`${base}/product/${i.product.slug}`} className="w-24 h-24 shrink-0 overflow-hidden rounded-xl bg-brand-soft">
                    {i.product.images?.[0] ? (
                      <img src={i.product.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl opacity-40">🪔</div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`${base}/product/${i.product.slug}`}>
                      <div className="font-semibold text-ink line-clamp-1 hover:text-brand transition">
                        {i.product.name}
                      </div>
                    </Link>
                    {i.product.material && (
                      <div className="text-xs text-ink-soft mt-0.5">{i.product.material}</div>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-brand/25 overflow-hidden">
                        <button onClick={() => updateQty(i.product._id, i.quantity - 1)} className="p-2 hover:bg-brand/10 transition"><Minus className="w-3 h-3" /></button>
                        <span className="px-3 text-sm font-semibold">{i.quantity}</span>
                        <button onClick={() => updateQty(i.product._id, i.quantity + 1)} className="p-2 hover:bg-brand/10 transition"><Plus className="w-3 h-3" /></button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-brand-dark">₹{i.product.price * i.quantity}</div>
                        <button onClick={() => removeItem(i.product._id)} className="text-xs text-ink-soft hover:text-accent inline-flex items-center gap-1 mt-1">
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
          )}
        </div>

        <aside className="card p-6 h-fit lg:sticky lg:top-24">
          <div className="label">Order summary</div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-ink-soft">Subtotal</span><span className="font-medium">₹{subtotal}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Shipping</span><span className="font-medium">{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Tax (5%)</span><span className="font-medium">₹{tax}</span></div>
            <div className="border-t border-brand/15 pt-3 flex justify-between font-bold text-lg">
              <span>Total</span><span className="text-brand-dark">₹{total}</span>
            </div>
          </div>
          {subtotal < 499 && (
            <div className="mt-4 rounded-xl bg-brand/10 text-brand-dark p-3 text-xs">
              Add ₹{499 - subtotal} more for <strong>FREE shipping</strong>
            </div>
          )}
          <Link to={`${base}/checkout`} className="btn-primary w-full justify-center mt-5">
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to={`${base}/shop`} className="btn-ghost w-full justify-center mt-2 text-xs">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
