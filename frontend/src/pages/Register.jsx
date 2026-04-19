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
      toast.success('Welcome to Devapi 🪔');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container-x py-16">
      <div className="max-w-md mx-auto card p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🕉️</div>
          <h1 className="font-display text-3xl font-bold text-maroon-900">Create your account</h1>
          <p className="text-maroon-600 text-sm mt-1">Begin your journey with Devapi</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label">Full name</label>
            <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div><label className="label">Email</label>
            <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div><label className="label">Phone (optional)</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div><label className="label">Password</label>
            <input type="password" required minLength={6} className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button disabled={loading} className="btn-primary w-full">{loading ? 'Creating...' : 'Create account'}</button>
        </form>
        <p className="text-center text-sm mt-5 text-maroon-600">
          Already have an account? <Link to="/login" className="link font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
