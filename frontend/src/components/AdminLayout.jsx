import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from './Logo.jsx';

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth();

  return (
    <div className="min-h-screen bg-studio text-blush">
      <header className="border-b border-studio-line">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <Logo light />
            <span className="text-xs uppercase tracking-[0.15em] text-gold font-semibold pl-3 border-l border-studio-line">
              Studio
            </span>
          </Link>
          <div className="flex items-center gap-5 text-sm">
            <Link to="/" className="text-blush/50 hover:text-blush transition text-xs uppercase tracking-[0.12em]">
              View site
            </Link>
            {admin?.name && <span className="text-blush/40 text-xs">{admin.name}</span>}
            <button
              onClick={logout}
              className="text-blush/50 hover:text-blush transition text-xs uppercase tracking-[0.12em]"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-12">{children}</main>
    </div>
  );
}
