// The backend's media field is inconsistent — sometimes a plain Cloudinary URL
// string, sometimes an array of { url, publicId, type }. This normalizes it
// so the UI never has to care which shape it got.
export function resolveMediaUrl(product) {
  const media = product?.media;
  if (!media) return null;
  if (typeof media === 'string') return media;
  if (Array.isArray(media) && media.length > 0) {
    const first = media[0];
    if (typeof first === 'string') return first;
    if (first?.url) return first.url;
  }
  return null;
}

export function isVideoUrl(url) {
  if (!url) return false;
  return /\.(mp4|mov|webm)(\?.*)?$/i.test(url);
}

const CURRENCY = import.meta.env.VITE_CURRENCY_SYMBOL || '₦';

export function formatPrice(price) {
  const n = Number(price);
  if (Number.isNaN(n)) return `${CURRENCY}${price}`;
  return `${CURRENCY}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Builds a wa.me link pre-filled with an order message for a specific product.
export function buildWhatsAppOrderLink(product) {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER;
  if (!number) return null;

  const productUrl = `${window.location.origin}/product/${product._id}`;
  const message =
    `Good day, I want this item: ${product.name}\n` +
    `Price: ${formatPrice(product.price)}\n` +
    `Link: ${productUrl}`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

// Builds a wa.me link pre-filled with a nicely formatted order summary for
// every item in the cart — used by the cart checkout button.
export function buildWhatsAppCartMessage(items) {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER;
  if (!number || items.length === 0) return null;

  const lines = items.map(({ product, quantity }, index) => {
    const subtotal = (Number(product.price) || 0) * quantity;
    return (
      `${index + 1}. ${product.name}\n` +
      `   Qty: ${quantity}  ·  ${formatPrice(product.price)} each  ·  Subtotal: ${formatPrice(subtotal)}`
    );
  });

  const total = items.reduce((sum, i) => sum + (Number(i.product.price) || 0) * i.quantity, 0);

  const message =
    `Good day, I'd like to place an order:\n\n` +
    lines.join('\n\n') +
    `\n\n----------------------------\n` +
    `Total: ${formatPrice(total)}\n\n` +
    `Thank you!`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

// Builds a general wa.me link for the contact page — not tied to a product.
export function buildWhatsAppContactLink() {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER;
  if (!number) return null;
  const message = "Hi KALYNDA, I have a question.";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
