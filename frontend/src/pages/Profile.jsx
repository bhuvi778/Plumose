import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/client.js';
import toast from 'react-hot-toast';
import { Plus, Trash2, Star } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', password: '' });
  const [addrs, setAddrs] = useState([]);
  const [newAddr, setNewAddr] = useState(null);

  useEffect(() => { api.get('/addresses').then((r) => setAddrs(r.data)); }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(form);
      toast.success('Profile updated');
      setForm({ ...form, password: '' });
    } catch { toast.error('Update failed'); }
  };

  const saveAddr = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/addresses', newAddr);
    setAddrs([data, ...addrs]);
    setNewAddr(null);
    toast.success('Address added');
  };

  const removeAddr = async (id) => {
    await api.delete(`/addresses/${id}`);
    setAddrs(addrs.filter((a) => a._id !== id));
  };

  const setDefault = async (id) => {
    await api.put(`/addresses/${id}`, { isDefault: true });
    const r = await api.get('/addresses');
    setAddrs(r.data);
  };

  return (
    <div className="container-x py-10 grid lg:grid-cols-2 gap-8">
      <section>
        <div className="kicker mb-2">Account</div>
        <h2 className="display text-3xl mb-6">Profile details</h2>
        <form onSubmit={save} className="card p-6 space-y-4">
          <div><label className="label">Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Email</label><input disabled value={user?.email} className="input opacity-60 cursor-not-allowed" /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="label">New password (optional)</label><input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          <button className="btn-primary">Save Changes</button>
        </form>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="kicker mb-2">Delivery</div>
            <h2 className="display text-3xl">Addresses</h2>
          </div>
          <button
            onClick={() => setNewAddr({ fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', type: 'home' })}
            className="btn-outline text-xs py-2"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        <div className="space-y-3">
          {addrs.map((a) => (
            <div key={a._id} className="card p-4">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-ink flex items-center gap-2">
                    {a.fullName}
                    {a.isDefault && <span className="chip-solid text-[10px]"><Star className="w-3 h-3" /> Default</span>}
                  </div>
                  <div className="text-sm text-ink-soft mt-1 leading-relaxed">{a.line1}, {a.city} — {a.pincode}</div>
                  <div className="text-xs text-ink-soft mt-0.5">{a.phone}</div>
                </div>
                <div className="flex gap-2 items-center">
                  {!a.isDefault && (
                    <button onClick={() => setDefault(a._id)} className="text-xs text-brand hover:text-brand-dark font-semibold">
                      Set Default
                    </button>
                  )}
                  <button onClick={() => removeAddr(a._id)} className="text-ink-soft hover:text-accent transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {newAddr && (
            <form onSubmit={saveAddr} className="card p-5 grid grid-cols-2 gap-3">
              <input required placeholder="Full Name" className="input col-span-2 text-sm" value={newAddr.fullName} onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })} />
              <input required placeholder="Phone" className="input text-sm" value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} />
              <input required placeholder="Pincode" className="input text-sm" value={newAddr.pincode} onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })} />
              <input required placeholder="Address Line 1" className="input col-span-2 text-sm" value={newAddr.line1} onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })} />
              <input required placeholder="City" className="input text-sm" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} />
              <input required placeholder="State" className="input text-sm" value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} />
              <div className="col-span-2 flex gap-3">
                <button className="btn-primary flex-1">Save Address</button>
                <button type="button" onClick={() => setNewAddr(null)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
