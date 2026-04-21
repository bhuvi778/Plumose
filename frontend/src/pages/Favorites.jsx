import { useFavorites } from '../context/FavoriteContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useVertical } from '../context/VerticalContext.jsx';

export default function Favorites() {
  const { favorites } = useFavorites();
  const { config } = useVertical();
  const products = favorites.products || [];
  const base = config.base;

  if (products.length === 0)
    return (
      <div className="container-x py-24 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-brand/10 text-brand flex items-center justify-center mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="display text-3xl mb-2">No favorites yet</h2>
        <p className="text-sm text-ink-soft mb-6">Jo pasand aaye use heart icon pe tap karke yahan save kar lein.</p>
        <Link to={`${base}/shop`} className="btn-primary">Browse Products</Link>
      </div>
    );

  return (
    <div className="container-x py-10">
      <div className="mb-8 pb-6 border-b border-brand/15">
        <div className="kicker mb-2">Saved</div>
        <h1 className="display text-4xl md:text-5xl">Your Favorites</h1>
        <p className="text-sm text-ink-soft mt-2">{products.length} items saved</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}
