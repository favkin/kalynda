// Normalize product media into a consistent array.
// Supports:
// - media: string
// - media: array of strings
// - media: array of { url, publicId, type }

export function resolveMediaList(product) {
  const media = product?.media;

  if (!media) {
    return [];
  }

  // Old format: media is just a Cloudinary URL
  if (typeof media === 'string') {
    return [
      {
        url: media,
        type: isVideoUrl(media) ? 'video' : 'image',
        publicId: media
      }
    ];
  }

  // Make sure media is actually an array
  if (!Array.isArray(media)) {
    return [];
  }

  const normalized = media
    .map((item, index) => {
      // If media item is just a URL string
      if (typeof item === 'string') {
        return {
          url: item,
          type: isVideoUrl(item) ? 'video' : 'image',
          publicId: item,
          order: index
        };
      }

      // If media item is an object
      if (item?.url) {
        return {
          url: item.url,
          type:
            item.type ||
            (isVideoUrl(item.url) ? 'video' : 'image'),
          publicId: item.publicId || item.url,
          isPrimary: item.isPrimary,
          order: item.order ?? index
        };
      }

      return null;
    })
    .filter(Boolean);

  // Primary media first.
  // Then images before videos.
  // Then stored order.
  return normalized.sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) {
      return -1;
    }

    if (b.isPrimary && !a.isPrimary) {
      return 1;
    }

    if (a.type !== b.type) {
      return a.type === 'image' ? -1 : 1;
    }

    return (a.order ?? 0) - (b.order ?? 0);
  });
}


// Get the best image/video URL for product cards.
export function resolveMediaUrl(product) {
  const list = resolveMediaList(product);

  if (list.length === 0) {
    return null;
  }

  // Prefer an image for product cards.
  const image = list.find((media) => media.type === 'image');

  return (image || list[0]).url;
}


// Check whether a URL is a video.
export function isVideoUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  return /\.(mp4|mov|webm)(\?.*)?$/i.test(url);
}


// Currency
const CURRENCY = import.meta.env.VITE_CURRENCY_SYMBOL || '₦';


// Format product price.
export function formatPrice(price) {
  const number = Number(price);

  if (Number.isNaN(number)) {
    return `${CURRENCY}${price}`;
  }

  return `${CURRENCY}${number.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}


// Build WhatsApp link for one product.
export function buildWhatsAppOrderLink(product) {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER;

  if (!number) {
    return null;
  }

  const productUrl =
    `${window.location.origin}/product/${product._id}`;

  const message =
    `Good day, I want this item: ${product.name}\n` +
    `Price: ${formatPrice(product.price)}\n` +
    `Link: ${productUrl}`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}


// Build WhatsApp cart message.
export function buildWhatsAppCartMessage(items) {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER;

  if (!number || !items.length) {
    return null;
  }

  const lines = items.map(({ product, quantity }, index) => {
    const subtotal =
      (Number(product.price) || 0) * quantity;

    return (
      `${index + 1}. ${product.name}\n` +
      `Qty: ${quantity} · ` +
      `${formatPrice(product.price)} each · ` +
      `Subtotal: ${formatPrice(subtotal)}`
    );
  });

  const total = items.reduce(
    (sum, item) =>
      sum +
      (Number(item.product.price) || 0) * item.quantity,
    0
  );

  const message =
    `Good day, I'd like to place an order:\n\n` +
    lines.join('\n\n') +
    `\n\n----------------------------\n` +
    `Total: ${formatPrice(total)}\n\n` +
    `Thank you!`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}


// Build WhatsApp contact link.
export function buildWhatsAppContactLink() {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER;

  if (!number) {
    return null;
  }

  const message = 'Hi KALYNDA, I have a question.';

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}