/* ==========================================================================
   NEXORA — Product Catalog Engine
   Handles: product data, card rendering, homepage featured/trending rails,
   full catalog page (search, category filters, sort), and the product
   detail modal.
   ========================================================================== */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const formatPrice = (n) => `$${n.toLocaleString("en-US")}`;

  /* ------------------------------------------------------------------ */
  /*  Product Data                                                       */
  /* ------------------------------------------------------------------ */
  const PRODUCTS = [
    // ---------------- LAPTOPS ----------------
    {
      id: "lap-01", name: "NEXORA Aero 14 Ultrabook", category: "laptops",
      price: 1699, oldPrice: 1899, rating: 4.8, reviews: 214, badge: "sale", trending: true, featured: true,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
      desc: "A 14-inch featherweight ultrabook milled from a single block of aluminum, built for creators who work from anywhere.",
      specs: { Display: "14\" 2.8K OLED", Processor: "12-core, 4.2GHz", Memory: "32GB Unified", Storage: "1TB SSD", Battery: "Up to 19 hrs", Weight: "1.15 kg" },
    },
    {
      id: "lap-02", name: "NEXORA Forge 16 Pro", category: "laptops",
      price: 2399, oldPrice: null, rating: 4.9, reviews: 168, badge: "new", trending: false, featured: true,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
      desc: "A 16-inch performance workstation for video editors and engineers, with a near-silent dual-fan cooling system.",
      specs: { Display: "16\" 3.2K Mini-LED", Processor: "14-core, 4.6GHz", Memory: "64GB Unified", Storage: "2TB SSD", Battery: "Up to 14 hrs", Weight: "1.9 kg" },
    },
    {
      id: "lap-03", name: "NEXORA Slate 13 Air", category: "laptops",
      price: 1149, oldPrice: null, rating: 4.6, reviews: 302, badge: null, trending: false, featured: false,
      image: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=800&q=80",
      desc: "The everyday laptop, refined — light enough to forget you're carrying it, fast enough to never notice a delay.",
      specs: { Display: "13.3\" 2K IPS", Processor: "8-core, 3.8GHz", Memory: "16GB Unified", Storage: "512GB SSD", Battery: "Up to 17 hrs", Weight: "1.02 kg" },
    },
    {
      id: "lap-04", name: "NEXORA Titan 17 Studio", category: "laptops",
      price: 2899, oldPrice: 3199, rating: 4.7, reviews: 96, badge: "sale", trending: false, featured: false,
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80",
      desc: "A desktop-replacement studio machine with a color-accurate panel calibrated at the factory for professional work.",
      specs: { Display: "17\" 4K IPS", Processor: "16-core, 4.8GHz", Memory: "64GB Unified", Storage: "4TB SSD", Battery: "Up to 11 hrs", Weight: "2.4 kg" },
    },

    // ---------------- SMARTPHONES ----------------
    {
      id: "phn-01", name: "NEXORA Pulse X1", category: "smartphones",
      price: 1099, oldPrice: null, rating: 4.8, reviews: 512, badge: "new", trending: true, featured: true,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
      desc: "Our flagship handset — a titanium frame, a triple-lens system, and the fastest chip we've ever shipped.",
      specs: { Display: "6.7\" LTPO OLED", Chipset: "3nm Octa-core", Memory: "12GB RAM", Storage: "512GB", Camera: "50MP Triple Lens", Battery: "4,600 mAh" },
    },
    {
      id: "phn-02", name: "NEXORA Pulse X1 Mini", category: "smartphones",
      price: 849, oldPrice: null, rating: 4.6, reviews: 289, badge: null, trending: true, featured: false,
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=800&q=80",
      desc: "All the flagship's intelligence in a compact frame that fits comfortably in one hand.",
      specs: { Display: "6.1\" LTPO OLED", Chipset: "3nm Octa-core", Memory: "8GB RAM", Storage: "256GB", Camera: "48MP Dual Lens", Battery: "3,900 mAh" },
    },
    {
      id: "phn-03", name: "NEXORA Halo 9", category: "smartphones",
      price: 649, oldPrice: 749, rating: 4.5, reviews: 421, badge: "sale", trending: false, featured: true,
      image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
      desc: "Premium fundamentals at a friendlier price — a two-day battery, a bright display, and a clean interface.",
      specs: { Display: "6.4\" AMOLED", Chipset: "5nm Octa-core", Memory: "8GB RAM", Storage: "256GB", Camera: "50MP Dual Lens", Battery: "5,000 mAh" },
    },
    {
      id: "phn-04", name: "NEXORA Halo 9 Fold", category: "smartphones",
      price: 1799, oldPrice: null, rating: 4.7, reviews: 87, badge: "new", trending: false, featured: false,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
      desc: "A book-style foldable with a crease-resistant hinge rated for 400,000 folds — a phone that becomes a tablet.",
      specs: { Display: "7.6\" Foldable OLED", Chipset: "3nm Octa-core", Memory: "16GB RAM", Storage: "512GB", Camera: "50MP Triple Lens", Battery: "4,800 mAh" },
    },

    // ---------------- SMART WATCHES ----------------
    {
      id: "wat-01", name: "NEXORA Orbit Watch SE", category: "watches",
      price: 329, oldPrice: null, rating: 4.6, reviews: 341, badge: null, trending: true, featured: true,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      desc: "A sapphire-crystal smartwatch with continuous health tracking and a battery that lasts a full week.",
      specs: { Case: "44mm Titanium", Display: "Always-On AMOLED", Sensors: "ECG · SpO2 · GPS", Battery: "7-day", "Water Rating": "5ATM", Compatibility: "iOS & Android" },
    },
    {
      id: "wat-02", name: "NEXORA Orbit Watch Pro", category: "watches",
      price: 479, oldPrice: 549, rating: 4.8, reviews: 198, badge: "sale", trending: false, featured: false,
      image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
      desc: "Adds a titanium bezel, dual-frequency GPS, and offline maps for serious athletes and travelers.",
      specs: { Case: "47mm Titanium", Display: "Always-On AMOLED", Sensors: "ECG · SpO2 · Dual GPS", Battery: "10-day", "Water Rating": "10ATM", Compatibility: "iOS & Android" },
    },
    {
      id: "wat-03", name: "NEXORA Loop Band", category: "watches",
      price: 199, oldPrice: null, rating: 4.4, reviews: 256, badge: "new", trending: false, featured: false,
      image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=800&q=80",
      desc: "A minimalist fitness band with a two-week battery and a display so light you'll forget it's there.",
      specs: { Case: "38mm Aluminum", Display: "AMOLED", Sensors: "Heart Rate · SpO2", Battery: "14-day", "Water Rating": "5ATM", Compatibility: "iOS & Android" },
    },
    {
      id: "wat-04", name: "NEXORA Orbit Watch Kids", category: "watches",
      price: 149, oldPrice: null, rating: 4.3, reviews: 74, badge: null, trending: false, featured: false,
      image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
      desc: "A durable, parent-connected smartwatch built for active kids, with location sharing and school-mode focus.",
      specs: { Case: "40mm Polymer", Display: "Color LCD", Sensors: "GPS · Step Count", Battery: "3-day", "Water Rating": "3ATM", Compatibility: "Companion App" },
    },

    // ---------------- HEADPHONES ----------------
    {
      id: "aud-01", name: "NEXORA Aura ANC Headphones", category: "audio",
      price: 379, oldPrice: 429, rating: 4.9, reviews: 467, badge: "sale", trending: true, featured: true,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      desc: "Studio-tuned over-ears with adaptive noise cancellation that adjusts in real time to your surroundings.",
      specs: { Driver: "40mm Beryllium", ANC: "Adaptive, 3-mode", Battery: "38 hrs (ANC on)", Connectivity: "Bluetooth 5.4", Codec: "LDAC · aptX", Weight: "260g" },
    },
    {
      id: "aud-02", name: "NEXORA Aura Buds Pro", category: "audio",
      price: 229, oldPrice: null, rating: 4.7, reviews: 388, badge: "new", trending: true, featured: true,
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
      desc: "True wireless earbuds with a titanium driver and a case that wireless-charges in under an hour.",
      specs: { Driver: "11mm Titanium", ANC: "Hybrid, 2-mode", Battery: "9 hrs + 27 hrs case", Connectivity: "Bluetooth 5.4", Codec: "LDAC", Weight: "5.4g each" },
    },
    {
      id: "aud-03", name: "NEXORA Open Air Buds", category: "audio",
      price: 179, oldPrice: null, rating: 4.4, reviews: 143, badge: null, trending: false, featured: false,
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
      desc: "Ear-hook buds that stay open to your surroundings — ideal for runs, commutes, and long office days.",
      specs: { Driver: "16.2mm Dynamic", ANC: "None (Open design)", Battery: "8 hrs + 24 hrs case", Connectivity: "Bluetooth 5.3", Codec: "AAC · SBC", Weight: "8.5g each" },
    },
    {
      id: "aud-04", name: "NEXORA Studio Wired Monitors", category: "audio",
      price: 259, oldPrice: 299, rating: 4.8, reviews: 91, badge: "sale", trending: false, featured: false,
      image: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=800&q=80",
      desc: "Reference-grade closed-back monitors for mixing engineers who need an honest, uncolored sound.",
      specs: { Driver: "45mm Beryllium", ANC: "N/A (Wired)", Frequency: "5Hz–40kHz", Connectivity: "3.5mm / 6.35mm", Cable: "Detachable, 3m", Weight: "312g" },
    },

    // ---------------- SPEAKERS ----------------
    {
      id: "spk-01", name: "NEXORA Orb Portable Speaker", category: "speakers",
      price: 149, oldPrice: null, rating: 4.5, reviews: 210, badge: "new", trending: true, featured: false,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
      desc: "A 360° speaker in a machined aluminum shell, waterproof enough to survive a day at the beach.",
      specs: { Output: "30W RMS", Battery: "20 hrs", Connectivity: "Bluetooth 5.3", "Water Rating": "IP67", Pairing: "Stereo pair capable", Weight: "680g" },
    },
    {
      id: "spk-02", name: "NEXORA Column Home Speaker", category: "speakers",
      price: 399, oldPrice: 449, rating: 4.7, reviews: 128, badge: "sale", trending: false, featured: true,
      image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
      desc: "A room-filling home speaker with adaptive room correction and a woven fabric finish.",
      specs: { Output: "80W RMS", Battery: "Mains powered", Connectivity: "Wi-Fi · Bluetooth 5.3", "Water Rating": "N/A", Pairing: "Multi-room", Weight: "3.1kg" },
    },
    {
      id: "spk-03", name: "NEXORA Mini Cube", category: "speakers",
      price: 79, oldPrice: null, rating: 4.3, reviews: 315, badge: null, trending: false, featured: false,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
      desc: "A pocket-sized speaker with surprising bass, built for desks, tents, and everywhere in between.",
      specs: { Output: "10W RMS", Battery: "12 hrs", Connectivity: "Bluetooth 5.2", "Water Rating": "IP54", Pairing: "Stereo pair capable", Weight: "210g" },
    },
    {
      id: "spk-04", name: "NEXORA SoundBar Cinema", category: "speakers",
      price: 549, oldPrice: null, rating: 4.6, reviews: 66, badge: "new", trending: false, featured: false,
      image: "https://images.unsplash.com/photo-1558537348-c0f8e733989d?auto=format&fit=crop&w=800&q=80",
      desc: "A Dolby Atmos soundbar with a wireless subwoofer, tuned for cinema-scale sound in living rooms.",
      specs: { Output: "320W System", Battery: "Mains powered", Connectivity: "HDMI eARC · Wi-Fi", "Water Rating": "N/A", Pairing: "Wireless subwoofer", Weight: "5.4kg" },
    },

    // ---------------- GAMING ACCESSORIES ----------------
    {
      id: "gam-01", name: "NEXORA Vector Wireless Mouse", category: "gaming",
      price: 99, oldPrice: null, rating: 4.7, reviews: 402, badge: "new", trending: true, featured: false,
      image: "https://images.unsplash.com/photo-1592840062661-a5a7f78e2056?auto=format&fit=crop&w=800&q=80",
      desc: "A 52g competitive mouse with a 42,000 DPI optical sensor and a 1ms wireless response time.",
      specs: { Sensor: "42,000 DPI Optical", Weight: "52g", Battery: "70 hrs", Connectivity: "2.4GHz · Bluetooth", Switches: "Optical, 80M clicks", Feet: "PTFE" },
    },
    {
      id: "gam-02", name: "NEXORA Cascade Mechanical Keyboard", category: "gaming",
      price: 189, oldPrice: 219, rating: 4.8, reviews: 233, badge: "sale", trending: true, featured: true,
      image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80",
      desc: "A hot-swappable 75% mechanical keyboard with gasket-mounted plate for a deep, cushioned sound.",
      specs: { Layout: "75%, Hot-swap", Switches: "Linear, factory-lubed", Connectivity: "Wired · 2.4GHz · BT", Battery: "200 hrs (BT)", Keycaps: "PBT Double-shot", Backlight: "Per-key RGB" },
    },
    {
      id: "gam-03", name: "NEXORA Field Gaming Headset", category: "gaming",
      price: 159, oldPrice: null, rating: 4.6, reviews: 178, badge: null, trending: false, featured: false,
      image: "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=800&q=80",
      desc: "A gaming headset with spatial audio and a broadcast-quality detachable microphone.",
      specs: { Driver: "50mm Neodymium", Audio: "Spatial, 7.1 Virtual", Connectivity: "2.4GHz Wireless", Battery: "30 hrs", Microphone: "Detachable, cardioid", Weight: "298g" },
    },
    {
      id: "gam-04", name: "NEXORA Glide Mousepad XL", category: "gaming",
      price: 39, oldPrice: null, rating: 4.5, reviews: 512, badge: null, trending: false, featured: false,
      image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
      desc: "An extended, stitched-edge desk mat engineered for consistent glide across the full surface.",
      specs: { Size: "900 × 400mm", Thickness: "4mm", Base: "Natural rubber", Surface: "Micro-textured weave", Edges: "Stitched", Care: "Machine washable" },
    },

    // ---------------- MONITORS ----------------
    {
      id: "mon-01", name: "NEXORA Vantage 27 QHD", category: "monitors",
      price: 449, oldPrice: null, rating: 4.7, reviews: 156, badge: "new", trending: false, featured: true,
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
      desc: "A 27-inch QHD monitor with a 165Hz refresh rate, equally at home in a game or a spreadsheet.",
      specs: { Size: "27\"", Resolution: "2560 × 1440", "Refresh Rate": "165Hz", Panel: "Fast IPS", "Response Time": "1ms GtG", Ports: "HDMI 2.1 · DP 1.4 · USB-C" },
    },
    {
      id: "mon-02", name: "NEXORA Vantage 32 4K Studio", category: "monitors",
      price: 899, oldPrice: 999, rating: 4.9, reviews: 88, badge: "sale", trending: false, featured: false,
      image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
      desc: "A factory-calibrated 4K studio display covering 99% of the DCI-P3 color gamut for professional work.",
      specs: { Size: "32\"", Resolution: "3840 × 2160", "Refresh Rate": "60Hz", Panel: "IPS, HDR600", "Color Gamut": "99% DCI-P3", Ports: "USB-C 90W · DP 1.4 · HDMI" },
    },
    {
      id: "mon-03", name: "NEXORA Curve 34 Ultrawide", category: "monitors",
      price: 749, oldPrice: null, rating: 4.6, reviews: 104, badge: null, trending: true, featured: false,
      image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=800&q=80",
      desc: "A curved ultrawide that replaces a two-monitor setup with a single, seamless field of view.",
      specs: { Size: "34\"", Resolution: "3440 × 1440", "Refresh Rate": "144Hz", Panel: "Curved VA, 1800R", "Response Time": "1ms GtG", Ports: "HDMI 2.1 · DP 1.4 · USB-C" },
    },
    {
      id: "mon-04", name: "NEXORA Portable 15 Touch", category: "monitors",
      price: 289, oldPrice: null, rating: 4.4, reviews: 61, badge: "new", trending: false, featured: false,
      image: "https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=800&q=80",
      desc: "A slim touchscreen companion display that powers on with a single USB-C cable — built for travel.",
      specs: { Size: "15.6\"", Resolution: "1920 × 1080", "Refresh Rate": "60Hz", Panel: "IPS Touch", Power: "USB-C, single cable", Weight: "780g" },
    },

    // ---------------- CAMERAS ----------------
    {
      id: "cam-01", name: "NEXORA Frame Mirrorless X", category: "cameras",
      price: 1899, oldPrice: null, rating: 4.9, reviews: 74, badge: "new", trending: false, featured: true,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
      desc: "A full-frame mirrorless body with in-body stabilization, built for photographers who shoot in any light.",
      specs: { Sensor: "33MP Full-Frame", ISO: "100–51,200", Stabilization: "5-axis IBIS", Video: "6K/30fps RAW", Autofocus: "759-point Hybrid", Mount: "NEXORA-E" },
    },
    {
      id: "cam-02", name: "NEXORA Frame Compact G", category: "cameras",
      price: 899, oldPrice: 999, rating: 4.6, reviews: 132, badge: "sale", trending: false, featured: false,
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80",
      desc: "A pocketable compact camera with a bright fixed lens, for photographers who travel light.",
      specs: { Sensor: "20MP APS-C", ISO: "100–25,600", Stabilization: "Digital + Lens", Video: "4K/30fps", Autofocus: "425-point Hybrid", Lens: "23mm f/2.0 Fixed" },
    },
    {
      id: "cam-03", name: "NEXORA Orbit Action Cam", category: "cameras",
      price: 349, oldPrice: null, rating: 4.5, reviews: 219, badge: null, trending: true, featured: false,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
      desc: "A rugged, waterproof action camera with horizon-lock stabilization for handheld, high-motion footage.",
      specs: { Sensor: "1/1.9\" CMOS", Video: "5.3K/60fps", Stabilization: "HyperSteady 3.0", "Water Rating": "Waterproof to 10m", Battery: "1720 mAh removable", Weight: "154g" },
    },
    {
      id: "cam-04", name: "NEXORA Studio Webcam 4K", category: "cameras",
      price: 199, oldPrice: null, rating: 4.7, reviews: 168, badge: "new", trending: false, featured: false,
      image: "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?auto=format&fit=crop&w=800&q=80",
      desc: "A 4K webcam with a large sensor and auto-framing, built for people who present and stream for a living.",
      specs: { Sensor: "1/2\" CMOS", Video: "4K/30fps · 1080p/60fps", "Field of View": "90° adjustable", Focus: "Autofocus", Microphone: "Dual, noise-cancelling", Mount: "Universal clip + tripod" },
    },
  ];

  const CATEGORY_LABELS = {
    laptops: "Laptops",
    smartphones: "Smartphones",
    watches: "Smart Watches",
    audio: "Headphones",
    speakers: "Speakers",
    gaming: "Gaming Accessories",
    monitors: "Monitors",
    cameras: "Cameras",
  };

  window.NEXORA_PRODUCTS = PRODUCTS;

  /* ------------------------------------------------------------------ */
  /*  Broken Image Fallback                                               */
  /*  If a product photo URL ever fails to load (network issue, asset     */
  /*  removed, etc.), swap it for an inline SVG placeholder that matches  */
  /*  the card's exact size and the site's black/white theme, instead of  */
  /*  leaving a broken-image icon.                                        */
  /* ------------------------------------------------------------------ */
  function placeholderSVG(label) {
    const initial = (label || "N").trim().charAt(0).toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <rect width="800" height="800" fill="#1c1c1c"/>
      <circle cx="400" cy="360" r="86" fill="none" stroke="#3a3a3a" stroke-width="2"/>
      <text x="400" y="392" font-family="Space Grotesk, Arial, sans-serif" font-size="88" font-weight="600" fill="#6f6f6f" text-anchor="middle">${initial}</text>
      <text x="400" y="470" font-family="Inter, Arial, sans-serif" font-size="22" fill="#4a4a4a" text-anchor="middle">Image unavailable</text>
    </svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  window.NexoraImgFallback = function (imgEl) {
    imgEl.onerror = null;
    imgEl.src = placeholderSVG(imgEl.alt);
  };

  /* ------------------------------------------------------------------ */
  /*  Helpers                                                             */
  /* ------------------------------------------------------------------ */
  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function starString(rating) {
    const full = Math.round(rating);
    return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
  }

  function badgeHTML(product) {
    if (!product.badge) return "";
    const label = product.badge === "sale" ? "Sale" : "New";
    return `<span class="product-card__badge badge--${product.badge}">${label}</span>`;
  }

  function productCardHTML(product) {
    return `
      <article class="product-card reveal" data-id="${product.id}" data-category="${product.category}">
        <div class="product-card__media">
          ${badgeHTML(product)}
          <button type="button" class="product-card__quick" data-action="quickview" data-id="${product.id}" aria-label="Quick view ${product.name}">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="window.NexoraImgFallback(this)" />
        </div>
        <div class="product-card__body">
          <p class="product-card__cat">${CATEGORY_LABELS[product.category] || product.category}</p>
          <h3 class="product-card__name">${product.name}</h3>
          <div class="product-card__rating">
            <span class="stars" aria-hidden="true">${starString(product.rating)}</span>
            <span>${product.rating.toFixed(1)} (${product.reviews})</span>
          </div>
          <div class="product-card__footer">
            <div class="product-card__price">
              <strong>${formatPrice(product.price)}</strong>
              ${product.oldPrice ? `<del>${formatPrice(product.oldPrice)}</del>` : ""}
            </div>
            <button type="button" class="add-to-cart" data-action="add" data-id="${product.id}" aria-label="Add ${product.name} to cart">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function findProduct(id) {
    return PRODUCTS.find((p) => p.id === id);
  }

  /* ------------------------------------------------------------------ */
  /*  Shared card-click delegation (add to cart / quick view)            */
  /* ------------------------------------------------------------------ */
  function initCardDelegation(root) {
    root.addEventListener("click", (e) => {
      const addBtn = e.target.closest("[data-action='add']");
      const quickBtn = e.target.closest("[data-action='quickview']");
      const card = e.target.closest(".product-card");

      if (addBtn) {
        const product = findProduct(addBtn.dataset.id);
        if (product && window.NexoraCart) {
          window.NexoraCart.add(product, 1);
          addBtn.classList.add("is-added");
          const svg = addBtn.innerHTML;
          addBtn.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 12l5 5L20 6"/></svg>`;
          setTimeout(() => {
            addBtn.classList.remove("is-added");
            addBtn.innerHTML = svg;
          }, 1100);
        }
        return;
      }

      if (quickBtn) {
        openProductModal(quickBtn.dataset.id);
        return;
      }

      if (card && !e.target.closest("button")) {
        openProductModal(card.dataset.id);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Product Modal Content                                              */
  /* ------------------------------------------------------------------ */
  function openProductModal(id) {
    const product = findProduct(id);
    const body = $("#modalBody");
    if (!product || !body || !window.NexoraModal) return;

    const specsHTML = Object.entries(product.specs)
      .map(([label, value]) => `<div>${label}<strong>${value}</strong></div>`)
      .join("");

    body.innerHTML = `
      <div class="modal-media">
        <img src="${product.image}" alt="${product.name}" onerror="window.NexoraImgFallback(this)" />
      </div>
      <div class="modal-info">
        <p class="product-card__cat">${CATEGORY_LABELS[product.category] || product.category}</p>
        <h2 id="modalTitle">${product.name}</h2>
        <div class="product-card__rating">
          <span class="stars" aria-hidden="true">${starString(product.rating)}</span>
          <span>${product.rating.toFixed(1)} · ${product.reviews} reviews</span>
        </div>
        <p class="modal-info__desc">${product.desc}</p>
        <div class="modal-info__specs">${specsHTML}</div>
        <div class="modal-info__price">
          <strong>${formatPrice(product.price)}</strong>
          ${product.oldPrice ? `<del>${formatPrice(product.oldPrice)}</del>` : ""}
        </div>
        <div class="modal-info__actions">
          <button type="button" class="btn btn--primary" data-action="add" data-id="${product.id}">Add to Cart</button>
          <button type="button" class="btn btn--ghost" id="modalCartLink">View Cart</button>
        </div>
      </div>
    `;

    const addBtn = $("[data-action='add']", body);
    addBtn &&
      addBtn.addEventListener("click", () => {
        window.NexoraCart && window.NexoraCart.add(product, 1);
      });
    const viewCartBtn = $("#modalCartLink", body);
    viewCartBtn &&
      viewCartBtn.addEventListener("click", () => {
        window.NexoraModal.close();
        window.NexoraCart && window.NexoraCart.open();
      });

    window.NexoraModal.open();
  }

  /* ------------------------------------------------------------------ */
  /*  Homepage: Featured + Trending rails                                 */
  /* ------------------------------------------------------------------ */
  function mountFeatured() {
    const grid = $("#featuredGrid");
    if (!grid) return;
    const items = PRODUCTS.filter((p) => p.featured).slice(0, 8);
    grid.innerHTML = items.map(productCardHTML).join("");
$$(".reveal", grid).forEach((el) => el.classList.add("is-visible"));
initCardDelegation(grid);
  }

  function mountTrending() {
    const row = $("#trendingRow");
    if (!row) return;
    const items = PRODUCTS.filter((p) => p.trending).slice(0, 8);
    row.innerHTML = items.map(productCardHTML).join("");
$$(".reveal", row).forEach((el) => el.classList.add("is-visible"));
initCardDelegation(row);
  }

  /* ------------------------------------------------------------------ */
  /*  Products Page: full catalog, search, filters, sort                  */
  /* ------------------------------------------------------------------ */
  function mountCatalog() {
    const grid = $("#catalogGrid");
    if (!grid) return;

    const searchInput = $("#catalogSearch");
    const filterButtons = $$(".filter-chip");
    const sortSelect = $("#sortSelect");
    const resultsCount = $("#resultsCount");
    const emptyState = $("#catalogEmpty");

    let state = {
      category: getParam("category") || "all",
      query: getParam("search") || "",
      sort: "featured",
    };

    if (searchInput && state.query) searchInput.value = state.query;

    function applyFilters() {
      let results = PRODUCTS.filter((p) => {
        const matchesCategory = state.category === "all" || p.category === state.category;
        const matchesQuery =
          !state.query ||
          p.name.toLowerCase().includes(state.query.toLowerCase()) ||
          CATEGORY_LABELS[p.category].toLowerCase().includes(state.query.toLowerCase());
        return matchesCategory && matchesQuery;
      });

      switch (state.sort) {
        case "price-asc":
          results.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          results.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          results.sort((a, b) => b.rating - a.rating);
          break;
        default:
          results.sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1));
      }

      if (resultsCount) {
        resultsCount.textContent = `${results.length} product${results.length === 1 ? "" : "s"}`;
      }

      if (results.length === 0) {
        grid.innerHTML = "";
        emptyState && emptyState.removeAttribute("hidden");
      } else {
        emptyState && emptyState.setAttribute("hidden", "");
        grid.innerHTML = results.map(productCardHTML).join("");
        $$(".reveal", grid).forEach((el) => el.classList.add("is-visible"));
      }

      initCardDelegation(grid);
    }

    filterButtons.forEach((btn) => {
      if (btn.dataset.category === state.category) btn.classList.add("is-active");
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        state.category = btn.dataset.category;
        applyFilters();
      });
    });

    let debounce;
    searchInput &&
      searchInput.addEventListener("input", () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          state.query = searchInput.value.trim();
          applyFilters();
        }, 220);
      });

    sortSelect &&
      sortSelect.addEventListener("change", () => {
        state.sort = sortSelect.value;
        applyFilters();
      });

    applyFilters();
  }

  /* ------------------------------------------------------------------ */
  /*  Init                                                               */
  /* ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    mountFeatured();
    mountTrending();
    mountCatalog();
  });
})();