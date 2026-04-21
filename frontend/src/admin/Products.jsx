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
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div className="border border-ink p-8">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink/40 mb-2">Admin / Catalog</div>
          <h1 className="text-4xl uppercase tracking-tighter leading-[0.9]" style={{ fontFamily: 'Anton, Impact, sans-serif' }}>Products</h1>
          <p className="font-mono text-xs text-ink/40 mt-2">{total} products total</p>
        </div>
        <div className="flex gap-2 flex-wrap items-start">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30 pointer-events-none" />
            <input
              placeholder="Search products..."
              value={q}
              onChange={(e) => handleSearch(e.target.value)}
              className="input-brutal pl-9 w-52"
            />
          </div>
          {/* Category filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30 pointer-events-none" />
            <select value={catFilter} onChange={(e) => handleCatChange(e.target.value)} className="input-brutal pl-9 w-52">
              <option value="">All categories</option>
              {cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <button
            onClick={() => setEditing({ ...empty, category: cats[0]?._id || '' })}
            className="btn-brutal flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-ink overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-ink/40 text-[10px] uppercase tracking-widest font-mono bg-ink/5 border-b border-ink/10">
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
                <tr><td colSpan={6} className="p-10 text-center text-ink/40 font-mono text-sm">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="text-ink/40 font-mono text-sm">No products found</div>
                  </td>
                </tr>
              ) : products.map((p) => (
                <tr key={p._id} className="border-t border-ink/10 hover:bg-ink/5">
                  <td className="p-3 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 border border-ink/20 overflow-hidden shrink-0">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover grayscale" />
                        ) : (
                          <div className="w-full h-full bg-ink/5 flex items-center justify-center text-ink/20 text-xs font-mono">IMG</div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-ink line-clamp-1 max-w-[200px]">{p.name}</div>
                        <div className="text-[10px] text-ink/40 font-mono">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-ink/70 text-xs font-mono">{p.category?.name}</td>
                  <td className="p-3">
                    <div className="font-mono font-bold text-ink">₹{p.price}</div>
                    {p.mrp > p.price && <div className="text-[10px] text-ink/30 font-mono line-through">₹{p.mrp}</div>}
                  </td>
                  <td className="p-3">
                    <span className={`font-mono font-bold text-sm ${p.stock < 5 ? 'text-accent' : 'text-ink'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {p.featured && <span className="text-[9px] font-bold uppercase tracking-wider border border-ink px-1 py-0.5">Featured</span>}
                      {p.bestseller && <span className="text-[9px] font-bold uppercase tracking-wider border border-ink px-1 py-0.5">Best</span>}
                      {p.trending && <span className="text-[9px] font-bold uppercase tracking-wider border border-ink px-1 py-0.5">Trending</span>}
                    </div>
                  </td>
                  <td className="p-3 pr-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setEditing({ ...p, category: p.category?._id || p.category })} className="p-2 hover:bg-ink hover:text-concrete transition-colors">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button onClick={() => remove(p._id)} className="p-2 hover:bg-accent hover:text-white transition-colors">
                        <Trash2 className="w-3 h-3" />
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
          <div className="flex items-center justify-between px-4 py-3 border-t border-ink/10 flex-wrap gap-3">
            <div className="text-xs font-mono text-ink/40">
              {total} products &middot; Page <span className="font-bold text-ink">{page}</span> of {pages}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => goPage(page - 1)} disabled={page <= 1} className="p-2 border border-ink/20 hover:bg-ink hover:text-concrete disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-3 h-3" />
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === pages || Math.abs(n - page) <= 2)
                .reduce((acc, n, i, arr) => { if (i > 0 && n - arr[i - 1] > 1) acc.push('...'); acc.push(n); return acc; }, [])
                .map((n, i) =>
                  n === '...' ? (
                    <span key={`e${i}`} className="px-2 text-ink/30 font-mono text-xs">â€¦</span>
                  ) : (
                    <button key={n} onClick={() => goPage(n)}
                      className={`w-7 h-7 text-xs font-mono font-bold transition-colors ${
                        page === n ? 'bg-ink text-concrete' : 'border border-ink/20 text-ink hover:bg-ink/10'
                      }`}
                    >{n}</button>
                  )
                )}
              <button onClick={() => goPage(page + 1)} disabled={page >= pages} className="p-2 border border-ink/20 hover:bg-ink hover:text-concrete disabled:opacity-30 transition-colors">
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-concrete border border-ink w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-5 border-b border-ink sticky top-0 bg-concrete z-10">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink/40">{editing._id ? 'Edit' : 'Add'} Product</div>
              <button onClick={() => setEditing(null)} className="p-1 hover:text-accent transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={save} className="p-5 grid md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">Name *</label>
                <input required className="input-brutal" value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: slugify(e.target.value) })} />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">Slug</label>
                <input className="input-brutal" value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">Category *</label>
                <select required className="input-brutal" value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                  <option value="">Select category</option>
                  {cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">Price (â‚¹) *</label>
                <input type="number" required min={0} className="input-brutal" value={editing.price}
                  onChange={(e) => setEditing({ ...editing, price: +e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">MRP (â‚¹) *</label>
                <input type="number" required min={0} className="input-brutal" value={editing.mrp}
                  onChange={(e) => setEditing({ ...editing, mrp: +e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">Stock</label>
                <input type="number" min={0} className="input-brutal" value={editing.stock}
                  onChange={(e) => setEditing({ ...editing, stock: +e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">Material</label>
                <input className="input-brutal" value={editing.material}
                  onChange={(e) => setEditing({ ...editing, material: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">Weight</label>
                <input className="input-brutal" value={editing.weight}
                  onChange={(e) => setEditing({ ...editing, weight: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">Dimensions</label>
                <input className="input-brutal" value={editing.dimensions}
                  onChange={(e) => setEditing({ ...editing, dimensions: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">Short description</label>
                <input className="input-brutal" value={editing.shortDescription}
                  onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">Description *</label>
                <textarea required rows={4} className="input-brutal" value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">Image URLs (one per line)</label>
                <textarea rows={3} className="input-brutal font-mono text-sm" placeholder="https://..."
                  value={editing.images.join('\n')}
                  onChange={(e) => setEditing({ ...editing, images: e.target.value.split('\n') })} />
              </div>
              <div className="md:col-span-2 flex gap-6 flex-wrap">
                {[['featured', 'Featured'], ['trending', 'Trending'], ['bestseller', 'Bestseller']].map(([k, l]) => (
                  <label key={k} className="flex items-center gap-2 text-sm cursor-pointer font-mono uppercase tracking-wider text-[10px] text-ink">
                    <input type="checkbox" checked={editing[k]}
                      onChange={(e) => setEditing({ ...editing, [k]: e.target.checked })} />
                    {l}
                  </label>
                ))}
              </div>
              <div className="md:col-span-2 flex gap-2 pt-3 border-t border-ink/10">
                <button className="btn-brutal flex-1">Save product</button>
                <button type="button" onClick={() => setEditing(null)} className="btn-brutal-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
