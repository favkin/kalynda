import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

export default function MediaGallery({ media = [], name = 'Product' }) {
  const [index, setIndex] = useState(0);
  const videoRef = useRef(null);
  const count = media.length;

  const goTo = (i) => setIndex(((i % count) + count) % count);
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  // Pause video playback whenever we navigate away from it.
  useEffect(() => {
    if (videoRef.current) videoRef.current.pause();
  }, [index]);

  // Left/right arrow key support while the gallery is on screen.
  useEffect(() => {
    if (count < 2) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, count]);

  if (count === 0) {
    return (
      <div className="aspect-[4/5] bg-blush-deep dark:bg-studio rounded-[28px] flex items-center justify-center text-ink/30 dark:text-blush/30 text-sm">
        No media yet
      </div>
    );
  }

  const current = media[index];

  return (
    <div className="flex flex-col gap-4">
      {/* Main viewer */}
      <div className="relative aspect-[4/5] bg-blush-deep dark:bg-studio rounded-[28px] overflow-hidden group shadow-lg shadow-plum/10">
        {current.type === 'video' ? (
          <video
            ref={videoRef}
            src={current.url}
            className="w-full h-full object-cover"
            controls
            playsInline
          />
        ) : (
          <img
            src={current.url}
            alt={`${name} — media ${index + 1} of ${count}`}
            className="w-full h-full object-cover"
          />
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous media"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-plum-dark/85 backdrop-blur text-ink dark:text-blush flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-plum-dark transition sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next media"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-plum-dark/85 backdrop-blur text-ink dark:text-blush flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-plum-dark transition sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronRight size={20} />
            </button>

            {/* Dots — tappable position indicator, mobile-first navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden">
              {media.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Show media ${i + 1}`}
                  className={`h-1.5 rounded-full transition ${
                    i === index ? 'bg-gloss w-4' : 'bg-white/70 w-1.5'
                  }`}
                />
              ))}
            </div>

            <span className="absolute top-4 right-4 text-[11px] font-semibold uppercase tracking-[0.08em] bg-ink/60 text-white rounded-full px-2.5 py-1">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {count > 1 && (
        <div className="hidden sm:flex gap-2.5 overflow-x-auto pb-1">
          {media.map((item, i) => (
            <button
              type="button"
              key={item.publicId || i}
              onClick={() => goTo(i)}
              aria-label={`Show media ${i + 1}`}
              className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                i === index
                  ? 'border-gloss'
                  : 'border-transparent hover:border-line dark:hover:border-studio-line'
              }`}
            >
              {item.type === 'video' ? (
                <>
                  <video src={item.url} className="w-full h-full object-cover" muted />
                  <span className="absolute inset-0 bg-ink/30 flex items-center justify-center">
                    <Play size={16} className="text-white" fill="white" />
                  </span>
                </>
              ) : (
                <img src={item.url} alt="" className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
