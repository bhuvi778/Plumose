import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container-x py-20">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <div className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-mono mb-3">Account</div>
          <h1
            className="text-5xl text-ink leading-[0.85] tracking-tighter"
            style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}
          >
            Register
          </h1>
          <p className="text-sm text-ink/50 font-body mt-3">Create an account to track orders and save favourites.</p>
        </div>

        <form onSubmit={submit} className="space-y-4 border border-ink p-8">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60 mb-1.5">Full Name</label>
            <input required className="input-brutal" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60 mb-1.5">Email</label>
            <input type="email" required className="input-brutal" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60 mb-1.5">Phone (optional)</label>
            <input className="input-brutal" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60 mb-1.5">Password</label>
            <input type="password" required minLength={6} className="input-brutal" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button disabled={loading} className="btn-brutal w-full justify-center mt-2">
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>

        <p className="text-xs text-ink/50 mt-5 font-body">
          Already have an account?{' '}
          <Link to="/login" className="text-ink font-bold link-strike">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
