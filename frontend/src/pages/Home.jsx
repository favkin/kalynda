import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Truck, Sparkles, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import HeroSlideshow from '../components/HeroSlideshow.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { api } from '../api/client.js';

const TRUST_POINTS = [
  { icon: Leaf, label: 'Clean formula', detail: 'No nasties, ever' },
  { icon: ShieldCheck, label: 'Cruelty-free', detail: 'Never tested on animals' },
  { icon: Truck, label: 'Fast dispatch', detail: 'Shipped within 48h' },
  { icon: Sparkles, label: 'High shine', detail: 'Salon finish, everyday' }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getHomeProducts()
      .then((data) => setProducts(data.products || []))
      .catch((err) => setError(err.message || 'Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-blush dark:bg-plum-dark text-ink dark:text-blush transition-colors">
      <Navbar />

      {/* Hero — asymmetric, left-weighted copy over the slideshow */}
      <section className="relative overflow-hidden bg-plum text-blush">
        <HeroSlideshow />

        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 relative z-10">
          <div className="max-w-lg">
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold mb-5">
              High-shine, low-effort
            </p>

            <h1 className="font-display text-5xl md:text-7xl leading-[1.03] mb-6">
              Gloss that
              <br />
              speaks for itself
            </h1>

            <p className="text-blush/75 font-medium max-w-sm mb-10">
              Lip gloss and beauty essentials made for everyday shine. Browse the full
              collection and find your next go-to shade.
            </p>

            <Link
              to="/shop"
              className="inline-block bg-gloss hover:bg-gloss-dark transition text-white text-sm uppercase tracking-[0.15em] font-semibold rounded-full px-8 py-3.5"
            >
              Shop the collection
            </Link>
          </div>
        </div>
      </section>

      {/* Trust strip — pulled up to float over the hero's bottom edge */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 -mt-14 md:-mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white dark:bg-studio-raised rounded-2xl shadow-xl shadow-plum/20 p-5 md:p-6">
          {TRUST_POINTS.map(({ icon: Icon, label, detail }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gloss/10 text-gloss flex items-center justify-center flex-shrink-0">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-ink dark:text-blush text-sm font-semibold leading-tight truncate">
                  {label}
                </p>
                <p className="text-ink/55 dark:text-blush/50 text-xs truncate">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand-story / educational banner */}
      <section className="max-w-6xl mx-auto px-6 pt-14 md:pt-16 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[28px] overflow-hidden shadow-lg shadow-plum/10">
          <div className="order-2 md:order-1 bg-plum text-blush p-8 md:p-12 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-4">
              What makes KALYNDA different
            </p>
            <h2 className="font-display text-3xl md:text-4xl leading-tight mb-5">
              A formula built around comfort, not just color
            </h2>
            <p className="text-blush/75 font-medium leading-relaxed mb-6 max-w-md">
              Every gloss is built on a lightweight, non-sticky base infused with
              nourishing oils — so it feels as good on hour six as it does on application.
              No animal testing, no harsh fillers, just a finish that holds up.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.12em] font-semibold text-gold hover:text-gold-light transition w-fit"
            >
              Explore the range <ArrowRight size={15} />
            </Link>
          </div>
          <div className="order-1 md:order-2 aspect-[4/3] md:aspect-auto">
            <img
              src="/hero-2.jpg"
              alt="KALYNDA lip gloss lineup"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured collection — bento-style grid */}
      <main id="collection" className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gloss font-semibold mb-2">
              Fan favorites
            </p>
            <h2 className="font-display text-3xl md:text-4xl">A few of the best</h2>
          </div>

          <Link
            to="/shop"
            className="inline-block border border-gloss text-gloss hover:bg-gloss hover:text-white transition text-sm uppercase tracking-[0.15em] font-semibold rounded-full px-6 py-3"
          >
            See full shop
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="aspect-square bg-blush-deep dark:bg-studio animate-pulse" />
                <div className="p-5 space-y-2">
                  <div className="h-4 w-2/3 bg-blush-deep dark:bg-studio rounded animate-pulse" />
                  <div className="h-3 w-full bg-blush-deep dark:bg-studio rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-rust text-sm">Couldn't load products: {error}</p>}

        {!loading && !error && products.length === 0 && (
          <div className="border border-dashed border-line dark:border-studio-line rounded-2xl py-20 text-center">
            <p className="font-display text-2xl mb-1">Nothing here yet</p>
            <p className="text-ink/60 dark:text-blush/55 text-sm">
              Add a product from the studio to see it here.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:auto-rows-fr">
            {products.slice(0, 8).map((product, i) => (
              <div key={product._id} className={i === 0 ? 'sm:col-span-2' : ''}>
                <ProductCard product={product} featured={i === 0} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
