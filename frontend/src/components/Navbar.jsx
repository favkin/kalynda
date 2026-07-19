import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import CartDrawer from './CartDrawer.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header className="border-b border-line dark:border-studio-line bg-blush/95 dark:bg-plum-dark/95 backdrop-blur sticky top-0 z-20 transition-colors">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        <div className="flex items-center gap-5">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="text-xs uppercase tracking-[0.1em] font-semibold text-ink/50 dark:text-blush/50 hover:text-gloss transition"
          >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>

          <button
            onClick={() => setCartOpen(true)}
            aria-label="Open bag"
            className="relative text-xs uppercase tracking-[0.1em] font-semibold text-ink/50 dark:text-blush/50 hover:text-gloss transition"
          >
            Bag
            {totalItems > 0 && (
              <span className="absolute -top-2.5 -right-3.5 bg-gloss text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <Link
            to="/contact"
            className="text-xs uppercase tracking-[0.1em] font-semibold text-ink/50 dark:text-blush/50 hover:text-gloss transition"
          >
            Contact
          </Link>

          <Link
            to="/admin"
            className="text-xs uppercase tracking-[0.1em] font-semibold text-ink/50 dark:text-blush/50 hover:text-gloss transition"
          >
            Studio access
          </Link>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
