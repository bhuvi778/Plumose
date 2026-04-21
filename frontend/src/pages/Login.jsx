import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(form.email, form.password);
      toast.success(`Welcome back, ${u.name.split(' ')[0]}!`);
      navigate(u.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
            Sign In
          </h1>
          <p className="text-sm text-ink/50 font-body mt-3">Access your orders, address book and account details.</p>
        </div>

        <form onSubmit={submit} className="space-y-4 border border-ink p-8">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60 mb-1.5">Email</label>
            <input type="email" required className="input-brutal" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60 mb-1.5">Password</label>
            <input type="password" required className="input-brutal" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button disabled={loading} className="btn-brutal w-full justify-center mt-2">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs text-ink/50 mt-5 font-body">
          New here?{' '}
          <Link to="/register" className="text-ink font-bold link-strike">Create an account</Link>
        </p>

        <div className="mt-5 border border-ink/20 p-3 text-xs text-ink/50 font-mono">
          <strong className="text-ink">Demo admin:</strong> admin@devapi.com / admin@123
        </div>
      </div>
    </div>
  );
}

