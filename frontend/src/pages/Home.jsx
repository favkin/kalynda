import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import HeroSlideshow from '../components/HeroSlideshow.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { api } from '../api/client.js';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    api
      .getAllProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blush dark:bg-plum-dark text-ink dark:text-blush transition-colors">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-plum text-blush">
        <HeroSlideshow />

        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative z-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold mb-5">
            High-shine, low-effort
          </p>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-6">
            Gloss that
            <br />
            speaks for itself
          </h1>
          <p className="text-blush/70 max-w-md mx-auto mb-10">
            Lip gloss and beauty essentials made for everyday shine. Browse the full
            collection below.
          </p>
          <a
            href="#collection"
            className="inline-block bg-gloss hover:bg-gloss-dark transition text-white text-sm uppercase tracking-[0.15em] font-semibold rounded-full px-8 py-3.5"
          >
            Shop the collection
          </a>
        </div>
      </section>

      <main id="collection" className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gloss font-semibold mb-2">
              The collection
            </p>
            <h2 className="font-display text-3xl md:text-4xl">Every shade, every finish</h2>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full sm:w-64 border border-line dark:border-studio-line rounded-full px-4 py-2.5 text-sm bg-white dark:bg-studio-raised dark:text-blush focus:outline-none focus:border-gloss"
          />
        </div>

        {loading && <p className="text-ink/50 dark:text-blush/50 text-sm">Loading products…</p>}

        {error && <p className="text-rust text-sm">Couldn't load products: {error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <div className="border border-dashed border-line dark:border-studio-line rounded-2xl py-20 text-center">
            <p className="font-display text-2xl mb-1">Nothing here yet</p>
            <p className="text-ink/50 dark:text-blush/50 text-sm">
              {query
                ? 'No products match your search.'
                : 'Add a product from the studio to see it here.'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
