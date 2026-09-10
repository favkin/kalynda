import { MessageCircle, Mail, Instagram, ArrowUpRight } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { buildWhatsAppContactLink } from '../utils/media.js';

export default function Contact() {
  const whatsappLink = buildWhatsAppContactLink();
  const email = import.meta.env.VITE_CONTACT_EMAIL;
  const instagram = import.meta.env.VITE_INSTAGRAM_HANDLE;

  const channels = [
    whatsappLink && {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: 'Chat with us directly',
      href: whatsappLink,
      external: true,
      primary: true
    },
    email && {
      icon: Mail,
      label: 'Email',
      value: email,
      href: `mailto:${email}`
    },
    instagram && {
      icon: Instagram,
      label: 'Instagram',
      value: `@${instagram.replace('@', '')}`,
      href: `https://instagram.com/${instagram.replace('@', '')}`,
      external: true
    }
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-blush dark:bg-plum-dark text-ink dark:text-blush transition-colors">
      <Navbar />

      <main className="relative overflow-hidden">
        {/* Decorative gradient wash */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gloss/20 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-24 w-72 h-72 rounded-full bg-gold/20 blur-3xl" />

        <div className="max-w-4xl mx-auto px-6 py-20 md:py-28 relative">
          <p className="text-xs uppercase tracking-[0.2em] text-gloss font-semibold mb-4">
            Get in touch
          </p>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.05] mb-5 max-w-xl">
            Questions about shine, orders, or shades?
          </h1>
          <p className="text-ink/75 dark:text-blush/70 font-medium max-w-md mb-14">
            Pick whichever's easiest — we usually reply within the day.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {channels.map(({ icon: Icon, label, value, href, external, primary }) => (
              <a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className={`group relative flex flex-col gap-4 rounded-[22px] p-6 transition duration-300 hover:-translate-y-1 ${
                  primary
                    ? 'bg-plum text-blush shadow-xl shadow-plum/20'
                    : 'bg-white dark:bg-studio-raised shadow-md shadow-plum/5 hover:shadow-xl hover:shadow-plum/10'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center ${
                    primary ? 'bg-gloss text-white' : 'bg-gloss/10 text-gloss'
                  }`}
                >
                  <Icon size={19} />
                </div>
                <div>
                  <p
                    className={`text-xs uppercase tracking-[0.12em] font-semibold mb-1 ${
                      primary ? 'text-gold' : 'text-gold'
                    }`}
                  >
                    {label}
                  </p>
                  <p className={`text-sm font-medium break-words ${primary ? 'text-blush/90' : 'text-ink/80 dark:text-blush/80'}`}>
                    {value}
                  </p>
                </div>
                <ArrowUpRight
                  size={16}
                  className={`absolute top-6 right-6 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    primary ? 'text-blush/50' : 'text-ink/30 dark:text-blush/30'
                  }`}
                />
              </a>
            ))}
          </div>

          {channels.length === 0 && (
            <p className="text-sm text-rust">
              No contact channels are configured yet — add VITE_WHATSAPP_NUMBER, VITE_CONTACT_EMAIL,
              or VITE_INSTAGRAM_HANDLE to your .env file.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
