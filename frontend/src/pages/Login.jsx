import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { Sparkles } from 'lucide-react';

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
    <div className="container-x py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-brand text-white items-center justify-center mb-4 shadow-glow">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="display text-4xl">Welcome back</h1>
          <p className="text-sm text-ink-soft mt-2">Sign in to access your orders and favorites.</p>
        </div>

        <form onSubmit={submit} className="card p-7 space-y-4">
          <div>
            <label className="label">Email</label>
            <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" required className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-ink-soft mt-5">
          New here? <Link to="/register" className="link font-semibold">Create an account</Link>
        </p>

        <div className="mt-5 card p-4 text-xs text-ink-soft">
          <strong className="text-ink">Demo admin:</strong> admin@devapi.com / admin@123
        </div>
      </div>
    </div>
  );
}

