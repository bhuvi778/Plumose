import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { Heart, ShoppingBag, Minus, Plus, Star } from 'lucide-react';
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
    if (!user) return toast.error('Please sign in to review');
    try {
      await api.post(`/products/${product._id}/reviews`, { rating, comment });
      toast.success('Review submitted.');
      const r = await api.get(`/products/${slug}`);
      setData(r.data);
      setComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="container-x py-20">
      {/* Breadcrumb */}
      <nav className="text-[10px] uppercase tracking-[0.2em] text-ink/40 font-mono mb-8">
        <Link to="/" className="hover:text-ink link-strike">Home</Link>
        {' / '}
        <Link to="/shop" className="hover:text-ink link-strike">Shop</Link>
        {product.category && (
          <> / <Link to={`/shop/${product.category.slug}`} className="hover:text-ink link-strike">{product.category.name}</Link></>
        )}
        {' / '}<span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* â”€â”€ Images â”€â”€ */}
        <div>
          <div className="relative overflow-hidden bg-ink/5" style={{ aspectRatio: '1/1' }}>
            <img
              src={product.images?.[activeImg] || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover img-cinematic"
            />
            {product.material && <div className="tech-label bottom-4 left-4">{product.material}</div>}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-ink' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* â”€â”€ Details â”€â”€ */}
        <div>
          {product.bestseller && (
            <div className="inline-block text-[10px] font-mono uppercase tracking-[0.25em] bg-ink text-concrete px-2 py-1 mb-4">Bestseller</div>
          )}

          <h1
            className="text-4xl md:text-5xl text-ink leading-[0.85] tracking-tighter"
            style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}
          >
            {product.name}
          </h1>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((n) => (
                <Star key={n} className={`w-3.5 h-3.5 ${n <= Math.round(product.rating) ? 'fill-ink text-ink' : 'text-ink/20'}`} />
              ))}
            </div>
            <span className="text-[10px] font-mono text-ink/40 uppercase tracking-wide">
              {(product.rating || 4.5).toFixed(1)} Â· {product.numReviews || 0} reviews
            </span>
          </div>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-mono font-bold text-ink">${product.price}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-lg font-mono text-ink/30 line-through">${product.mrp}</span>
                <span className="text-[10px] bg-accent text-white px-2 py-0.5 font-bold font-mono">{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="mt-6 text-sm text-ink/60 font-body leading-relaxed">{product.description}</p>

          {/* Specs grid */}
          <dl className="mt-6 border-t border-ink/10 pt-4 grid grid-cols-2 gap-y-3 text-xs">
            {product.material && (
              <><dt className="text-ink/40 font-mono uppercase tracking-wide">Material</dt><dd className="text-ink font-medium">{product.material}</dd></>
            )}
            {product.weight && (
              <><dt className="text-ink/40 font-mono uppercase tracking-wide">Weight</dt><dd className="text-ink font-medium">{product.weight}</dd></>
            )}
            {product.dimensions && (
              <><dt className="text-ink/40 font-mono uppercase tracking-wide">Dimensions</dt><dd className="text-ink font-medium">{product.dimensions}</dd></>
            )}
            <dt className="text-ink/40 font-mono uppercase tracking-wide">Stock</dt>
            <dd className={`font-medium font-mono ${product.stock > 0 ? 'text-ink' : 'text-accent'}`}>
              {product.stock > 0 ? `${product.stock} available` : 'Sold Out'}
            </dd>
          </dl>

          {/* Qty + actions */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center border border-ink">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-ink hover:text-concrete transition-colors"><Minus className="w-4 h-4" /></button>
              <span className="px-4 text-sm font-mono">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-ink hover:text-concrete transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
            <button
              onClick={() => addToCart(product._id, qty)}
              disabled={product.stock === 0}
              className="btn-brutal flex-1 justify-center"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
            <button
              onClick={() => toggle(product._id)}
              className={`p-3 border transition-colors ${fav ? 'bg-ink text-concrete border-ink' : 'border-ink text-ink hover:bg-ink hover:text-concrete'}`}
            >
              <Heart className={`w-5 h-5 ${fav ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* â”€â”€ Reviews â”€â”€ */}
      <section className="mt-20 border-t border-ink/20 pt-12">
        <h2 className="text-3xl text-ink mb-8" style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}>
          Reviews
        </h2>
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-10">
          <div className="border border-ink p-6">
            <div className="text-[10px] uppercase tracking-[0.25em] text-ink/40 font-mono mb-4">Write a Review</div>
            <form onSubmit={submitReview} className="space-y-4">
              <div className="flex gap-1">
                {[1,2,3,4,5].map((n) => (
                  <button type="button" key={n} onClick={() => setRating(n)}>
                    <Star className={`w-6 h-6 transition-colors ${n <= rating ? 'fill-ink text-ink' : 'text-ink/20'}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input-brutal resize-none"
                rows={4}
                placeholder="Share your experienceâ€¦"
              />
              <button className="btn-brutal w-full justify-center">Submit</button>
            </form>
          </div>
          <div className="space-y-4">
            {product.reviews?.length ? product.reviews.map((r, i) => (
              <div key={i} className="border border-ink/10 p-5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-ink">{r.name}</div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((n) => <Star key={n} className={`w-3 h-3 ${n <= r.rating ? 'fill-ink text-ink' : 'text-ink/20'}`} />)}
                  </div>
                </div>
                <p className="mt-2 text-xs text-ink/60 font-body leading-relaxed">{r.comment}</p>
              </div>
            )) : (
              <p className="text-xs text-ink/40 font-mono uppercase tracking-wide">No reviews yet. Be first.</p>
            )}
          </div>
        </div>
      </section>

      {/* â”€â”€ Related â”€â”€ */}
      {related?.length > 0 && (
        <section className="mt-20 border-t border-ink/20 pt-12">
          <h2 className="text-3xl text-ink mb-8" style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}>
            Related
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
