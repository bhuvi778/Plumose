import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import api from '../api/client.js';
import toast from 'react-hot-toast';
import { Edit, Trash2, Plus, X, Search, ChevronLeft, ChevronRight, Filter, Sparkles, Leaf } from 'lucide-react';

const LIMIT = 15;
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const empty = {
  name: '', slug: '', description: '', shortDescription: '', price: 0, mrp: 0,
  images: [''], category: '', stock: 0, material: '', weight: '', dimensions: '',
  featured: false, trending: false, bestseller: false,
};

const VERTICAL_OPTIONS = [
  { key: '', label: 'All verticals' },
  { key: 'devapi', label: 'Devapi (Puja)' },
  { key: 'herbal', label: 'Herbal' },
];

const VBadge = ({ v }) => {
  if (v === 'herbal') return <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-800"><Leaf className="w-2.5 h-2.5"/>Herbal</span>;
  return <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800"><Sparkles className="w-2.5 h-2.5"/>Devapi</span>;
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [allCats, setAllCats] = useState([]);
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState('');
  const [verticalFilter, setVerticalFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const searchTimer = useRef(null);

  const load = useCallback((opts = {}) => {
    setLoading(true);
    const p = opts.page ?? 1;
    const params = new URLSearchParams({ page: p, limit: LIMIT });
    const v = opts.vertical ?? verticalFilter;
    const cat = opts.cat ?? catFilter;
    const search = opts.q ?? q;
    if (v) params.set('vertical', v);
    if (cat) params.set('category', cat);
    if (search) params.set('search', search);
    api.get(`/products?${params}`)
      .then((r) => {
        setProducts(r.data.products || []);
        setTotal(r.data.total || 0);
        setPages(r.data.pages || 1);
        setPage(p);
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  }, [verticalFilter, catFilter, q]);

  useEffect(() => {
    load({ page: 1 });
    api.get('/categories').then((r) => setAllCats(r.data));
  }, []); // eslint-disable-line

  const visibleCats = useMemo(() => {
    if (!verticalFilter) return allCats;
    return allCats.filter((c) => (c.vertical || 'devapi') === verticalFilter);
  }, [allCats, verticalFilter]);

  const handleVerticalChange = (v) => {
    setVerticalFilter(v);
    setCatFilter('');
    load({ page: 1, vertical: v, cat: '' });
  };

  const handleCatChange = (val) => {
    setCatFilter(val);
    load({ page: 1, cat: val });
  };

  const handleSearch = (val) => {
    setQ(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => load({ page: 1, q: val }), 400);
  };

  const goPage = (p) => load({ page: p });

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...editing, slug: editing.slug || slugify(editing.name), images: editing.images.filter(Boolean) };
    try {
      if (editing._id) await api.put(`/products/${editing._id}`, payload);
      else await api.post('/products', payload);
      toast.success('Saved');
      setEditing(null);
      load({ page });
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Deleted');
      load({ page: products.length === 1 && page > 1 ? page - 1 : page });
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="display text-3xl md:text-4xl text-ink">Products</h1>
          <p className="text-sm text-ink-soft mt-1">{total} products total</p>
        </div>
        <button
          onClick={() => setEditing({ ...empty, category: visibleCats[0]?._id || '' })}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" /> Add product
        </button>
      </div>

      {/* Filters row */}
      <div className="card p-4 mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-mute pointer-events-none" />
          <input
            placeholder="Search products..."
            value={q}
            onChange={(e) => handleSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-mute pointer-events-none" />
          <select value={verticalFilter} onChange={(e) => handleVerticalChange(e.target.value)} className="input pl-9 w-52">
            {VERTICAL_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </div>
        <select value={catFilter} onChange={(e) => handleCatChange(e.target.value)} className="input w-56">
          <option value="">All categories</option>
          {visibleCats.map((c) => <option key={c._id} value={c._id}>{c.icon || ''} {c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-soft/50 border-b border-brand/10">
              <tr className="text-left text-[11px] uppercase tracking-wider text-ink-soft">
                <th className="p-3 pl-4">Product</th>
                <th className="p-3">Vertical</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Tags</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-10 text-center text-ink-mute text-sm">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={7} className="p-12 text-center text-ink-mute text-sm">No products found</td></tr>
              ) : products.map((p) => (
                <tr key={p._id} className="border-t border-brand/5 hover:bg-brand-soft/30">
                  <td className="p-3 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg border border-brand/10 overflow-hidden shrink-0">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-brand/5 flex items-center justify-center text-ink-mute text-xs">—</div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-ink line-clamp-1 max-w-[200px]">{p.name}</div>
                        <div className="text-[10px] text-ink-mute">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3"><VBadge v={p.category?.vertical || 'devapi'} /></td>
                  <td className="p-3 text-xs text-ink-soft">{p.category?.icon} {p.category?.name}</td>
                  <td className="p-3">
                    <div className="font-semibold text-ink">₹{p.price}</div>
                    {p.mrp > p.price && <div className="text-[10px] text-ink-mute line-through">₹{p.mrp}</div>}
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold text-sm ${p.stock < 5 ? 'text-red-600' : 'text-ink'}`}>{p.stock}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {p.featured && <span className="text-[9px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5 bg-amber-100 text-amber-800">Featured</span>}
                      {p.bestseller && <span className="text-[9px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5 bg-blue-100 text-blue-800">Best</span>}
                      {p.trending && <span className="text-[9px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5 bg-purple-100 text-purple-800">Trend</span>}
                    </div>
                  </td>
                  <td className="p-3 pr-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setEditing({ ...p, category: p.category?._id || p.category })} className="p-2 rounded-lg hover:bg-brand hover:text-white transition">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => remove(p._id)} className="p-2 rounded-lg hover:bg-red-500 hover:text-white transition">
                        <Trash2 className="w-3.5 h-3.5" />
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
          <div className="flex items-center justify-between px-4 py-3 border-t border-brand/10 flex-wrap gap-3">
            <div className="text-xs text-ink-mute">
              {total} products · Page <span className="font-semibold text-ink">{page}</span> of {pages}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => goPage(page - 1)} disabled={page <= 1} className="p-2 rounded-lg border border-brand/20 text-ink hover:bg-brand hover:text-white disabled:opacity-30 transition">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === pages || Math.abs(n - page) <= 2)
                .reduce((acc, n, i, arr) => { if (i > 0 && n - arr[i - 1] > 1) acc.push('...'); acc.push(n); return acc; }, [])
                .map((n, i) =>
                  n === '...' ? (
                    <span key={`e${i}`} className="px-2 text-ink-mute text-xs">…</span>
                  ) : (
                    <button key={n} onClick={() => goPage(n)}
                      className={`w-8 h-8 text-xs font-semibold rounded-lg transition ${
                        page === n ? 'bg-brand text-white' : 'border border-brand/20 text-ink hover:bg-brand/10'
                      }`}
                    >{n}</button>
                  )
                )}
              <button onClick={() => goPage(page + 1)} disabled={page >= pages} className="p-2 rounded-lg border border-brand/20 text-ink hover:bg-brand hover:text-white disabled:opacity-30 transition">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="card bg-surface-soft w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-5 border-b border-brand/10 sticky top-0 bg-surface-soft z-10">
              <div>
                <div className="kicker">{editing._id ? 'Edit' : 'Add'}</div>
                <h2 className="display text-xl text-ink">Product</h2>
              </div>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-brand/10 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={save} className="p-5 grid md:grid-cols-2 gap-4">
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
                  {allCats.map((c) => (
                    <option key={c._id} value={c._id}>
                      [{(c.vertical || 'devapi').toUpperCase()}] {c.icon || ''} {c.name}
                    </option>
                  ))}
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
                <textarea rows={3} className="input font-mono text-xs" placeholder="https://..."
                  value={editing.images.join('\n')}
                  onChange={(e) => setEditing({ ...editing, images: e.target.value.split('\n') })} />
              </div>
              <div className="md:col-span-2 flex gap-6 flex-wrap pt-1">
                {[['featured', 'Featured'], ['trending', 'Trending'], ['bestseller', 'Bestseller']].map(([k, l]) => (
                  <label key={k} className="flex items-center gap-2 text-sm cursor-pointer text-ink">
                    <input type="checkbox" checked={editing[k]}
                      onChange={(e) => setEditing({ ...editing, [k]: e.target.checked })}
                      className="w-4 h-4 accent-brand" />
                    {l}
                  </label>
                ))}
              </div>
              <div className="md:col-span-2 flex gap-2 pt-4 border-t border-brand/10">
                <button className="btn-primary flex-1">Save product</button>
                <button type="button" onClick={() => setEditing(null)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
