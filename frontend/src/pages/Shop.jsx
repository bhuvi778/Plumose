import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import api from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import Loader from '../components/Loader.jsx';
import { SlidersHorizontal, X } from 'lucide-react';

export default function Shop() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [category, setCategory] = useState(categorySlug || '');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data));
  }, []);

  useEffect(() => { setCategory(categorySlug || ''); }, [categorySlug]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (priceRange[0]) params.set('min', priceRange[0]);
    if (priceRange[1] < 5000) params.set('max', priceRange[1]);
    if (sort !== 'newest') params.set('sort', sort);
    params.set('limit', 48);
    api.get(`/products?${params.toString()}`)
      .then((r) => setProducts(r.data.products))
      .finally(() => setLoading(false));
  }, [category, search, priceRange, sort]);

  const activeCat = categories.find((c) => c.slug === category);

  return (
    <div className="container-x py-10">
      <div className="mb-8">
        <nav className="text-xs text-maroon-600 mb-3">
          <Link to="/" className="hover:text-saffron-700">Home</Link> / <Link to="/shop" className="hover:text-saffron-700">Shop</Link>
          {activeCat && <> / <span className="text-maroon-900 font-medium">{activeCat.name}</span></>}
          {search && <> / <span className="text-maroon-900 font-medium">"{search}"</span></>}
        </nav>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-maroon-900">
          {search ? `Results for "${search}"` : activeCat ? activeCat.name : 'Shop all essentials'}
        </h1>
        {activeCat?.description && <p className="mt-2 text-maroon-700/80">{activeCat.description}</p>}
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar filter */}
        <aside className={`${showFilter ? 'fixed inset-0 z-50 bg-cream/95 backdrop-blur p-6 overflow-auto' : 'hidden'} lg:block lg:static lg:p-0`}>
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h3 className="font-display text-xl font-bold">Filters</h3>
            <button onClick={() => setShowFilter(false)}><X /></button>
          </div>
          <div className="card p-5 space-y-6 sticky top-28">
            <div>
              <h4 className="label">Categories</h4>
              <div className="space-y-1 max-h-72 overflow-auto pr-2">
                <button onClick={() => setCategory('')}
                  className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm ${!category ? 'bg-saffron-100 text-maroon-900 font-medium' : 'text-maroon-700 hover:bg-saffron-50'}`}>
                  All categories
                </button>
                {categories.map((c) => (
                  <button key={c._id} onClick={() => setCategory(c.slug)}
                    className={`flex w-full justify-between items-center px-3 py-1.5 rounded-lg text-sm ${category === c.slug ? 'bg-saffron-100 text-maroon-900 font-medium' : 'text-maroon-700 hover:bg-saffron-50'}`}>
                    <span>{c.icon} {c.name}</span>
                    <span className="text-xs text-maroon-400">{c.productCount}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="label">Price range</h4>
              <div className="flex items-center gap-2">
                <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])} className="input" placeholder="Min" />
                <span className="text-maroon-500">–</span>
                <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], +e.target.value])} className="input" placeholder="Max" />
              </div>
              <input type="range" min={0} max={5000} step={100} value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                className="w-full mt-3 accent-saffron-500" />
            </div>

            <button onClick={() => { setCategory(''); setPriceRange([0, 5000]); setSort('newest'); setSearchParams({}); }}
              className="btn-outline w-full text-sm">Reset filters</button>
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between mb-5">
            <button onClick={() => setShowFilter(true)} className="btn-outline lg:hidden text-sm">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <span className="text-sm text-maroon-700">{products.length} products</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="input max-w-[200px] bg-white text-sm">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top rated</option>
              <option value="popular">Most popular</option>
            </select>
          </div>

          {loading ? <Loader /> : products.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-6xl mb-4">🪔</div>
              <h3 className="font-display text-2xl font-bold text-maroon-900">No products found</h3>
              <p className="text-maroon-600 mt-2">Try adjusting your filters or search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
