import { useCart } from '../context/CartContext.jsx';
import { resolveMediaUrl, formatPrice, buildWhatsAppCartMessage } from '../utils/media.js';

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const whatsappLink = buildWhatsAppCartMessage(items);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-ink/50 z-40 transition-opacity ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-blush dark:bg-plum-dark text-ink dark:text-blush z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-line dark:border-studio-line">
          <h2 className="font-display text-2xl">Your bag</h2>
          <button
            onClick={onClose}
            aria-label="Close bag"
            className="text-2xl leading-none text-ink/50 dark:text-blush/50 hover:text-gloss transition"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-display text-xl mb-1">Your bag is empty</p>
              <p className="text-sm text-ink/50 dark:text-blush/50">
                Add a product to see it here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {items.map(({ product, quantity }) => {
                const mediaUrl = resolveMediaUrl(product);
                return (
                  <div key={product._id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-blush-deep dark:bg-studio flex-shrink-0">
                      {mediaUrl && (
                        <img src={mediaUrl} alt={product.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-ink/50 dark:text-blush/50 mb-2">
                        {formatPrice(product.price)}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(product._id, quantity - 1)}
                          disabled={quantity <= 1}
                          className="w-6 h-6 rounded-full border border-line dark:border-studio-line text-xs disabled:opacity-30"
                        >
                          −
                        </button>
                        <span className="text-xs w-4 text-center">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product._id, quantity + 1)}
                          className="w-6 h-6 rounded-full border border-line dark:border-studio-line text-xs"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(product._id)}
                          className="ml-auto text-[11px] uppercase tracking-[0.08em] text-rust"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={clearCart}
                className="text-[11px] uppercase tracking-[0.08em] text-ink/40 dark:text-blush/40 hover:text-rust transition self-start"
              >
                Clear bag
              </button>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-line dark:border-studio-line">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm uppercase tracking-[0.1em] text-ink/60 dark:text-blush/60">
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
        )}
      </aside>
    </>
  );
}
