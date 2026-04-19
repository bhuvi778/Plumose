import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { Heart, ShoppingBag, Minus, Plus, ShieldCheck, Truck, RotateCcw, Star } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useFavorites } from '../context/FavoriteContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const { addToCart } = useCart();
  const { toggle, isFavorite } = useFavorites();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    setLoading(true);
    setActiveImg(0);
    setQty(1);
    api.get(`/products/${slug}`)
      .then((r) => setData(r.data))
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading || !data) return <Loader />;
  const { product, related } = data;
  const fav = isFavorite(product._id);
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to review');
    try {
      await api.post(`/products/${product._id}/reviews`, { rating, comment });
      toast.success('Thank you for your review!');
      const r = await api.get(`/products/${slug}`);
      setData(r.data);
      setComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="container-x py-10">
      <nav className="text-xs text-maroon-600 mb-6">
        <Link to="/" className="hover:text-saffron-700">Home</Link> / <Link to="/shop" className="hover:text-saffron-700">Shop</Link>
        {product.category && <> / <Link to={`/shop/${product.category.slug}`} className="hover:text-saffron-700">{product.category.name}</Link></>}
        / <span className="text-maroon-900">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="card overflow-hidden aspect-square bg-saffron-50">
            <img src={product.images?.[activeImg] || product.images?.[0]} alt={product.name}
              className="w-full h-full object-cover" />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3 mt-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${activeImg === i ? 'border-saffron-500' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.bestseller && <span className="chip text-saffron-700 mb-3">⭐ Bestseller</span>}
          <h1 className="font-display text-4xl font-bold text-maroon-900">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-maroon-600">
            <div className="flex text-gold-500">
              {[1,2,3,4,5].map((n) => (
                <Star key={n} className={`w-4 h-4 ${n <= Math.round(product.rating) ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span>{(product.rating || 4.5).toFixed(1)} • {product.numReviews || 0} reviews</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-maroon-900">₹{product.price}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-lg text-maroon-400 line-through">₹{product.mrp}</span>
                <span className="chip bg-green-100 border-green-200 text-green-800">{discount}% OFF</span>
              </>
            )}
          </div>
          <div className="text-xs text-maroon-500 mt-1">Inclusive of all taxes</div>

          <p className="mt-5 text-maroon-800 leading-relaxed">{product.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {product.material && <><dt className="text-maroon-500">Material</dt><dd className="text-maroon-900 font-medium">{product.material}</dd></>}
            {product.weight && <><dt className="text-maroon-500">Weight</dt><dd className="text-maroon-900 font-medium">{product.weight}</dd></>}
            {product.dimensions && <><dt className="text-maroon-500">Dimensions</dt><dd className="text-maroon-900 font-medium">{product.dimensions}</dd></>}
            <dt className="text-maroon-500">Availability</dt>
            <dd className={`font-medium ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
              {product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}
            </dd>
          </dl>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-saffron-200 rounded-full">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3"><Minus className="w-4 h-4" /></button>
              <span className="px-4 font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={() => addToCart(product._id, qty)} disabled={product.stock === 0}
              className="btn-primary flex-1">
              <ShoppingBag className="w-4 h-4" /> Add to cart
            </button>
            <button onClick={() => toggle(product._id)}
              className={`p-3 rounded-full border ${fav ? 'bg-maroon-700 border-maroon-700 text-white' : 'border-saffron-300 text-maroon-700 hover:bg-saffron-50'}`}>
              <Heart className={`w-5 h-5 ${fav ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: Truck, text: 'Free shipping above ₹999' },
              { icon: ShieldCheck, text: 'Blessed & authentic' },
              { icon: RotateCcw, text: '7-day easy returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="card p-3 text-center">
                <Icon className="w-5 h-5 mx-auto text-saffron-600" />
                <div className="text-xs text-maroon-700 mt-1">{text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold text-maroon-900 mb-4">Customer reviews</h2>
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-8">
          <div className="card p-6">
            <h3 className="font-semibold mb-3">Write a review</h3>
            <form onSubmit={submitReview} className="space-y-3">
              <div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((n) => (
                    <button type="button" key={n} onClick={() => setRating(n)}>
                      <Star className={`w-6 h-6 ${n <= rating ? 'fill-gold-500 text-gold-500' : 'text-maroon-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                className="input" rows={4} placeholder="Share your experience..." />
              <button className="btn-primary w-full">Submit review</button>
            </form>
          </div>
          <div className="space-y-4">
            {product.reviews?.length ? product.reviews.map((r, i) => (
              <div key={i} className="card p-5">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-maroon-900">{r.name}</div>
                  <div className="flex text-gold-500">
                    {[1,2,3,4,5].map((n) => <Star key={n} className={`w-3 h-3 ${n <= r.rating ? 'fill-current' : ''}`} />)}
                  </div>
                </div>
                <p className="mt-2 text-sm text-maroon-800">{r.comment}</p>
              </div>
            )) : <p className="text-maroon-600">Be the first to review this product.</p>}
          </div>
        </div>
      </section>

      {related?.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-maroon-900 mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
