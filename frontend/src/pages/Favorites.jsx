import { useFavorites } from '../context/FavoriteContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Favorites() {
  const { favorites } = useFavorites();
  const products = favorites.products || [];

  if (products.length === 0) return (
    <div className="container-x py-20 text-center">
      <Heart className="w-16 h-16 mx-auto text-saffron-400" />
      <h2 className="font-display text-3xl font-bold mt-4">No favorites yet</h2>
      <p className="text-maroon-600 mt-2">Tap the heart on any product to save it here.</p>
      <Link to="/shop" className="btn-primary mt-6 inline-flex">Browse products</Link>
    </div>
  );

  return (
    <div className="container-x py-10">
      <h1 className="font-display text-4xl font-bold text-maroon-900 mb-2">Your favorites</h1>
      <p className="text-maroon-600 mb-8">{products.length} saved items</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}
