import { useEffect, useRef, useState } from 'react';

// Returns 'up' | 'down' plus whether we're still near the very top of the
// page. Used to hide the header while scrolling down and reveal it again on
// the way back up, without fighting tiny scroll jitters.
export function useScrollDirection({ threshold = 8 } = {}) {
  const [direction, setDirection] = useState('up');
  const [atTop, setAtTop] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const update = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY.current;

      setAtTop(currentY < 12);

      if (Math.abs(delta) >= threshold) {
        setDirection(delta > 0 ? 'down' : 'up');
        lastY.current = currentY;
      }

      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(update);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { direction, atTop };
}
