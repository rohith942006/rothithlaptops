# Rohith Laptops — Website

**Power Your Work. Upgrade Your Life.**

A complete, premium laptop e-commerce website built with **Next.js, React, TypeScript and Tailwind CSS**.

Pages included: Home, All Laptops (with filters), Gaming / Business / Student / Thin & Light / Creator / Accessories, Offers, Product Details (24 products), Search, Cart, Checkout, Wishlist, Account, About, Contact, and 8 help pages (Shipping, Returns, Warranty, FAQs, Privacy, Terms, Careers, Order Tracking).

> All prices and reviews are **demo / sample content**. No real payments are processed.

---

## ▶️ Run it on your computer (step by step)

**Step 1 — Install Node.js (one time only)**
Go to https://nodejs.org, download the **LTS** version, and install it (just click Next → Next → Finish).

**Step 2 — Unzip the project**
Unzip `rohith-laptops.zip` anywhere, e.g. your Desktop.

**Step 3 — Open a terminal in the folder**
- **Windows:** open the `rohith-laptops` folder, click the address bar at the top, type `cmd` and press Enter.
- **Mac:** right-click the folder → *New Terminal at Folder*.

**Step 4 — Install (one time only, takes 1–2 minutes)**
```
npm install
```

**Step 5 — Download the product photos (one time only)**
```
npm run images
```
This saves every real product photo into `public/products/`, so the site never depends on other websites.

> **START-WINDOWS.bat does steps 4, 5 and 6 for you** — just double-click it.

**Step 6 — Start the website**
```
npm run dev
```
Now open **http://localhost:3000** in your browser. 🎉
(To stop it, press `Ctrl + C` in the terminal.)

---

## 🌐 Put it online

### Option A — Vercel (easiest, free)
1. Create a free account at https://vercel.com (sign in with GitHub).
2. Upload this folder to a new GitHub repository.
3. In Vercel click **Add New → Project**, choose the repository, click **Deploy**.
4. Done — you get a live link. Add your own domain in *Settings → Domains*.

### Option B — Any normal hosting (Hostinger, cPanel, GoDaddy…)
1. In the terminal run:
   ```
   npm run build
   ```
2. This creates a folder called **`out`**.
3. Upload **everything inside `out`** to your hosting's `public_html` folder (using File Manager or FTP).

To preview the built site locally first: `npm run preview`

---

## 🖼️ Product photos

- Photos come from official manufacturer pages or authorised retailers, matched to the exact model.
- `npm run images` downloads them into `public/products/<product-id>/` and lists any that failed.
- If a photo can't load, the site shows a clean **"Image coming soon"** box with the product name — never a fake image.
- **To use your own photo:** save it as `public/products/<product-id>/1.jpg`, then in `lib/image-manifest.json` set `"<product-id>": ["/products/<product-id>/1.jpg"]`.
- **Before going live:** manufacturer product photos are normally licensed to their authorised sellers. Confirm usage with your distributor or the brand's partner portal (most brands provide an official image kit).

---

## ✏️ Common edits

| What to change | File |
|---|---|
| Products, prices, specs, photo links | `lib/products.ts` |
| Phone, email, WhatsApp number | `components/Footer.tsx` (the `contact` section at the top) |
| Hero slides (headlines, buttons) | `components/HeroCarousel.tsx` |
| Customer reviews | `components/home/Testimonials.tsx` |
| Help pages (Shipping, Returns, FAQs…) | `lib/info.ts` |
| Brand colours & fonts | `tailwind.config.ts` |
| Deal of the Week product | `dealOfWeekId` in `lib/products.ts` |
| Featured Deals products | `featuredIds` in `lib/products.ts` |

**Product images:** every product uses **real product photographs** of that exact model, taken from the manufacturer's website or an authorised retailer listing (Croma, Reliance Digital, B&H). The links are in the `image` and `gallery` fields in `lib/products.ts`.

---

## ⚙️ Before going live for real

This is a complete **frontend**. To take real orders you'll need to connect:
- **Payments** — e.g. Razorpay or Cashfree (UPI, cards, net banking, EMI)
- **Orders & accounts** — a backend/database (e.g. Supabase, Firebase, or Shopify as a headless backend)
- **Forms** — Contact & newsletter forms can connect to Formspree, EmailJS or Brevo

Cart and wishlist are already saved in the visitor's browser.

---

## 🧱 Project structure

```
app/                 → pages (each folder = a URL)
  page.tsx           → Home
  laptops/           → product listing + filters + search results
  product/[id]/      → product detail page
  cart/  checkout/  wishlist/  account/  offers/  about/  contact/  info/[slug]/
components/          → reusable building blocks
  Header, SearchOverlay, HeroCarousel, ProductCard, ProductArt,
  FilterPanel, ProductListing, ProductDetail, CartView, Checkout,
  OfferBanner, Footer, MobileTabBar, Toaster, home/* sections
lib/                 → data & logic (products, filters, cart store)
```

© 2026 Rohith Laptops. All Rights Reserved.
