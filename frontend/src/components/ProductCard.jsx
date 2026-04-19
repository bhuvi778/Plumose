import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useFavorites } from '../context/FavoriteContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { isFavorite, toggle } = useFavorites();
  const { addToCart } = useCart();
  const fav = isFavorite(product._id);
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group card overflow-hidden hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
      <Link to={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-saffron-50">
        {imgError || !product.images?.[0] ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-saffron-50 to-amber-100 gap-3 p-4">
            <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
              {product.category?.icon || '🪔'}
            </span>
            <span className="text-xs text-saffron-700/80 font-medium text-center line-clamp-2 leading-tight">
              {product.name}
            </span>
          </div>
        ) : (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-maroon-800 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {discount}% OFF
          </span>
        )}
        {product.bestseller && (
          <span className="absolute top-3 right-12 bg-gradient-to-r from-gold-500 to-saffron-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            BESTSELLER
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product._id); }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur transition ${fav ? 'bg-maroon-700 text-white' : 'bg-white/90 text-maroon-700 hover:bg-white'}`}
        >
          <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
        </button>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-maroon-900 line-clamp-2 min-h-[2.5rem] text-sm group-hover:text-saffron-700 transition">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mt-1 text-xs text-maroon-600">
          <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
          <span>{(product.rating || 4.5).toFixed(1)}</span>
          <span className="text-maroon-400">({product.numReviews || 0})</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-maroon-900">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-maroon-400 line-through">₹{product.mrp}</span>
          )}
        </div>
        <button
          onClick={() => addToCart(product._id, 1)}
          className="mt-3 w-full btn-outline text-sm py-2"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
