import { Link } from 'react-router-dom';
import { Mail, Instagram, ArrowUpRight } from 'lucide-react';
import Logo from './Logo.jsx';

export default function Footer() {
  const year = new Date().getFullYear();
  const email = import.meta.env.VITE_CONTACT_EMAIL;
  const instagram = import.meta.env.VITE_INSTAGRAM_HANDLE;

  return (
    <footer className="bg-plum text-blush mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr_auto] gap-8 items-start">
        <div>
          <Logo light className="h-14 mb-3" />
          <p className="text-sm text-blush/55 max-w-xs leading-relaxed">
            Lip gloss and beauty essentials made for everyday shine.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-gold font-semibold mb-3">Shop</p>
          <ul className="flex flex-col gap-1.5 text-sm text-blush/70">
            <li>
              <Link to="/" className="hover:text-blush transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-blush transition">
                Collection
              </Link>
            </li>
            <li>
              <Link to="/bag" className="hover:text-blush transition">
                Your bag
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-gold font-semibold mb-3">
            Get in touch
          </p>
          <ul className="flex flex-col gap-1.5 text-sm text-blush/70">
            <li>
              <Link to="/contact" className="hover:text-blush transition inline-flex items-center gap-1">
                Contact us <ArrowUpRight size={13} />
              </Link>
            </li>
            {email && (
              <li>
                <a href={`mailto:${email}`} className="hover:text-blush transition break-all">
                  {email}
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Social icons */}
        <div className="flex md:flex-col gap-2.5">
          {email && (
            <a
              href={`mailto:${email}`}
              aria-label="Email us"
              className="w-10 h-10 rounded-full bg-blush/10 hover:bg-gloss flex items-center justify-center transition"
            >
              <Mail size={17} />
            </a>
          )}
          {instagram && (
            <a
              href={`https://instagram.com/${instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-blush/10 hover:bg-gloss flex items-center justify-center transition"
            >
              <Instagram size={17} />
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-blush/10">
        <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-blush/40">
          © {year} KALYNDA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
