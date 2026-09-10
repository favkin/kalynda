import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useCart } from '../context/CartContext.jsx';
import { resolveMediaUrl, formatPrice, buildWhatsAppCartMessage } from '../utils/media.js';

export default function Bag() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const whatsappLink = buildWhatsAppCartMessage(items);

  return (
    <div className="min-h-screen bg-blush dark:bg-plum-dark text-ink dark:text-blush transition-colors">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-semibold text-ink/60 dark:text-blush/55 hover:text-gloss transition mb-8"
        >
          <ArrowLeft size={14} /> Continue shopping
        </Link>

        <h1 className="font-display text-3xl md:text-4xl mb-10">
          Your bag {totalItems > 0 && <span className="text-gloss">({totalItems})</span>}
        </h1>

        {items.length === 0 ? (
          <div className="border border-dashed border-line dark:border-studio-line rounded-2xl py-24 text-center">
            <p className="font-display text-2xl mb-2">Your bag is empty</p>
            <p className="text-ink/60 dark:text-blush/55 text-sm mb-8">
              Browse the collection and add something you love.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-gloss hover:bg-gloss-dark transition text-white text-sm uppercase tracking-[0.15em] font-semibold rounded-full px-8 py-3.5"
            >
              Shop the collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
            {/* Line items */}
            <div className="flex flex-col gap-4">
              {items.map(({ product, quantity }) => {
                const mediaUrl = resolveMediaUrl(product);
                const subtotal = (Number(product.price) || 0) * quantity;
                return (
                  <div
                    key={product._id}
                    className="flex gap-4 bg-white dark:bg-studio-raised rounded-2xl p-4 shadow-sm shadow-plum/5"
                  >
                    <Link
                      to={`/product/${product._id}`}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-blush-deep dark:bg-studio flex-shrink-0"
                    >
                      {mediaUrl && (
                        <img src={mediaUrl} alt={product.name} className="w-full h-full object-cover" />
                      )}
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          to={`/product/${product._id}`}
                          className="font-display text-lg leading-snug hover:text-gloss transition"
                        >
                          {product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(product._id)}
                          aria-label={`Remove ${product.name}`}
                          className="text-ink/40 dark:text-blush/40 hover:text-rust transition flex-shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <p className="text-sm text-ink/55 dark:text-blush/50 mb-3">
                        {formatPrice(product.price)} each
                      </p>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2.5 border border-line dark:border-studio-line rounded-full px-1 py-1">
                          <button
                            onClick={() => updateQuantity(product._id, quantity - 1)}
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-blush-deep dark:hover:bg-studio disabled:opacity-30 transition"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm w-4 text-center font-medium">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product._id, quantity + 1)}
                            aria-label="Increase quantity"
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-blush-deep dark:hover:bg-studio transition"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span className="font-display text-lg text-gloss">
                          {formatPrice(subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={clearCart}
                className="self-start text-xs uppercase tracking-[0.1em] font-semibold text-ink/40 dark:text-blush/40 hover:text-rust transition mt-2"
              >
                Clear bag
              </button>
            </div>

            {/* Summary */}
            <div className="bg-white dark:bg-studio-raised rounded-2xl p-6 shadow-sm shadow-plum/5 lg:sticky lg:top-28">
              <h2 className="font-display text-xl mb-5">Order summary</h2>

              <div className="flex flex-col gap-2.5 text-sm mb-5">
                <div className="flex justify-between text-ink/65 dark:text-blush/60">
                  <span>Items ({totalItems})</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-ink/65 dark:text-blush/60">
                  <span>Delivery</span>
                  <span>Arranged on WhatsApp</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-line dark:border-studio-line pt-4 mb-6">
                <span className="text-sm uppercase tracking-[0.1em] font-semibold text-ink/70 dark:text-blush/70">
                  Total
                </span>
                <span className="font-display text-2xl text-gloss">{formatPrice(totalPrice)}</span>
              </div>

              {whatsappLink ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-gloss hover:bg-gloss-dark transition text-white font-semibold rounded-full py-3.5 text-sm uppercase tracking-[0.1em]"
                >
                  Checkout on WhatsApp
                </a>
              ) : (
                <p className="text-xs text-rust text-center">
                  Checkout isn't set up yet — add VITE_WHATSAPP_NUMBER to your .env file.
                </p>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
