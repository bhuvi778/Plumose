import { useEffect, useState, useCallback, useRef } from 'react';
import api from '../api/client.js';
import toast from 'react-hot-toast';
import { Edit, Trash2, Plus, X, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const LIMIT = 15;
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const empty = {
  name: '', slug: '', description: '', shortDescription: '', price: 0, mrp: 0,
  images: [''], category: '', stock: 0, material: '', weight: '', dimensions: '',
  featured: false, trending: false, bestseller: false,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const searchTimer = useRef(null);

  const load = useCallback((p, cat, search) => {
    setLoading(true);
    const params = new URLSearchParams({ page: p ?? 1, limit: LIMIT });
    if (cat ?? catFilter) params.set('category', cat ?? catFilter);
    if (search ?? q) params.set('search', search ?? q);
    api.get(`/products?${params}`)
      .then((r) => {
        setProducts(r.data.products || []);
        setTotal(r.data.total || 0);
        setPages(r.data.pages || 1);
        setPage(p ?? 1);
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  useEffect(() => {
    load(1, '', '');
    api.get('/categories').then((r) => setCats(r.data));
  }, []); // eslint-disable-line

  const handleCatChange = (val) => {
    setCatFilter(val);
    load(1, val, q);
  };

  const handleSearch = (val) => {
    setQ(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => load(1, catFilter, val), 400);
  };

  const goPage = (p) => load(p, catFilter, q);

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...editing, slug: editing.slug || slugify(editing.name), images: editing.images.filter(Boolean) };
    try {
      if (editing._id) await api.put(`/products/${editing._id}`, payload);
      else await api.post('/products', payload);
      toast.success('Saved');
      setEditing(null);
      load(page, catFilter, q);
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Deleted');
      load(products.length === 1 && page > 1 ? page - 1 : page, catFilter, q);
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-3 mb-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-maroon-900">Products</h2>
          <p className="text-maroon-600 text-sm mt-1">{total} products total</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-maroon-400 pointer-events-none" />
            <input
              placeholder="Search products..."
              value={q}
              onChange={(e) => handleSearch(e.target.value)}
              className="input pl-9 w-52"
            />
          </div>
          {/* Category filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-maroon-400 pointer-events-none" />
            <select value={catFilter} onChange={(e) => handleCatChange(e.target.value)} className="input pl-9 w-52">
              <option value="">All categories</option>
              {cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <button
            onClick={() => setEditing({ ...empty, category: cats[0]?._id || '' })}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-saffron-50 text-maroon-700 text-xs uppercase">
              <tr>
                <th className="text-left p-3 pl-4">Product</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-left p-3">Tags</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-10 text-center text-maroon-500">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="text-4xl mb-3">🔍</div>
                    <div className="text-maroon-700 font-medium">No products found</div>
                    <div className="text-maroon-400 text-xs mt-1">Try clearing filters</div>
                  </td>
                </tr>
              ) : products.map((p) => (
                <tr key={p._id} className="border-t border-saffron-100 hover:bg-saffron-50/50">
                  <td className="p-3 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-saffron-100 overflow-hidden shrink-0 flex items-center justify-center">
                        {p.images?.[0] ? (
                          <img
                            src={p.images[0]}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span class="text-2xl">${p.category?.icon || '🪔'}</span>`; }}
                          />
                        ) : (
                          <span className="text-xl">{p.category?.icon || '🪔'}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-maroon-900 line-clamp-1 max-w-[200px]">{p.name}</div>
                        <div className="text-xs text-maroon-400 font-mono">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-maroon-700">
                    <div className="flex items-center gap-1">
                      <span className="text-base">{p.category?.icon}</span>
                      <span>{p.category?.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-maroon-900">₹{p.price}</div>
                    {p.mrp > p.price && <div className="text-xs text-maroon-400 line-through">₹{p.mrp}</div>}
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold ${p.stock < 5 ? 'text-red-600' : 'text-maroon-700'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {p.featured && <span className="chip text-[10px]">Featured</span>}
                      {p.bestseller && <span className="chip text-[10px]">Bestseller</span>}
                      {p.trending && <span className="chip text-[10px]">Trending</span>}
                    </div>
                  </td>
                  <td className="p-3 pr-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setEditing({ ...p, category: p.category?._id || p.category })}
                        className="p-2 hover:bg-saffron-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-maroon-700" />
                      </button>
                      <button
                        onClick={() => remove(p._id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-saffron-100 bg-saffron-50/30 flex-wrap gap-3">
            <div className="text-sm text-maroon-600">
              {total} products &middot; Page <span className="font-semibold text-maroon-900">{page}</span> of {pages}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goPage(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-lg hover:bg-saffron-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === pages || Math.abs(n - page) <= 2)
                .reduce((acc, n, i, arr) => {
                  if (i > 0 && n - arr[i - 1] > 1) acc.push('...');
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, i) =>
                  n === '...' ? (
                    <span key={`e${i}`} className="px-2 text-maroon-400">…</span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => goPage(n)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === n
                          ? 'bg-saffron-500 text-white shadow-sm'
                          : 'hover:bg-saffron-100 text-maroon-700'
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}
              <button
                onClick={() => goPage(page + 1)}
                disabled={page >= pages}
                className="p-2 rounded-lg hover:bg-saffron-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-saffron-100 sticky top-0 bg-white z-10">
              <h3 className="font-display text-2xl font-bold text-maroon-900">
                {editing._id ? 'Edit' : 'Add'} Product
              </h3>
              <button onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-saffron-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={save} className="p-5 grid md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="label">Name *</label>
                <input required className="input" value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: slugify(e.target.value) })} />
              </div>
              <div>
                <label className="label">Slug</label>
                <input className="input" value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              </div>
              <div>
                <label className="label">Category *</label>
                <select required className="input" value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                  <option value="">Select category</option>
                  {cats.map((c) => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Price (₹) *</label>
                <input type="number" required min={0} className="input" value={editing.price}
                  onChange={(e) => setEditing({ ...editing, price: +e.target.value })} />
              </div>
              <div>
                <label className="label">MRP (₹) *</label>
                <input type="number" required min={0} className="input" value={editing.mrp}
                  onChange={(e) => setEditing({ ...editing, mrp: +e.target.value })} />
              </div>
              <div>
                <label className="label">Stock</label>
                <input type="number" min={0} className="input" value={editing.stock}
                  onChange={(e) => setEditing({ ...editing, stock: +e.target.value })} />
              </div>
              <div>
                <label className="label">Material</label>
                <input className="input" value={editing.material}
                  onChange={(e) => setEditing({ ...editing, material: e.target.value })} />
              </div>
              <div>
                <label className="label">Weight</label>
                <input className="input" value={editing.weight}
                  onChange={(e) => setEditing({ ...editing, weight: e.target.value })} />
              </div>
              <div>
                <label className="label">Dimensions</label>
                <input className="input" value={editing.dimensions}
                  onChange={(e) => setEditing({ ...editing, dimensions: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="label">Short description</label>
                <input className="input" value={editing.shortDescription}
                  onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="label">Description *</label>
                <textarea required rows={4} className="input" value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="label">Image URLs (one per line)</label>
                <textarea rows={3} className="input font-mono text-sm" placeholder="https://..."
                  value={editing.images.join('\n')}
                  onChange={(e) => setEditing({ ...editing, images: e.target.value.split('\n') })} />
              </div>
              <div className="md:col-span-2 flex gap-6 flex-wrap">
                {[['featured', 'Featured'], ['trending', 'Trending'], ['bestseller', 'Bestseller']].map(([k, l]) => (
                  <label key={k} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={editing[k]}
                      onChange={(e) => setEditing({ ...editing, [k]: e.target.checked })} />
                    {l}
                  </label>
                ))}
              </div>
              <div className="md:col-span-2 flex gap-2 pt-3 border-t border-saffron-100">
                <button className="btn-primary flex-1">Save product</button>
                <button type="button" onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
