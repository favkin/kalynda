import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-blush dark:bg-plum-dark text-ink dark:text-blush transition-colors">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gloss font-semibold mb-3">404</p>
        <h1 className="font-display text-4xl md:text-5xl mb-4">Page not found</h1>
        <p className="text-ink/60 dark:text-blush/60 mb-8">
          The page you're looking for doesn't exist, or the link may be broken.
        </p>
        <Link
          to="/"
          className="inline-block bg-gloss hover:bg-gloss-dark transition text-white text-sm uppercase tracking-[0.15em] font-semibold rounded-full px-8 py-3.5"
        >
          Back to the collection
        </Link>
      </main>
      <Footer />
    </div>
  );
}
