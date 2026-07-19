import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../components/Logo.jsx';

export default function AdminLogin() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login({ name, password });
      login(data.token, data.admin);
      navigate('/admin');
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
        <h1 className="font-display text-3xl mb-8">Sign in</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.1em] text-blush/50 mb-1.5">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-studio-raised border border-studio-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gloss"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.1em] text-blush/50 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-blush/40">
          Need an account?{' '}
          <Link to="/admin/register" className="text-blush/70 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
