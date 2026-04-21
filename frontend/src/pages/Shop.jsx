import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import api from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';
import { SlidersHorizontal, X, ChevronRight } from 'lucide-react';
import { useVertical } from '../context/VerticalContext.jsx';

export default function Shop() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const { vertical, config } = useVertical();
  const base = config.base;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [category, setCategory] = useState(categorySlug || '');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    api.get(`/categories?vertical=${vertical}`).then((r) => setCategories(r.data));
  }, [vertical]);

  useEffect(() => { setCategory(categorySlug || ''); }, [categorySlug]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('vertical', vertical);
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (priceRange[0]) params.set('min', priceRange[0]);
    if (priceRange[1] < 10000) params.set('max', priceRange[1]);
    if (sort !== 'newest') params.set('sort', sort);
    params.set('limit', 48);
    api.get(`/products?${params.toString()}`)
      .then((r) => setProducts(r.data.products))
      .finally(() => setLoading(false));
  }, [vertical, category, search, priceRange, sort]);

  const activeCat = categories.find((c) => c.slug === category);

  return (
    <div className="container-x py-10">
      <nav className="text-xs text-ink-soft mb-5 flex items-center gap-1.5">
        <Link to={base} className="hover:text-brand">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`${base}/shop`} className="hover:text-brand">Shop</Link>
        {activeCat && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="text-ink">{activeCat.name}</span>
          </>
        )}
      </nav>

      <div className="mb-8 pb-6 border-b border-brand/15">
        <h1 className="display text-4xl md:text-5xl">
          {search ? `"${search}"` : activeCat ? activeCat.name : 'All Products'}
        </h1>
        {activeCat?.description && (
          <p className="mt-2 text-sm text-ink-soft max-w-xl">{activeCat.description}</p>
        )}
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className={`${showFilter ? 'fixed inset-0 z-50 bg-surface overflow-auto p-6' : 'hidden'} lg:block lg:static lg:p-0`}>
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h3 className="display text-2xl">Filters</h3>
            <button onClick={() => setShowFilter(false)}><X className="w-5 h-5" /></button>
          </div>

          <div className="card p-5 space-y-6 lg:sticky lg:top-24">
            <div>
              <div className="label">Category</div>
              <div className="space-y-1 max-h-72 overflow-auto pr-1">
                <button
                  onClick={() => setCategory('')}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                    !category ? 'bg-brand text-white' : 'text-ink hover:bg-brand/5'
                  }`}
                >
                  All products
                </button>
                {categories.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => setCategory(c.slug)}
                    className={`flex w-full justify-between items-center px-3 py-2 rounded-lg text-sm transition ${
                      category === c.slug ? 'bg-brand text-white' : 'text-ink hover:bg-brand/5'
                    }`}
                  >
                    <span>{c.icon} {c.name}</span>
                    <span className="text-xs opacity-60">{c.productCount}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-brand/10 pt-4">
              <div className="label">Price range</div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([+e.target.value || 0, priceRange[1]])}
                  className="input text-xs"
                  placeholder="Min"
                />
                <span className="text-ink-mute">—</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value || 10000])}
                  className="input text-xs"
                  placeholder="Max"
                />
              </div>
              <input
                type="range" min={0} max={10000} step={100}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                className="w-full mt-3 accent-brand"
              />
              <div className="flex justify-between text-[11px] text-ink-mute mt-1">
                <span>₹0</span><span>₹10,000</span>
              </div>
            </div>

            <button
              onClick={() => { setCategory(''); setPriceRange([0, 10000]); setSort('newest'); setSearchParams({}); }}
              className="btn-ghost w-full text-xs"
            >
              Reset filters
            </button>
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between mb-6 gap-3">
            <button onClick={() => setShowFilter(true)} className="btn-outline lg:hidden text-xs py-2">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </button>
            <span className="text-sm text-ink-soft">{products.length} products</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input text-sm max-w-[200px]"
            >
              <option value="newest">Newest first</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="card p-16 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="display text-2xl mb-2">No products found</h3>
              <p className="text-sm text-ink-soft">Adjust your filters or try a different search.</p>
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
