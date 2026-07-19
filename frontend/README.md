# KALYNDA — Storefront Frontend

React + Vite + Tailwind frontend for the KALYNDA lip gloss & beauty storefront, wired to your Express/MongoDB API.

## What's included

- **Public site** (`/`) — a photo slideshow hero, a searchable product collection, and product detail pages. Light/dark mode toggle in the nav.
- **Bag & checkout** — add products to a cart from the collection grid or a product page (with quantity), view/edit it from the "Bag" button in the nav, and check out with one button that opens WhatsApp with a clean, itemized order summary (name, quantity, price, subtotal per item, and total).
- **Contact page** (`/contact`) — a WhatsApp button plus optional email/Instagram links.
- **Studio** (`/admin`) — sign in, view products in a list, add new products (with image/video upload), edit product details, delete products.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy the env file and configure it:
   ```
   cp .env.example .env
   ```
   ```
   VITE_API_URL=http://localhost:4040/api
   VITE_WHATSAPP_NUMBER=2348012345678
   VITE_CURRENCY_SYMBOL=₦
   VITE_CONTACT_EMAIL=hello@kalynda.com
   VITE_INSTAGRAM_HANDLE=kalynda
   ```
   - `VITE_WHATSAPP_NUMBER` — your WhatsApp number (the one that receives orders and inquiries), international format, digits only (no `+`, spaces, or dashes). For +234 801 234 5678, that's `2348012345678`. Used for single-item orders, cart checkout, and the Contact page.
   - `VITE_CURRENCY_SYMBOL` — shown next to every price. Defaults to `₦` if not set.
   - `VITE_CONTACT_EMAIL` / `VITE_INSTAGRAM_HANDLE` — optional. Only shown on the Contact page if set; leave blank to omit them.

   Restart `npm run dev` after editing `.env` — Vite only reads it on startup.

3. Make sure your backend is running (CORS is already enabled via `app.use(cors())`).

4. Start the dev server:
   ```
   npm run dev
   ```
   Opens at `http://localhost:5173`.

## Adding your logo

Save your logo as **`logo.png`** and place it directly in the `public/` folder of this project (`frontend/public/logo.png`). The site picks it up automatically — no code changes needed, in both the site navbar and the studio.

Recommended: transparent background PNG, roughly 400×120px (wide aspect ratio) so it sits well next to the nav. Until you add a file there, the site shows the "KALYNDA" wordmark instead.

## Adding hero slideshow photos

Save 2–3 brand photos as **`hero-1.jpg`**, **`hero-2.jpg`**, **`hero-3.jpg`** and place them in the `public/` folder (`frontend/public/hero-1.jpg`, etc.). They'll appear automatically as an auto-advancing slideshow in the big banner right under the header, with dot navigation at the bottom.

- Any of the three files can be missing — the slideshow just uses whichever ones exist.
- If none exist yet, the hero falls back to a plain plum-colored banner (no broken images).
- Landscape photos work best, ideally at least 1600px wide.
- Want more than 3 slides, or different filenames? Edit the `CANDIDATE_IMAGES` list at the top of `src/components/HeroSlideshow.jsx`.

## Dark mode

The toggle lives in the nav ("Dark mode" / "Light mode"). It respects the visitor's system preference on first visit, then remembers their choice in the browser after that.

## Deploying

A few things that only bite once you're live, not in local dev:

- **`VITE_API_URL` must point to your deployed backend**, not `localhost`. Set it as an environment variable in your hosting platform's dashboard (Vercel/Netlify → Project Settings → Environment Variables), not just in your local `.env` — that file isn't deployed. Same for `VITE_WHATSAPP_NUMBER`, `VITE_CURRENCY_SYMBOL`, etc.
- **Your backend's CORS needs to allow your deployed frontend's domain.** Right now `app.use(cors())` allows all origins, which works but is wide open — once both are live, consider restricting it to your actual frontend URL.
- **Deep links need a rewrite rule**, or visiting `/product/123` directly (or refreshing on it) 404s at the host level before React Router ever runs. This project already includes both: `public/_redirects` for Netlify and `vercel.json` for Vercel — just make sure they end up in your deployed build (they will, by default, since anything in `public/` is copied as-is).
- **Unmatched routes** now show a proper "Page not found" screen instead of a blank page (`src/pages/NotFound.jsx`).

## First-time use

Your backend has no seeded admin account. Go to `/admin/register`, create an account, then sign in at `/admin/login`.

## Notes on how this maps to your backend

- **File upload field name**: your route uses `upload.single('auto')`, so the create-product form sends the file under the `auto` field — don't rename this unless you also rename it in `productRoute.js`.
- **Editing media**: `PATCH /updateSingle/:id` doesn't accept a new file in your current controller (it just does `findByIdAndUpdate(req.params.id, req.body)`), so the edit form only lets you change name/price/description/stock, not the image. If you want image replacement on edit, that needs a small backend change (accept `upload.single('auto')` on that route too, and update `media`/`publicId`).
- **Media shape mismatch**: your `Product` schema defines `media` as an array of `{ url, publicId, type }`. The frontend defensively handles both a plain string and this array shape (`src/utils/media.js`).
- **Role field**: `register` accepts a `role`, but `roleMiddileware` is commented out on all routes, so it's not currently enforced anywhere.
- **Cart is local only**: cart contents live in the browser's `localStorage`, not the backend — there's no cart/order endpoint in your API. Checkout works entirely through the WhatsApp message; nothing is saved server-side when someone checks out.

## Design system

- **Colors**: warm blush background (light mode) / deep plum background (dark mode), a vivid "gloss" pink-red for calls to action, and a champagne gold accent — all defined in `tailwind.config.js`.
- **Type**: Bodoni Moda (high-contrast serif, echoes glossy sheen) for headings, Manrope for body text.
- **Signature element**: the gloss-drip badge — a teardrop shape used for price tags on product cards (`.gloss-drip` in `src/index.css`).

## Project structure

```
public/
  logo.png                — your logo (see "Adding your logo")
  hero-1.jpg / hero-2.jpg / hero-3.jpg — hero slideshow photos (see above)
src/
  api/client.js            — fetch wrapper for all backend calls
  context/
    AuthContext.jsx         — admin session (token/admin in localStorage)
    CartContext.jsx         — cart state (localStorage-backed)
    ThemeContext.jsx        — light/dark mode state
  components/               — Navbar, Logo, HeroSlideshow, CartDrawer, Footer,
                               AdminLayout, ProductCard, ProtectedRoute
  pages/                     — Home, ProductDetail, Contact, AdminLogin, AdminRegister,
                               AdminDashboard, AdminProductForm
  utils/media.js             — normalizes media field shape, formats price,
                               builds WhatsApp order/cart/contact links
```
