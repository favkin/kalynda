import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { api } from '../api/client.js';
import { resolveMediaUrl, isVideoUrl, formatPrice, buildWhatsAppOrderLink } from '../utils/media.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    api
      .getProduct(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-blush dark:bg-plum-dark text-ink dark:text-blush transition-colors">
        <Navbar />
        <p className="max-w-6xl mx-auto px-6 py-16 text-ink/50 dark:text-blush/50 text-sm">Loading…</p>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-blush dark:bg-plum-dark text-ink dark:text-blush transition-colors">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="font-display text-3xl mb-2">Product not found</p>
          <p className="text-ink/50 dark:text-blush/50 text-sm mb-6">{error || 'It may have been removed.'}</p>
          <Link to="/" className="text-gloss text-sm underline">
            ← Back to the collection
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const mediaUrl = resolveMediaUrl(product);
  const outOfStock = Number(product.stock) <= 0;
  const whatsappLink = buildWhatsAppOrderLink(product);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="min-h-screen bg-blush dark:bg-plum-dark text-ink dark:text-blush transition-colors">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-14">
        <Link to="/" className="text-xs uppercase tracking-[0.15em] text-ink/50 dark:text-blush/50 hover:text-gloss transition">
          ← Back to the collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 mt-8">
          <div className="aspect-square bg-blush-deep dark:bg-studio rounded-2xl overflow-hidden relative">
            {mediaUrl ? (
              isVideoUrl(mediaUrl) ? (
                <video src={mediaUrl} className="w-full h-full object-cover" controls />
              ) : (
                <img src={mediaUrl} alt={product.name} className="w-full h-full object-cover" />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink/30 dark:text-blush/30 text-sm">
                no image
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="font-display text-4xl leading-tight mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="font-display text-2xl text-gloss">{formatPrice(product.price)}</span>
              <span className="text-line dark:text-studio-line">·</span>
              {outOfStock ? (
                <span className="text-rust text-xs uppercase tracking-[0.12em] font-semibold">
                  Sold out
                </span>
              ) : (
                <span className="text-gold text-xs uppercase tracking-[0.12em] font-semibold">
                  {product.stock} in stock
                </span>
              )}
            </div>

            <p className="text-ink/70 dark:text-blush/70 leading-relaxed whitespace-pre-line mb-8">
              {product.description}
            </p>

            {!outOfStock && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs uppercase tracking-[0.1em] text-ink/50 dark:text-blush/50">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-full border border-line dark:border-studio-line hover:border-gloss transition"
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-full border border-line dark:border-studio-line hover:border-gloss transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {!outOfStock && (
                <button
                  onClick={handleAddToCart}
                  className={`inline-flex items-center justify-center gap-2 font-semibold rounded-full px-8 py-3.5 text-sm uppercase tracking-[0.1em] transition ${
                    added
                      ? 'bg-gold text-ink'
                      : 'bg-plum dark:bg-studio-raised text-blush border border-plum dark:border-studio-line hover:bg-plum-light'
                  }`}
                >
                  {added ? 'Added to bag ✓' : 'Add to bag'}
                </button>
              )}

              {outOfStock ? (
                <button
                  disabled
                  className="inline-flex items-center justify-center gap-2 bg-ink/10 dark:bg-blush/10 text-ink/40 dark:text-blush/40 font-semibold rounded-full px-8 py-3.5 text-sm uppercase tracking-[0.1em] w-full sm:w-auto cursor-not-allowed"
                >
                  Sold out
                </button>
              ) : whatsappLink ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-gloss hover:bg-gloss-dark transition text-white font-semibold rounded-full px-8 py-3.5 text-sm uppercase tracking-[0.1em] w-full sm:w-auto"
                >
                  Order now on WhatsApp
                </a>
              ) : null}
            </div>

            {!whatsappLink && !outOfStock && (
              <p className="text-xs text-rust mt-3">
                Order button isn't set up yet — add VITE_WHATSAPP_NUMBER to your .env file.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
