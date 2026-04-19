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
    <div className="container-x py-20 text-center">
      <ShoppingBag className="w-16 h-16 mx-auto text-saffron-400" />
      <h2 className="font-display text-3xl font-bold mt-4">Sign in to view your cart</h2>
      <Link to="/login" className="btn-primary mt-6 inline-flex">Sign in</Link>
    </div>
  );

  if (items.length === 0) return (
    <div className="container-x py-20 text-center">
      <div className="text-7xl mb-4">🛒</div>
      <h2 className="font-display text-3xl font-bold text-maroon-900">Your cart is empty</h2>
      <p className="text-maroon-600 mt-2">Add some divine essentials to begin your puja.</p>
      <Link to="/shop" className="btn-primary mt-6 inline-flex">Start shopping</Link>
    </div>
  );

  return (
    <div className="container-x py-10">
      <h1 className="font-display text-4xl font-bold text-maroon-900 mb-6">Your cart</h1>
      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-4">
          {items.map((i) => i.product && (
            <div key={i.product._id} className="card p-4 flex gap-4">
              <Link to={`/product/${i.product.slug}`} className="w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-saffron-50">
                <img src={i.product.images?.[0]} alt="" className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1">
                <Link to={`/product/${i.product.slug}`} className="font-semibold text-maroon-900 hover:text-saffron-700">{i.product.name}</Link>
                <div className="text-sm text-maroon-500">{i.product.material}</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center border border-saffron-200 rounded-full">
                    <button onClick={() => updateQty(i.product._id, i.quantity - 1)} className="p-2"><Minus className="w-3 h-3" /></button>
                    <span className="px-3 text-sm font-semibold">{i.quantity}</span>
                    <button onClick={() => updateQty(i.product._id, i.quantity + 1)} className="p-2"><Plus className="w-3 h-3" /></button>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-maroon-900">₹{i.product.price * i.quantity}</div>
                    <button onClick={() => removeItem(i.product._id)} className="text-xs text-maroon-500 hover:text-red-700 inline-flex items-center gap-1 mt-1">
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="card p-6 h-fit sticky top-28">
          <h3 className="font-display text-xl font-bold">Order summary</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
            <div className="flex justify-between"><span>Tax (5%)</span><span>₹{tax}</span></div>
            <div className="border-t border-saffron-200 pt-3 mt-3 flex justify-between font-bold text-lg text-maroon-900">
              <span>Total</span><span>₹{total}</span>
            </div>
          </div>
          <Link to="/checkout" className="btn-primary w-full mt-6">Proceed to checkout</Link>
          <Link to="/shop" className="block text-center text-sm text-saffron-700 hover:underline mt-3">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
