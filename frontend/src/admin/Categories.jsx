import { useEffect, useState } from 'react';
import api from '../api/client.js';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, X, AlertCircle, RefreshCw } from 'lucide-react';
import Loader from '../components/Loader.jsx';

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await api.get('/categories');
      setCats(r.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []); // eslint-disable-line

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...editing, slug: editing.slug || slugify(editing.name) };
    try {
      if (editing._id) await api.put(`/categories/${editing._id}`, payload);
      else await api.post('/categories', payload);
      toast.success('Saved');
      setEditing(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving category'); }
  };
  const remove = async (id) => {
    if (!confirm('Delete this category? Products in it may be affected.')) return;
    try { await api.delete(`/categories/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  if (loading) return <Loader />;
  if (error) return (
    <div className="border border-ink p-12 text-center">
      <AlertCircle className="w-12 h-12 text-accent mx-auto mb-3" />
      <p className="text-accent font-mono text-sm">{error}</p>
      <button onClick={load} className="btn-brutal mt-4 flex items-center gap-2 mx-auto"><RefreshCw className="w-4 h-4" /> Retry</button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="border border-ink p-8 flex-1 mr-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink/40 mb-2">Admin / Catalog</div>
          <h1 className="text-4xl uppercase tracking-tighter leading-[0.9]" style={{ fontFamily: 'Anton, Impact, sans-serif' }}>Categories</h1>
          <p className="font-mono text-xs text-ink/40 mt-2">{cats.length} categories</p>
        </div>
        <button onClick={() => setEditing({ name: '', slug: '', description: '', icon: '', image: '' })} className="btn-brutal flex items-center gap-2"><Plus className="w-4 h-4" /> Add Category</button>
      </div>

      {cats.length === 0 ? (
        <div className="border border-ink p-12 text-center">
          <div className="font-mono text-sm text-ink/40">No categories yet</div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-px bg-ink">
          {cats.map((c) => (
            <div key={c._id} className="bg-concrete p-5 hover:bg-ink/5 transition-colors group">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 border border-ink flex items-center justify-center text-2xl">
                  {c.icon || '□'}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(c)} className="p-1.5 hover:bg-ink hover:text-concrete transition-colors" title="Edit">
                    <Edit className="w-3 h-3" />
                  </button>
                  <button onClick={() => remove(c._id)} className="p-1.5 hover:bg-accent hover:text-white transition-colors" title="Delete">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="font-bold text-ink mt-3 text-sm">{c.name}</div>
              <div className="text-[10px] text-ink/40 mt-0.5 font-mono">{c.slug}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${c.vertical === 'herbal' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                  {c.vertical || 'devapi'}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-ink/60">{c.productCount || 0} items</span>
              </div>
              {c.description && <div className="text-xs text-ink/50 mt-2 line-clamp-2 font-mono">{c.description}</div>}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-concrete border border-ink w-full max-w-md">
            <div className="flex justify-between items-center p-5 border-b border-ink">
              <div className="text-[10px] font-mono uppercase tracking-widest text-ink/40">{editing._id ? 'Edit' : 'New'} category</div>
              <button onClick={() => setEditing(null)} className="hover:text-accent"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={save} className="p-5 space-y-3">
              <div><label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">Name</label><input required className="input-brutal" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: slugify(e.target.value) })} /></div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">Vertical</label>
                <select className="input-brutal" value={editing.vertical || 'devapi'} onChange={(e) => setEditing({ ...editing, vertical: e.target.value })}>
                  <option value="devapi">Devapi (Puja)</option>
                  <option value="herbal">Herbal Products</option>
                </select>
              </div>
              <div><label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">Slug</label><input className="input-brutal" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
              <div><label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">Icon (emoji)</label><input className="input-brutal" value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} /></div>
              <div><label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">Image URL</label><input className="input-brutal" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></div>
              <div><label className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">Description</label><textarea rows={3} className="input-brutal" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="flex gap-2 pt-2">
                <button className="btn-brutal flex-1">Save</button>
                <button type="button" onClick={() => setEditing(null)} className="btn-brutal-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
