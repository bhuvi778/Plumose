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
    <div className="container-x py-16">
      <div className="max-w-md mx-auto card p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🪔</div>
          <h1 className="font-display text-3xl font-bold text-maroon-900">Welcome back</h1>
          <p className="text-maroon-600 text-sm mt-1">Sign in to continue your divine journey</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label">Email</label>
            <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div><label className="label">Password</label>
            <input type="password" required className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button disabled={loading} className="btn-primary w-full">{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <p className="text-center text-sm mt-5 text-maroon-600">
          New here? <Link to="/register" className="link font-semibold">Create an account</Link>
        </p>
        <div className="mt-5 p-3 rounded-xl bg-saffron-50 text-xs text-maroon-700">
          <strong>Demo admin:</strong> admin@divyam.com / admin@123
        </div>
      </div>
    </div>
  );
}
