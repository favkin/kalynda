import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function CartFab() {
  const { totalItems } = useCart();
  const { pathname } = useLocation();

  // No point floating the bag button over the bag page itself.
  if (pathname === '/bag') return null;

  return (
    <Link
      to="/bag"
      aria-label={`Open bag, ${totalItems} item${totalItems === 1 ? '' : 's'}`}
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-30 w-14 h-14 rounded-full bg-plum dark:bg-gloss text-blush dark:text-white shadow-xl shadow-plum/30 dark:shadow-black/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
    >
      <ShoppingBag size={22} />
      {totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 rounded-full bg-gold text-ink text-[11px] font-bold flex items-center justify-center border-2 border-blush dark:border-plum-dark">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
}
