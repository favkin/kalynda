import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Images } from 'lucide-react';
import { resolveMediaUrl, resolveMediaList, isVideoUrl, formatPrice } from '../utils/media.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product, featured = false }) {
  const mediaUrl = resolveMediaUrl(product);
  const mediaCount = resolveMediaList(product).length;
  const outOfStock = Number(product.stock) <= 0;
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className={`group relative flex bg-white dark:bg-studio-raised rounded-2xl overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-plum/10 ${
        featured ? 'flex-col sm:flex-row h-full' : 'flex-col'
      }`}
    >
      <div
        className={`bg-blush-deep dark:bg-studio overflow-hidden relative ${
          featured ? 'aspect-square sm:aspect-auto sm:w-1/2' : 'aspect-square'
        }`}
      >
        {mediaUrl ? (
          isVideoUrl(mediaUrl) ? (
            <video src={mediaUrl} className="w-full h-full object-cover" muted playsInline />
          ) : (
            <img
              src={mediaUrl}
              alt={product.name}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30 dark:text-blush/30 text-sm">
            no image
          </div>
        )}

        {/* Gloss drip price badge — the brand's signature mark */}
        <div className="gloss-drip absolute top-3 right-3 w-14 h-14 bg-gloss shadow-md flex items-center justify-center">
          <span className="text-[11px] font-semibold text-white leading-tight text-center px-1">
            {formatPrice(product.price)}
          </span>
        </div>

        {featured && (
          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.15em] font-bold bg-gold text-ink rounded-full px-3 py-1">
            Editor's pick
          </span>
        )}

        {outOfStock && (
          <div className="absolute inset-0 bg-ink/50 flex items-center justify-center">
            <span className="text-white text-xs uppercase tracking-[0.15em] font-semibold border border-white/60 rounded-full px-4 py-1.5">
              Sold out
            </span>
          </div>
        )}

        {mediaCount > 1 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-ink/55 backdrop-blur text-white text-[10px] font-semibold rounded-full px-2 py-1">
            <Images size={11} /> {mediaCount}
          </div>
        )}
      </div>

      <div
        className={`p-5 flex-1 flex flex-col gap-1.5 ${
          featured ? 'sm:w-1/2 sm:justify-center sm:p-8' : ''
        }`}
      >
        <h3 className={`font-display leading-snug ${featured ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
          {product.name}
        </h3>
        <p
          className={`text-sm text-ink/65 dark:text-blush/55 ${
            featured ? 'sm:text-base line-clamp-3' : 'line-clamp-2'
          }`}
        >
          {product.description}
        </p>

        <div className={`flex items-center justify-between gap-3 ${featured ? 'mt-5' : 'mt-auto pt-3'}`}>
          {!outOfStock && (
            <span className="text-[11px] uppercase tracking-[0.12em] text-gold font-semibold">
              {product.stock} left
            </span>
          )}
          {!outOfStock && (
            <button
              onClick={handleAddToCart}
              className={`ml-auto text-[11px] uppercase tracking-[0.1em] font-semibold rounded-full px-3.5 py-1.5 transition ${
                added
                  ? 'bg-gold text-ink'
                  : 'bg-plum text-blush dark:bg-gloss hover:bg-gloss dark:hover:bg-gloss-dark'
              }`}
            >
              {added ? 'Added ✓' : 'Add to bag'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
