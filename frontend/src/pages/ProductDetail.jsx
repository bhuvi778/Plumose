import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { Heart, ShoppingBag, Minus, Plus, Star, Truck, ShieldCheck, RefreshCcw, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useFavorites } from '../context/FavoriteContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useVertical } from '../context/VerticalContext.jsx';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { config } = useVertical();
  const base = config.base;

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
      .catch(() => navigate(`${base}/shop`))
      .finally(() => setLoading(false));
  }, [slug, navigate, base]);

  if (loading || !data) return <Loader />;
  const { product, related } = data;
  const fav = isFavorite(product._id);
  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please sign in to review');
    try {
      await api.post(`/products/${product._id}/reviews`, { rating, comment });
      toast.success('Review submitted');
      const r = await api.get(`/products/${slug}`);
      setData(r.data);
      setComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="container-x py-8">
      <nav className="text-xs text-ink-soft mb-6 flex items-center gap-1.5 flex-wrap">
        <Link to={base} className="hover:text-brand">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`${base}/shop`} className="hover:text-brand">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3" />
            <Link to={`${base}/shop/${product.category.slug}`} className="hover:text-brand">{product.category.name}</Link>
          </>
        )}
        <ChevronRight className="w-3 h-3" />
        <span className="text-ink truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="relative overflow-hidden rounded-3xl bg-brand-soft shadow-card" style={{ aspectRatio: '1/1' }}>
            <img
              src={product.images?.[activeImg] || product.images?.[0] || 'https://via.placeholder.com/600?text=Plumose'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <div className="absolute top-4 left-4 chip-solid bg-accent">{discount}% OFF</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-none">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    activeImg === i ? 'border-brand shadow-glow' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.bestseller && (
            <div className="chip-solid mb-3">⭐ Bestseller</div>
          )}
          {product.category?.name && (
            <div className="kicker mb-2">{product.category.name}</div>
          )}

          <h1 className="display text-3xl md:text-4xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className={`w-4 h-4 ${n <= Math.round(product.rating || 0) ? 'fill-accent text-accent' : 'text-ink-mute'}`} />
              ))}
            </div>
            <span className="text-xs text-ink-soft">
              {(product.rating || 0).toFixed(1)} · {product.numReviews || 0} reviews
            </span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-brand-dark">₹{product.price}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-lg text-ink-mute line-through">₹{product.mrp}</span>
                <span className="text-sm font-semibold text-accent">{discount}% off</span>
              </>
            )}
          </div>

          <p className="mt-5 text-sm text-ink-soft leading-relaxed">{product.description}</p>

          {/* Specs */}
          {(product.material || product.weight || product.dimensions) && (
            <dl className="mt-5 grid grid-cols-2 gap-y-3 text-sm border-y border-brand/10 py-4">
              {product.material && (
                <>
                  <dt className="text-ink-soft">Material</dt>
                  <dd className="font-medium text-ink">{product.material}</dd>
                </>
              )}
              {product.weight && (
                <>
                  <dt className="text-ink-soft">Weight</dt>
                  <dd className="font-medium text-ink">{product.weight}</dd>
                </>
              )}
              {product.dimensions && (
                <>
                  <dt className="text-ink-soft">Dimensions</dt>
                  <dd className="font-medium text-ink">{product.dimensions}</dd>
                </>
              )}
              <dt className="text-ink-soft">Stock</dt>
              <dd className={`font-medium ${product.stock > 0 ? 'text-ink' : 'text-accent'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
              </dd>
            </dl>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-brand/25 overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-brand/10 transition"><Minus className="w-4 h-4" /></button>
              <span className="px-4 min-w-[40px] text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-brand/10 transition"><Plus className="w-4 h-4" /></button>
            </div>
            <button
              onClick={() => { addToCart(product._id, qty); toast.success('Added to cart'); }}
              disabled={product.stock === 0}
              className="btn-primary flex-1"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
            <button
              onClick={() => toggle(product._id)}
              className={`btn ${fav ? 'bg-brand text-white' : 'bg-surface-soft text-ink border border-brand/25'} !px-4`}
              aria-label="Toggle favorite"
            >
              <Heart className={`w-5 h-5 ${fav ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Trust */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { Icon: Truck, title: 'Free shipping', sub: '₹499+' },
              { Icon: ShieldCheck, title: 'Authentic', sub: 'Verified' },
              { Icon: RefreshCcw, title: 'Easy returns', sub: '7 days' },
            ].map(({ Icon, title, sub }) => (
              <div key={title} className="card p-3 text-center">
                <Icon className="w-5 h-5 text-brand mx-auto mb-1" />
                <div className="text-xs font-semibold text-ink">{title}</div>
                <div className="text-[10px] text-ink-soft">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16 pt-10 border-t border-brand/15">
        <h2 className="display text-2xl md:text-3xl mb-6">Customer Reviews</h2>
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-8">
          <div className="card p-6">
            <div className="label">Write a review</div>
            <form onSubmit={submitReview} className="space-y-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button type="button" key={n} onClick={() => setRating(n)}>
                    <Star className={`w-7 h-7 ${n <= rating ? 'fill-accent text-accent' : 'text-ink-mute'}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input"
                rows={4}
                placeholder="Share your experience..."
              />
              <button className="btn-primary w-full">Submit Review</button>
            </form>
          </div>
          <div className="space-y-3">
            {product.reviews?.length ? product.reviews.map((r, i) => (
              <div key={i} className="card p-5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-ink">{r.name}</div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? 'fill-accent text-accent' : 'text-ink-mute'}`} />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">{r.comment}</p>
              </div>
            )) : (
              <div className="card p-8 text-center text-ink-soft text-sm">
                No reviews yet. Be the first to share your experience!
              </div>
            )}
          </div>
        </div>
      </section>

      {related?.length > 0 && (
        <section className="mt-16 pt-10 border-t border-brand/15">
          <h2 className="display text-2xl md:text-3xl mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
