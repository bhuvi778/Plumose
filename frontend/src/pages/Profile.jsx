import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/client.js';
import toast from 'react-hot-toast';
import { MapPin, Plus, Trash2, Star } from 'lucide-react';

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
    } catch (err) { toast.error('Update failed'); }
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
    toast.success('Deleted');
  };

  const setDefault = async (id) => {
    await api.put(`/addresses/${id}`, { isDefault: true });
    const r = await api.get('/addresses');
    setAddrs(r.data);
  };

  return (
    <div className="container-x py-10 grid lg:grid-cols-2 gap-8">
      <section className="card p-6">
        <h2 className="font-display text-2xl font-bold">Account</h2>
        <form onSubmit={save} className="mt-4 space-y-3">
          <div><label className="label">Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Email</label><input disabled value={user?.email} className="input bg-saffron-50" /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="label">New password (optional)</label><input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          <button className="btn-primary">Save changes</button>
        </form>
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold flex items-center gap-2"><MapPin className="w-5 h-5" /> Addresses</h2>
          <button onClick={() => setNewAddr({ fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', type: 'home' })}
            className="btn-outline text-sm"><Plus className="w-4 h-4" /> Add</button>
        </div>
        <div className="mt-4 space-y-3">
          {addrs.map((a) => (
            <div key={a._id} className="p-3 rounded-xl border border-saffron-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{a.fullName} {a.isDefault && <span className="chip text-[10px] text-green-700 ml-1"><Star className="w-3 h-3" /> Default</span>}</div>
                  <div className="text-sm text-maroon-700">{a.line1}, {a.city} - {a.pincode}</div>
                  <div className="text-xs text-maroon-500">📞 {a.phone}</div>
                </div>
                <div className="flex gap-2">
                  {!a.isDefault && <button onClick={() => setDefault(a._id)} className="text-xs text-saffron-700 hover:underline">Set default</button>}
                  <button onClick={() => removeAddr(a._id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
          {newAddr && (
            <form onSubmit={saveAddr} className="p-3 rounded-xl border border-saffron-300 bg-saffron-50/50 grid grid-cols-2 gap-2">
              <input required placeholder="Full name" className="input col-span-2" value={newAddr.fullName} onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })} />
              <input required placeholder="Phone" className="input" value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} />
              <input required placeholder="Pincode" className="input" value={newAddr.pincode} onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })} />
              <input required placeholder="Line 1" className="input col-span-2" value={newAddr.line1} onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })} />
              <input required placeholder="City" className="input" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} />
              <input required placeholder="State" className="input" value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} />
              <div className="col-span-2 flex gap-2"><button className="btn-primary flex-1">Save</button><button type="button" onClick={() => setNewAddr(null)} className="btn-ghost">Cancel</button></div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
