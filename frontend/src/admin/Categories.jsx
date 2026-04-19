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
    <div className="card p-12 text-center">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
      <p className="text-red-600 font-medium">{error}</p>
      <button onClick={load} className="btn-primary mt-4 flex items-center gap-2 mx-auto"><RefreshCw className="w-4 h-4" /> Retry</button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-maroon-900">Categories</h2>
          <p className="text-maroon-600 text-sm mt-1">{cats.length} categories</p>
        </div>
        <button onClick={() => setEditing({ name: '', slug: '', description: '', icon: '🪔', image: '' })} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Category</button>
      </div>

      {cats.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🏷️</div>
          <div className="font-display text-xl font-bold text-maroon-900">No categories yet</div>
          <p className="text-maroon-500 mt-2 text-sm">Add your first category to organize products.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cats.map((c) => (
            <div key={c._id} className="card p-5 hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron-100 to-saffron-200 flex items-center justify-center text-3xl">
                  {c.icon}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(c)} className="p-1.5 hover:bg-saffron-100 rounded-lg transition-colors" title="Edit">
                    <Edit className="w-4 h-4 text-maroon-700" />
                  </button>
                  <button onClick={() => remove(c._id)} className="p-1.5 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="font-bold text-maroon-900 mt-3">{c.name}</div>
              <div className="text-xs text-maroon-500 mt-0.5 font-mono">{c.slug}</div>
              <div className="mt-2 text-xs text-saffron-700 bg-saffron-50 rounded-full px-2 py-0.5 inline-block">{c.productCount || 0} products</div>
              {c.description && <div className="text-xs text-maroon-600 mt-2 line-clamp-2">{c.description}</div>}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-5 border-b border-saffron-100">
              <h3 className="font-display text-xl font-bold">{editing._id ? 'Edit' : 'New'} category</h3>
              <button onClick={() => setEditing(null)}><X /></button>
            </div>
            <form onSubmit={save} className="p-5 space-y-3">
              <div><label className="label">Name</label><input required className="input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: slugify(e.target.value) })} /></div>
              <div><label className="label">Slug</label><input className="input" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
              <div><label className="label">Icon (emoji)</label><input className="input" value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} /></div>
              <div><label className="label">Image URL</label><input className="input" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></div>
              <div><label className="label">Description</label><textarea rows={3} className="input" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="flex gap-2 pt-2">
                <button className="btn-primary flex-1">Save</button>
                <button type="button" onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
