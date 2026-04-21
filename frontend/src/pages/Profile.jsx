import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/client.js';
import toast from 'react-hot-toast';
import { MapPin, Plus, Trash2 } from 'lucide-react';

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
      toast.success('Profile updated.');
      setForm({ ...form, password: '' });
    } catch { toast.error('Update failed'); }
  };

  const saveAddr = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/addresses', newAddr);
    setAddrs([data, ...addrs]);
    setNewAddr(null);
    toast.success('Address added.');
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

  const lbl = 'block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60 mb-1.5';

  return (
    <div className="container-x py-20 grid lg:grid-cols-2 gap-10">
      {/* Account */}
      <section>
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-mono mb-3">Account</div>
        <h2 className="text-3xl text-ink mb-6" style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}>Profile</h2>
        <form onSubmit={save} className="space-y-4 border border-ink p-6">
          <div><label className={lbl}>Name</label><input className="input-brutal" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className={lbl}>Email</label><input disabled value={user?.email} className="input-brutal opacity-40 cursor-not-allowed" /></div>
          <div><label className={lbl}>Phone</label><input className="input-brutal" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className={lbl}>New Password (optional)</label><input type="password" className="input-brutal" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          <button className="btn-brutal">Save Changes</button>
        </form>
      </section>

      {/* Addresses */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-mono mb-1">Delivery</div>
            <h2 className="text-3xl text-ink" style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}>Addresses</h2>
          </div>
          <button
            onClick={() => setNewAddr({ fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', type: 'home' })}
            className="btn-brutal-outline text-[10px] py-2"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        <div className="space-y-3">
          {addrs.map((a) => (
            <div key={a._id} className="border border-ink/20 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-ink">
                    {a.fullName}
                    {a.isDefault && <span className="ml-2 text-[10px] font-mono text-ink/40">Â· Default</span>}
                  </div>
                  <div className="text-xs text-ink/60 font-body mt-0.5">{a.line1}, {a.city} â€” {a.pincode}</div>
                  <div className="text-[10px] font-mono text-ink/40 mt-0.5">{a.phone}</div>
                </div>
                <div className="flex gap-3 items-center">
                  {!a.isDefault && (
                    <button onClick={() => setDefault(a._id)} className="text-[10px] uppercase tracking-wide font-bold text-ink/40 hover:text-ink link-strike">
                      Set Default
                    </button>
                  )}
                  <button onClick={() => removeAddr(a._id)} className="text-ink/30 hover:text-accent transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {newAddr && (
            <form onSubmit={saveAddr} className="border border-ink p-4 grid grid-cols-2 gap-3">
              <input required placeholder="Full Name" className="input-brutal col-span-2 text-xs" value={newAddr.fullName} onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })} />
              <input required placeholder="Phone" className="input-brutal text-xs" value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} />
              <input required placeholder="Pincode" className="input-brutal text-xs" value={newAddr.pincode} onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })} />
              <input required placeholder="Line 1" className="input-brutal col-span-2 text-xs" value={newAddr.line1} onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })} />
              <input required placeholder="City" className="input-brutal text-xs" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} />
              <input required placeholder="State" className="input-brutal text-xs" value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} />
              <div className="col-span-2 flex gap-3">
                <button className="btn-brutal flex-1 justify-center text-xs">Save Address</button>
                <button type="button" onClick={() => setNewAddr(null)} className="btn-brutal-outline text-xs">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
