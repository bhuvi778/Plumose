import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useFavorites } from '../context/FavoriteContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useVertical } from '../context/VerticalContext.jsx';

export default function ProductCard({ product }) {
  const { isFavorite, toggle } = useFavorites();
  const { addToCart } = useCart();
  const { config } = useVertical();
  const fav = isFavorite(product._id);
  const [imgError, setImgError] = useState(false);
  const base = config.base && config.base !== '/' ? config.base : '/devapi';

  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <div className="group card-hover overflow-hidden flex flex-col">
      <Link
        to={`${base}/product/${product.slug}`}
        className="block relative overflow-hidden bg-brand-soft"
        style={{ aspectRatio: '1/1' }}
      >
        {imgError || !product.images?.[0] ? (
          <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">
            {product.category?.icon || '🪔'}
          </div>
        ) : (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-ink/50 flex items-center justify-center">
            <span className="chip-solid">Sold Out</span>
          </div>
        )}

        {discount > 0 && product.stock > 0 && (
          <div className="absolute top-3 left-3 chip-solid bg-accent">
            {discount}% OFF
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product._id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur ${
            fav
              ? 'bg-brand text-white shadow-glow'
              : 'bg-white/80 text-ink-soft hover:bg-white hover:text-brand'
          }`}
          aria-label="Toggle favorite"
        >
          <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
        </button>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        {product.category?.name && (
          <div className="text-[10px] uppercase tracking-wider text-brand font-semibold mb-1">
            {product.category.name}
          </div>
        )}
        <Link to={`${base}/product/${product.slug}`} className="flex-1">
          <h3 className="text-sm font-semibold text-ink line-clamp-2 hover:text-brand transition">
            {product.name}
          </h3>
        </Link>

        {product.rating > 0 && (
          <div className="mt-1.5 flex items-center gap-1 text-xs">
            <Star className="w-3 h-3 fill-accent text-accent" />
            <span className="font-medium text-ink">{product.rating.toFixed(1)}</span>
            <span className="text-ink-mute">({product.numReviews})</span>
          </div>
        )}

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-brand-dark">₹{product.price}</span>
          {discount > 0 && (
            <span className="text-xs text-ink-mute line-through">₹{product.mrp}</span>
          )}
        </div>

        <button
          onClick={() => {
            addToCart(product._id, 1);
            toast.success('Added to cart');
          }}
          disabled={product.stock === 0}
          className="btn-primary mt-3 w-full text-xs py-2"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
