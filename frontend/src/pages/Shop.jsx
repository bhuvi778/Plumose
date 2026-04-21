import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import api from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
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
    <div className="container-x py-20">
      {/* Page header */}
      <div className="mb-10 border-b border-ink/20 pb-8">
        <nav className="text-[10px] uppercase tracking-[0.2em] text-ink/40 font-mono mb-4">
          <Link to="/" className="hover:text-ink link-strike">Home</Link>
          {' / '}
          <Link to="/shop" className="hover:text-ink link-strike">Shop</Link>
          {activeCat && <> / <span className="text-ink">{activeCat.name}</span></>}
          {search && <> / <span className="text-ink">&ldquo;{search}&rdquo;</span></>}
        </nav>
        <h1
          className="text-5xl md:text-7xl text-ink leading-[0.85] tracking-tighter"
          style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}
        >
          {search ? `"${search}"` : activeCat ? activeCat.name : 'All Products'}
        </h1>
        {activeCat?.description && (
          <p className="mt-3 text-sm text-ink/50 max-w-md font-body leading-relaxed">{activeCat.description}</p>
        )}
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-10">
        {/* â”€â”€ Sidebar filter â”€â”€ */}
        <aside className={`${showFilter ? 'fixed inset-0 z-50 bg-concrete overflow-auto p-8' : 'hidden'} lg:block lg:static lg:p-0`}>
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h3 className="text-2xl text-ink" style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}>Filters</h3>
            <button onClick={() => setShowFilter(false)} className="text-ink"><X className="w-5 h-5" /></button>
          </div>

          <div className="border border-ink p-5 space-y-8 lg:sticky lg:top-24">
            {/* Categories */}
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-ink/40 font-mono mb-3">Category</div>
              <div className="space-y-1 max-h-64 overflow-auto">
                <button
                  onClick={() => setCategory('')}
                  className={`block w-full text-left px-2 py-1.5 text-xs uppercase tracking-wide font-medium transition-colors ${
                    !category ? 'bg-ink text-concrete' : 'text-ink hover:bg-ink/5'
                  }`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => setCategory(c.slug)}
                    className={`flex w-full justify-between items-center px-2 py-1.5 text-xs uppercase tracking-wide transition-colors ${
                      category === c.slug ? 'bg-ink text-concrete' : 'text-ink hover:bg-ink/5'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] font-mono opacity-50">{c.productCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-ink/40 font-mono mb-3">Price</div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                  className="input-brutal text-xs"
                  placeholder="Min"
                />
                <span className="text-ink/30">â€”</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  className="input-brutal text-xs"
                  placeholder="Max"
                />
              </div>
              <input
                type="range" min={0} max={5000} step={100}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                className="w-full mt-3 accent-ink"
              />
            </div>

            <button
              onClick={() => { setCategory(''); setPriceRange([0, 5000]); setSort('newest'); setSearchParams({}); }}
              className="btn-brutal-outline w-full justify-center text-[10px]"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* â”€â”€ Product grid â”€â”€ */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setShowFilter(true)} className="btn-brutal-outline lg:hidden text-[10px] py-2">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </button>
            <span className="text-[10px] uppercase tracking-[0.2em] text-ink/40 font-mono">
              {products.length} items
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-brutal text-xs max-w-[180px]"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low â†’ High</option>
              <option value="price-desc">Price: High â†’ Low</option>
              <option value="rating">Top Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="border border-ink/20 p-16 text-center">
              <div
                className="text-6xl text-ink/10 mb-4"
                style={{ fontFamily: 'Anton, Impact, sans-serif' }}
              >
                0
              </div>
              <h3
                className="text-2xl text-ink mb-2"
                style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}
              >
                No Products Found
              </h3>
              <p className="text-xs text-ink/40 font-mono uppercase tracking-wide">Adjust your filters or search.</p>
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
