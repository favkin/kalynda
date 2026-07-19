import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-plum text-blush mt-20">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Logo light className="mb-4" />
          <p className="text-sm text-blush/60 max-w-xs">
            Lip gloss and beauty essentials made for everyday shine.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-gold font-semibold mb-4">
            Shop
          </p>
          <ul className="flex flex-col gap-2 text-sm text-blush/70">
            <li>
              <Link to="/" className="hover:text-blush transition">
                All products
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-gold font-semibold mb-4">
            Get in touch
          </p>
          <ul className="flex flex-col gap-2 text-sm text-blush/70">
            <li>
              <Link to="/contact" className="hover:text-blush transition">
                Contact us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-blush/10">
        <div className="max-w-6xl mx-auto px-6 py-5 text-xs text-blush/40">
          © {year} KALYNDA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
