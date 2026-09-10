import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ShoppingBag, Moon, Sun } from 'lucide-react';
import Logo from './Logo.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useScrollDirection } from '../hooks/useScrollDirection.js';

const navLinkClass = ({ isActive }) =>
  `text-xs uppercase tracking-[0.12em] font-semibold transition ${
    isActive
      ? 'text-gloss'
      : 'text-ink/70 dark:text-blush/65 hover:text-gloss dark:hover:text-gloss-light'
  }`;

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const { direction, atTop } = useScrollDirection();
  const [menuOpen, setMenuOpen] = useState(false);

  const hidden = direction === 'down' && !atTop && !menuOpen;

  return (
    <header
      className={`sticky top-0 z-40 border-b border-line/70 dark:border-studio-line bg-blush/90 dark:bg-plum-dark/90 backdrop-blur-md transition-transform duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 h-[76px] flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center shrink-0" onClick={() => setMenuOpen(false)}>
          <Logo className="h-14 sm:h-16" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            Collection
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink/70 dark:text-blush/70 hover:text-gloss dark:hover:text-gloss-light hover:bg-ink/5 dark:hover:bg-blush/5 transition"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to="/bag"
            aria-label={`Bag, ${totalItems} item${totalItems === 1 ? '' : 's'}`}
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-ink/70 dark:text-blush/70 hover:text-gloss dark:hover:text-gloss-light hover:bg-ink/5 dark:hover:bg-blush/5 transition"
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gloss text-white text-[10px] font-bold leading-none flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          <Link
            to="/admin"
            className="hidden sm:inline-block text-xs uppercase tracking-[0.1em] font-semibold text-ink/50 dark:text-blush/45 hover:text-gloss transition ml-1"
          >
            Studio
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-ink/70 dark:text-blush/70"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          menuOpen ? 'max-h-56' : 'max-h-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-5 pb-5 pt-1">
          {[
            { to: '/', label: 'Home', end: true },
            { to: '/shop', label: 'Collection' },
            { to: '/contact', label: 'Contact' },
            { to: '/admin', label: 'Studio access' }
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `py-2.5 text-sm font-semibold uppercase tracking-[0.1em] border-b border-line/60 dark:border-studio-line last:border-0 ${
                  isActive ? 'text-gloss' : 'text-ink/75 dark:text-blush/70'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
