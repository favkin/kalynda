import { useEffect, useState } from 'react';

// Drop your own photos into /public as hero-1.jpg, hero-2.jpg, hero-3.jpg
// (or .png) and they'll appear here automatically as a slideshow.
// Add fewer or more by editing this list.
const CANDIDATE_IMAGES = ['/hero-1.jpg', '/hero-2.jpg', '/hero-3.jpg', '/hero-4.jpg','/hero-5.jpg', '/hero-6.jpg', '/hero-7.jpg'];

export default function HeroSlideshow({ interval = 4500 }) {
  const [images, setImages] = useState(null); // null = still checking
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      CANDIDATE_IMAGES.map(
        (src) =>
          new Promise((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(null);
            img.src = src;
          })
      )
    ).then((results) => {
      if (!cancelled) setImages(results.filter(Boolean));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!images || images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images, interval]);

  if (!images || images.length === 0) return null;

  return (
    <div className="absolute inset-0">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-plum/70" />

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition ${
                i === index ? 'bg-gold' : 'bg-blush/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
