import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { api } from '../api/client.js';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to high' },
  { value: 'price_desc', label: 'Price: High to low' },
  { value: 'name_asc', label: 'Name: A to Z' }
];

const LIMIT = 12;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';

  // Local text-field state so typing doesn't refetch on every keystroke.
  const [searchInput, setSearchInput] = useState(search);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => setSearchInput(search), [search]);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .getAllProducts({ page, limit: LIMIT, sort, search })
      .then((data) => {
        setProducts(data.products || []);
        setPagination(data.pagination || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, sort, search]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === null) next.delete(key);
      else next.set(key, value);
    });
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput || undefined, page: undefined });
  };

  const goToPage = (p) => {
    updateParams({ page: p > 1 ? p : undefined });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-blush dark:bg-plum-dark text-ink dark:text-blush transition-colors">
      <Navbar />

      {/* Header band */}
      <section className="bg-plum text-blush">
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-16">
          <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-3">
            Full collection
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-[1.05] max-w-lg">
            Every shade, every finish, all in one place
          </h1>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 dark:text-blush/40"
            />
            <input
              type="search"
              id="shop-search"
              name="shop-search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products…"
              className="w-full border border-line dark:border-studio-line rounded-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-studio-raised dark:text-blush focus:outline-none focus:border-gloss"
            />
          </form>

          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="sm:hidden inline-flex items-center justify-center gap-2 border border-line dark:border-studio-line rounded-full px-4 py-2.5 text-sm font-medium"
          >
            <SlidersHorizontal size={15} /> Sort
          </button>

          <div className={`${filtersOpen ? 'flex' : 'hidden'} sm:flex items-center gap-2`}>
            <label htmlFor="shop-sort" className="sr-only">
              Sort by
            </label>
            <select
              id="shop-sort"
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value === 'newest' ? undefined : e.target.value, page: undefined })}
              className="border border-line dark:border-studio-line rounded-full px-4 py-2.5 text-sm bg-white dark:bg-studio-raised dark:text-blush focus:outline-none focus:border-gloss"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result count */}
        {!loading && !error && pagination && (
          <p className="text-xs uppercase tracking-[0.1em] text-ink/60 dark:text-blush/50 font-semibold mb-6">
            {pagination.totalProducts} product{pagination.totalProducts === 1 ? '' : 's'}
            {search ? ` for "${search}"` : ''}
          </p>
        )}

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
              {search ? 'No products match your search.' : 'Add a product from the studio to see it here.'}
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={!pagination.hasPreviousPage}
              aria-label="Previous page"
              className="w-9 h-9 rounded-full border border-line dark:border-studio-line flex items-center justify-center disabled:opacity-30 hover:border-gloss transition"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-sm font-medium text-ink/70 dark:text-blush/70 px-3">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={!pagination.hasNextPage}
              aria-label="Next page"
              className="w-9 h-9 rounded-full border border-line dark:border-studio-line flex items-center justify-center disabled:opacity-30 hover:border-gloss transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
