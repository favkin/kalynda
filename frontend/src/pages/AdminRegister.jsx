import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import Logo from '../components/Logo.jsx';

export default function AdminRegister() {
  const [form, setForm] = useState({ name: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.register({ ...form, role: 'admin' });
      setSuccess(true);
      setTimeout(() => navigate('/admin/login'), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-studio text-blush flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Logo light className="mb-8" />
        <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-2">Studio access</p>
        <h1 className="font-display text-3xl mb-8">Create an account</h1>

        {success ? (
          <p className="text-gold text-sm">Account created — redirecting to sign in…</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.1em] text-blush/50 mb-1.5">Name</label>
              <input
                value={form.name}
                onChange={update('name')}
                required
                className="w-full bg-studio-raised border border-studio-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gloss"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.1em] text-blush/50 mb-1.5">Phone</label>
              <input
                value={form.phone}
                onChange={update('phone')}
                required
                className="w-full bg-studio-raised border border-studio-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gloss"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.1em] text-blush/50 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={update('password')}
                required
                className="w-full bg-studio-raised border border-studio-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gloss"
              />
            </div>

            {error && <p className="text-rust text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-gloss hover:bg-gloss-dark transition text-white font-semibold rounded-full py-2.5 text-sm uppercase tracking-[0.1em] disabled:opacity-50"
            >
              {loading ? 'Creating…' : 'Create account'}
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-blush/40">
          Already have an account?{' '}
          <Link to="/admin/login" className="text-blush/70 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
