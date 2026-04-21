import { useFavorites } from '../context/FavoriteContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { favorites } = useFavorites();
  const products = favorites.products || [];

  if (products.length === 0) return (
    <div className="container-x py-32 text-center">
      <div className="text-5xl text-ink/10 font-mono mb-4">0</div>
      <h2 className="text-3xl text-ink mb-2" style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}>No Favorites</h2>
      <p className="text-xs text-ink/40 font-mono uppercase tracking-wide mb-6">Tap the heart on any product to save it here.</p>
      <Link to="/shop" className="btn-brutal inline-flex">Browse Products</Link>
    </div>
  );

  return (
    <div className="container-x py-20">
      <div className="mb-10 border-b border-ink/20 pb-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-mono mb-2">Saved</div>
        <h1 className="text-5xl text-ink leading-[0.85] tracking-tighter" style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}>
          Favorites
        </h1>
        <p className="text-xs text-ink/40 font-mono mt-2 uppercase tracking-wide">{products.length} items saved</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}
