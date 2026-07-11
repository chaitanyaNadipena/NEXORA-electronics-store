# NEXORA

**Premium Tech. Minimal Experience.**

NEXORA is a premium electronics product catalog built as a full-stack front-end capstone project — a minimal, luxury-tech-brand shopping experience with a real product catalog, live search and filtering, a persistent shopping cart, and a fully validated contact form. Built entirely with vanilla HTML5, CSS3, and JavaScript ES6 — no frameworks, no build step, no dependencies.

> Designed & Developed by **Chaitanya Nadipena**

---

## Overview

NEXORA showcases 32 curated electronics products across eight categories — laptops, smartphones, smart watches, headphones, speakers, gaming accessories, monitors, and cameras — presented in a black, glass, and white "premium technology brand" aesthetic. The project demonstrates production-level front-end engineering: semantic and accessible markup, a scalable CSS design system driven by custom properties, and modular JavaScript with no external UI libraries.

Live demo pages: `index.html` · `products.html` · `about.html` · `contact.html`

---

## Features

**Design & UX**
- Custom black / dark-gray / glass design system (CSS custom properties)
- Fully mobile-first, responsive from small phones to desktop monitors
- Branded loading screen with animated progress bar
- Navbar blur-on-scroll, smooth scroll, scroll-reveal animations (IntersectionObserver)
- Animated statistics counters, floating hero visuals, marquee strip
- Accessible: semantic HTML5, skip link, ARIA attributes, visible focus states, `prefers-reduced-motion` support

**Shopping Experience**
- Full product catalog (32 products / 8 categories) with ratings, badges, and pricing
- Live search with debounced input, category filter chips, and sorting (featured / price / rating)
- Product quick-view modal with full specs and add-to-cart
- Persistent shopping cart (localStorage-backed) with quantity controls, running subtotal, and a slide-out drawer
- Graceful image-fallback system — any broken product photo renders a themed placeholder instead of a broken-image icon

**Other Pages**
- **About** — company story, mission & vision, core values, "why choose us," animated achievement stats, and a milestone timeline
- **Contact** — contact details, a fully validated contact form (inline errors, focus-on-error, success state), social links, and a CSS-drawn map placeholder
- Newsletter subscription forms (hero section and footer)
- FAQ accordion, toast notifications, back-to-top button

---

## Folder Structure

```
NEXORA-STORE/
├── index.html          # Homepage
├── products.html        # Full product catalog with search & filters
├── about.html            # Company story, mission, values, achievements
├── contact.html          # Contact form, info, and map
├── css/
│   └── style.css         # Complete design system & all component styles
├── js/
│   ├── app.js             # Core engine: nav, cart, loader, accordion, animations
│   ├── products.js        # Product data, catalog rendering, search/filter, modal
│   └── contact.js         # Contact form validation
├── assets/
│   ├── images/            # (reserved for local image assets)
│   └── icons/              # (reserved for local icon assets)
└── README.md
```

---

## Technologies Used

- **HTML5** — semantic, accessible markup
- **CSS3** — custom properties, Grid, Flexbox, animations, no preprocessor
- **JavaScript (ES6+)** — vanilla, modular, no frameworks
- **Web APIs** — `localStorage`, `IntersectionObserver`, `URLSearchParams`
- **Google Fonts** — Space Grotesk (display) + Inter (body)
- No Bootstrap, no Tailwind, no React/Vue, no build tools required

---

## Installation

No build step or package manager required.

```bash
# 1. Clone the repository
git clone https://github.com/chaitanyaNadipena/nexora-store.git

# 2. Move into the project folder
cd nexora-store

# 3. Open index.html directly in a browser, or serve it locally:
npx serve .
# or
python3 -m http.server 8080
```

Then visit `http://localhost:8080` (or open `index.html` directly).

---

## Deployment

NEXORA is a fully static site and deploys as-is to any static host:

**GitHub Pages**
1. Push the repository to GitHub
2. Go to **Settings → Pages**
3. Set the source branch to `main` and folder to `/root`
4. Save — your site will be live at `https://<username>.github.io/<repo-name>/`

**Netlify**
1. Drag and drop the `NEXORA-STORE` folder into [Netlify Drop](https://app.netlify.com/drop), or connect the GitHub repo
2. No build command needed — publish directory is the project root

**Vercel**
1. Import the GitHub repository at [vercel.com/new](https://vercel.com/new)
2. Framework preset: **Other** — no build command required
3. Deploy

---

## Future Improvements

- Backend integration for real checkout, order history, and payments
- User accounts, wishlists, and saved carts across devices
- Real embedded map (Google Maps / Mapbox) in place of the CSS placeholder
- Product reviews submission and moderation
- CMS-driven product data instead of the static JavaScript array
- Automated testing (unit tests for cart logic, E2E tests for user flows)
- Image optimization pipeline and a CDN for product photography

---

## License

This project is released under the **MIT License**.

```
MIT License

Copyright (c) 2026 Chaitanya Nadipena

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

---

**© 2026 NEXORA.** All Rights Reserved. Designed & Developed by [Chaitanya Nadipena](https://github.com/chaitanyaNadipena).