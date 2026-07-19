import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { buildWhatsAppContactLink } from '../utils/media.js';

export default function Contact() {
  const whatsappLink = buildWhatsAppContactLink();
  const email = import.meta.env.VITE_CONTACT_EMAIL;
  const instagram = import.meta.env.VITE_INSTAGRAM_HANDLE;

  return (
    <div className="min-h-screen bg-blush dark:bg-plum-dark text-ink dark:text-blush transition-colors">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gloss font-semibold mb-3">
          Get in touch
        </p>
        <h1 className="font-display text-4xl md:text-5xl mb-4">Say hello</h1>
        <p className="text-ink/60 dark:text-blush/60 mb-10">
          Questions about a product, an order, or just want to talk shine? Reach out — we
          usually reply within the day.
        </p>

        <div className="flex flex-col items-center gap-4">
          {whatsappLink ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gloss hover:bg-gloss-dark transition text-white font-semibold rounded-full px-8 py-3.5 text-sm uppercase tracking-[0.1em]"
            >
              Message us on WhatsApp
            </a>
          ) : (
            <p className="text-xs text-rust">
              WhatsApp contact isn't set up yet — add VITE_WHATSAPP_NUMBER to your .env file.
            </p>
          )}

          {email && (
            <a href={`mailto:${email}`} className="text-sm text-ink/60 dark:text-blush/60 underline">
              {email}
            </a>
          )}

          {instagram && (
            <a
              href={`https://instagram.com/${instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink/60 dark:text-blush/60 underline"
            >
              @{instagram.replace('@', '')}
            </a>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
