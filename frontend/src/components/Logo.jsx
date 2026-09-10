import { useState } from 'react';

/**
 * Brand logo. Drop your logo file into /public/logo.png (or .svg) and it
 * will show up here automatically — no code changes needed.
 * If no logo file is found, it falls back to the KALYNDA wordmark.
 */
export default function Logo({ light = false, className = '' }) {
  const [failed, setFailed] = useState(false);
  const sizeClass = className || 'h-24';

  if (!failed) {
    return (
      <img
        src="/logo.png"
        alt="KALYNDA"
        onError={() => setFailed(true)}
        className={`w-auto object-contain ${sizeClass}`}
      />
    );
  }

  return (
    <span
      className={`font-display text-2xl tracking-wide ${light ? 'text-blush' : 'text-ink dark:text-blush'} ${className}`}
    >
      KALYNDA
    </span>
  );
}
