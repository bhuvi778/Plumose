import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

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
      toast.success('Account created');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container-x py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-brand text-white items-center justify-center mb-4 shadow-glow">
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="display text-4xl">Create account</h1>
          <p className="text-sm text-ink-soft mt-2">Join Plumose to track orders across Devapi, Herbal & Courier.</p>
        </div>

        <form onSubmit={submit} className="card p-7 space-y-4">
          <div><label className="label">Full Name</label><input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Email</label><input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="label">Phone (optional)</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="label">Password</label><input type="password" required minLength={6} className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          <button disabled={loading} className="btn-primary w-full">{loading ? 'Creating…' : 'Create Account'}</button>
        </form>

        <p className="text-center text-sm text-ink-soft mt-5">
          Already have an account? <Link to="/login" className="link font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
