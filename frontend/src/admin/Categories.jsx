import { useEffect, useState, useMemo } from 'react';
import api from '../api/client.js';
import toast from 'react-hot-toast';
import { Edit, Trash2, RefreshCw, Sparkles, Leaf, Search } from 'lucide-react';
import Loader from '../components/Loader.jsx';

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const EMPTY = { name: '', slug: '', description: '', icon: '', image: '', vertical: 'devapi' };

const VBadge = ({ v }) =>
  v === 'herbal'
    ? <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-800"><Leaf className="w-2.5 h-2.5" />Herbal</span>
    : <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800"><Sparkles className="w-2.5 h-2.5" />Devapi</span>;

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vertFilter, setVertFilter] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null); // null = add mode, string = edit mode

  const load = () => {
    setLoading(true);
    api.get('/categories')
      .then((r) => setCats(r.data))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const visible = useMemo(() => {
    let list = cats;
    if (vertFilter) list = list.filter((c) => (c.vertical || 'devapi') === vertFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.slug.includes(q));
    }
    return list;
  }, [cats, vertFilter, search]);

  const startEdit = (c) => {
    setEditingId(c._id);
    setForm({ name: c.name, slug: c.slug, description: c.description || '', icon: c.icon || '', image: c.image || '', vertical: c.vertical || 'devapi' });
    // scroll to form
    setTimeout(() => document.getElementById('cat-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const cancelEdit = () => { setEditingId(null); setForm(EMPTY); };

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, slug: form.slug || slugify(form.name) };
    try {
      if (editingId) await api.put(`/categories/${editingId}`, payload);
      else await api.post('/categories', payload);
      toast.success(editingId ? 'Category updated' : 'Category added');
      cancelEdit();
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this category? Products inside may be affected.')) return;
    try { await api.delete(`/categories/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="display text-3xl md:text-4xl text-ink">Categories</h1>
          <p className="text-sm text-ink-soft mt-1">{visible.length} of {cats.length} categories</p>
        </div>
        <button onClick={() => { cancelEdit(); setTimeout(() => document.getElementById('cat-form')?.scrollIntoView({ behavior: 'smooth' }), 50); }}
          className="btn-primary">
          + Add Category
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-mute pointer-events-none" />
          <input placeholder="Search categories…" value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9" />
        </div>
        <div className="flex rounded-xl border border-brand/20 overflow-hidden">
          {[['', 'All'], ['devapi', '🕉️ Devapi'], ['herbal', '🌿 Herbal']].map(([val, label]) => (
            <button key={val} onClick={() => setVertFilter(val)}
              className={`px-4 py-2 text-sm font-medium transition ${vertFilter === val ? 'bg-brand text-white' : 'bg-surface-soft text-ink-soft hover:bg-brand/10'}`}>
              {label}
            </button>
          ))}
        </div>
        <button onClick={load} className="btn-outline p-2.5" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
      </div>

      {/* Category grid */}
      {visible.length === 0 ? (
        <div className="card p-14 text-center text-ink-mute text-sm">No categories found</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visible.map((c) => (
            <div key={c._id} className="card p-5 hover:shadow-glow transition-all duration-200 group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center text-2xl">
                  {c.icon || '📦'}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(c)} className="p-1.5 rounded-lg hover:bg-brand hover:text-white transition" title="Edit">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => remove(c._id)} className="p-1.5 rounded-lg hover:bg-red-500 hover:text-white transition" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="font-semibold text-ink text-sm leading-tight">{c.name}</div>
              <div className="text-[10px] text-ink-mute font-mono mt-0.5">{c.slug}</div>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <VBadge v={c.vertical || 'devapi'} />
                <span className="text-[10px] text-ink-soft font-medium">{c.productCount || 0} products</span>
              </div>
              {c.description && <p className="text-xs text-ink-soft mt-2 line-clamp-2">{c.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit form — always visible at the bottom */}
      <div id="cat-form" className="card p-6 border-2 border-brand/20">
        <div className="mb-4">
          <div className="kicker">{editingId ? 'Editing category' : 'Add new category'}</div>
          <h2 className="display text-xl text-ink">{editingId ? form.name || 'Category' : 'New Category'}</h2>
        </div>
        <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Name *</label>
            <input required className="input" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })} />
          </div>
          <div>
            <label className="label">Vertical *</label>
            <select className="input" value={form.vertical} onChange={(e) => setForm({ ...form, vertical: e.target.value })}>
              <option value="devapi">🕉️ Devapi (Puja)</option>
              <option value="herbal">🌿 Herbal Products</option>
            </select>
          </div>
          <div>
            <label className="label">Slug</label>
            <input className="input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <label className="label">Icon (emoji)</label>
            <input className="input" placeholder="🪔" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Image URL</label>
            <input className="input" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Description</label>
            <textarea rows={3} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="md:col-span-2 flex gap-2 pt-2 border-t border-brand/10">
            <button className="btn-primary flex-1">{editingId ? 'Update category' : 'Add category'}</button>
            {editingId && <button type="button" onClick={cancelEdit} className="btn-outline">Cancel</button>}
          </div>
        </form>
      </div>
    </div>
  );
}
