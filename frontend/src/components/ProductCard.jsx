import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoriteContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { isFavorite, toggle } = useFavorites();
  const { addToCart } = useCart();
  const fav = isFavorite(product._id);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group bg-concrete border border-ink/10 hover:border-ink transition-colors duration-300">
      {/* â”€â”€ Image â”€â”€ */}
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
        {imgError || !product.images?.[0] ? (
          <div className="w-full h-full flex items-center justify-center bg-ink/5">
            <span
              className="text-5xl text-ink/20"
              style={{ fontFamily: 'Anton, Impact, sans-serif' }}
            >
              P
            </span>
          </div>
        ) : (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover img-cinematic"
          />
        )}

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-concrete/60 flex items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/50 font-mono">Sold Out</span>
          </div>
        )}

        {/* Tech label â€” material or discount */}
        {product.material ? (
          <div className="tech-label bottom-3 left-3">{product.material}</div>
        ) : product.mrp > product.price ? (
          <div className="tech-label bottom-3 left-3">
            {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% Off
          </div>
        ) : null}

        {/* Favorite button */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product._id); }}
          className={`absolute top-3 right-3 w-7 h-7 flex items-center justify-center transition-all ${
            fav ? 'bg-ink text-concrete' : 'bg-white/90 text-ink hover:bg-ink hover:text-concrete'
          }`}
          aria-label="Toggle favorite"
        >
          <Heart className={`w-3.5 h-3.5 ${fav ? 'fill-current' : ''}`} />
        </button>
      </Link>

      {/* â”€â”€ Metadata â”€â”€ */}
      <div className="p-3 border-t border-ink/10">
        <Link to={`/product/${product.slug}`}>
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink line-clamp-1 link-strike">
            {product.name}
          </div>
        </Link>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-mono text-ink">${product.price}</span>
          {product.mrp > product.price && (
            <span className="text-xs font-mono text-ink/30 line-through">${product.mrp}</span>
          )}
        </div>

        <button
          onClick={() => addToCart(product._id, 1)}
          className="mt-3 w-full text-[10px] uppercase tracking-widest font-bold border border-ink px-3 py-2 text-ink hover:bg-ink hover:text-concrete transition-colors duration-150"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
