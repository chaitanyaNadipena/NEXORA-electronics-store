/* ==========================================================================
   NEXORA — Core App Script
   Handles: loader, navigation, mobile menu, search panel, cart system,
   accordion, scroll reveal, counters, back-to-top, ripple buttons,
   newsletter forms, toasts, product modal shell.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /*  Utilities                                                          */
  /* ------------------------------------------------------------------ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const formatPrice = (n) => `$${n.toLocaleString("en-US")}`;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ */
  /*  Loading Screen                                                     */
  /* ------------------------------------------------------------------ */
  function initLoader() {
    const loader = $("#loader");
    const fill = $("#loaderFill");
    if (!loader) return;

    let progress = 0;
    let hidden = false;
    const hide = () => {
      if (hidden) return;
      hidden = true;
      loader.classList.add("is-hidden");
      document.body.classList.remove("no-scroll");
    };
    const tick = () => {
      progress += Math.random() * 22 + 8;
      if (progress >= 100) {
        progress = 100;
        if (fill) fill.style.width = "100%";
        setTimeout(hide, 260);
        return;
      }
      if (fill) fill.style.width = `${progress}%`;
      setTimeout(tick, 140);
    };

    document.body.classList.add("no-scroll");
    // Run the loading animation on its own timer rather than waiting on
    // window 'load' — external images (e.g. slow or blocked network
    // requests) could otherwise delay 'load' indefinitely and leave the
    // opaque loader covering already-rendered page content.
    setTimeout(tick, 200);
    // Hard safety net: always release the loader even if something above fails.
    setTimeout(hide, 4000);
  }

  /* ------------------------------------------------------------------ */
  /*  Navbar: blur on scroll + hide/show                                 */
  /* ------------------------------------------------------------------ */
  function initNavScroll() {
    const nav = $("#siteNav");
    if (!nav) return;
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle("is-scrolled", y > 24);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------ */
  /*  Mobile Hamburger Menu                                              */
  /* ------------------------------------------------------------------ */
  function initMobileMenu() {
    const hamburger = $("#hamburger");
    const menu = $("#mobileMenu");
    const overlay = $("#overlay");
    if (!hamburger || !menu || !overlay) return;

    const close = () => {
      hamburger.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      if (!$("#cartPanel").classList.contains("is-open")) {
        overlay.classList.remove("is-visible");
        document.body.classList.remove("no-scroll");
      }
    };
    const open = () => {
      hamburger.classList.add("is-open");
      hamburger.setAttribute("aria-expanded", "true");
      menu.classList.add("is-open");
      overlay.classList.add("is-visible");
      document.body.classList.add("no-scroll");
    };

    hamburger.addEventListener("click", () => {
      hamburger.classList.contains("is-open") ? close() : open();
    });
    overlay.addEventListener("click", () => {
      close();
      closeCart();
    });
    $$(".mobile-menu__link", menu).forEach((link) => link.addEventListener("click", close));
    window.NexoraCloseMobileMenu = close;
  }

  /* ------------------------------------------------------------------ */
  /*  Search Panel                                                       */
  /* ------------------------------------------------------------------ */
  function initSearchPanel() {
    const toggle = $("#searchToggle");
    const panel = $("#searchPanel");
    const closeBtn = $("#searchClose");
    const input = $("#navSearchInput");
    if (!toggle || !panel) return;

    const open = () => {
      panel.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      setTimeout(() => input && input.focus(), 380);
    };
    const close = () => {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      panel.classList.contains("is-open") ? close() : open();
    });
    closeBtn && closeBtn.addEventListener("click", close);

    input &&
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && input.value.trim()) {
          window.location.href = `products.html?search=${encodeURIComponent(input.value.trim())}`;
        }
        if (e.key === "Escape") close();
      });
  }

  /* ------------------------------------------------------------------ */
  /*  Cart System (localStorage-backed, shared via window.NexoraCart)    */
  /* ------------------------------------------------------------------ */
  const CART_KEY = "nexora_cart";

  function readCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function writeCart(items) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (e) {
      /* storage unavailable — fail silently */
    }
    renderCart();
  }

  function addToCart(product, qty = 1) {
    const items = readCart();
    const existing = items.find((i) => i.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty,
      });
    }
    writeCart(items);
    showToast(`${product.name} added to cart`);
    pulseCartIcon();
  }

  function updateQty(id, delta) {
    const items = readCart();
    const item = items.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    const filtered = item.qty <= 0 ? items.filter((i) => i.id !== id) : items;
    writeCart(filtered);
  }

  function removeFromCart(id) {
    writeCart(readCart().filter((i) => i.id !== id));
  }

  function cartTotal(items) {
    return items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function pulseCartIcon() {
    const btn = $("#cartToggle");
    if (!btn) return;
    btn.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.18)" },
        { transform: "scale(1)" },
      ],
      { duration: 340, easing: "cubic-bezier(.16,1,.3,1)" }
    );
  }

  function renderCart() {
    const items = readCart();
    const countEl = $("#cartCount");
    const listEl = $("#cartItems");
    const totalEl = $("#cartTotal");
    const totalQty = items.reduce((s, i) => s + i.qty, 0);

    if (countEl) {
      countEl.textContent = totalQty;
      countEl.classList.toggle("is-visible", totalQty > 0);
    }
    if (totalEl) totalEl.textContent = formatPrice(cartTotal(items));

    if (!listEl) return;

    if (items.length === 0) {
      listEl.innerHTML = `<p class="cart-empty">Your cart is empty. Explore the <a href="products.html">catalog</a> to add something premium.</p>`;
      return;
    }

    listEl.innerHTML = items
      .map(
        (i) => `
      <div class="cart-item" data-id="${i.id}">
        <img src="${i.image}" alt="${i.name}" loading="lazy" />
        <div>
          <p class="cart-item__name">${i.name}</p>
          <p class="cart-item__price">${formatPrice(i.price)}</p>
          <div class="cart-item__qty">
            <button type="button" data-action="dec" aria-label="Decrease quantity">−</button>
            <span>${i.qty}</span>
            <button type="button" data-action="inc" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button type="button" class="cart-item__remove" data-action="remove">Remove</button>
      </div>
    `
      )
      .join("");
  }

  function initCartInteractions() {
    const listEl = $("#cartItems");
    if (!listEl) return;
    listEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const row = btn.closest(".cart-item");
      const id = row && row.dataset.id;
      if (!id) return;
      if (btn.dataset.action === "inc") updateQty(id, 1);
      if (btn.dataset.action === "dec") updateQty(id, -1);
      if (btn.dataset.action === "remove") removeFromCart(id);
    });
  }

  function openCart() {
    $("#cartPanel").classList.add("is-open");
    $("#overlay").classList.add("is-visible");
    $("#cartToggle").setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  }
  function closeCart() {
    const panel = $("#cartPanel");
    if (!panel) return;
    panel.classList.remove("is-open");
    if (!$("#mobileMenu").classList.contains("is-open")) {
      $("#overlay").classList.remove("is-visible");
      document.body.classList.remove("no-scroll");
    }
    $("#cartToggle") && $("#cartToggle").setAttribute("aria-expanded", "false");
  }

  function initCartToggle() {
    const toggle = $("#cartToggle");
    const closeBtn = $("#cartClose");
    const overlay = $("#overlay");
    const checkoutBtn = $("#checkoutBtn");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      $("#cartPanel").classList.contains("is-open") ? closeCart() : openCart();
    });
    closeBtn && closeBtn.addEventListener("click", closeCart);
    overlay &&
      overlay.addEventListener("click", () => {
        closeCart();
        window.NexoraCloseMobileMenu && window.NexoraCloseMobileMenu();
      });
    checkoutBtn &&
      checkoutBtn.addEventListener("click", () => {
        const items = readCart();
        if (items.length === 0) {
          showToast("Your cart is empty");
          return;
        }
        showToast("This is a demo checkout — no payment was taken");
      });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeCart();
    });
  }

  // Expose a minimal cart API for products.js
  window.NexoraCart = {
    add: addToCart,
    render: renderCart,
    read: readCart,
    open: openCart,
  };

  /* ------------------------------------------------------------------ */
  /*  Toast Notifications                                                */
  /* ------------------------------------------------------------------ */
  let toastTimer = null;
  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }
  window.NexoraToast = showToast;

  /* ------------------------------------------------------------------ */
  /*  Accordion (FAQ)                                                    */
  /* ------------------------------------------------------------------ */
  function initAccordion() {
    const items = $$(".accordion__item");
    items.forEach((item) => {
      const trigger = $(".accordion__trigger", item);
      const panel = $(".accordion__panel", item);
      if (!trigger || !panel) return;

      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        items.forEach((other) => {
          other.classList.remove("is-open");
          $(".accordion__trigger", other).setAttribute("aria-expanded", "false");
          $(".accordion__panel", other).style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Scroll Reveal (IntersectionObserver)                               */
  /* ------------------------------------------------------------------ */
  function initScrollReveal() {
    const targets = $$(".reveal");
    if (!targets.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("is-visible"), (i % 4) * 90);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
    );

    targets.forEach((t) => observer.observe(t));
  }

  /* ------------------------------------------------------------------ */
  /*  Counter Animation (Stats)                                          */
  /* ------------------------------------------------------------------ */
  function initCounters() {
    const counters = $$(".stat__num");
    if (!counters.length) return;

    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      if (prefersReducedMotion) {
        el.textContent = target;
        return;
      }
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => observer.observe(c));
  }

  /* ------------------------------------------------------------------ */
  /*  Back To Top                                                        */
  /* ------------------------------------------------------------------ */
  function initBackToTop() {
    const btn = $("#backToTop");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      () => btn.classList.toggle("is-visible", window.scrollY > 700),
      { passive: true }
    );
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Scroll Cue (hero)                                                   */
  /* ------------------------------------------------------------------ */
  function initScrollCue() {
    const cue = $("#scrollCue");
    if (!cue) return;
    cue.addEventListener("click", () => {
      const next = document.querySelector(".marquee") || document.querySelector("#featured");
      next && next.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Ripple Buttons                                                     */
  /* ------------------------------------------------------------------ */
  function initRipple() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn");
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 620);
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Newsletter Forms                                                    */
  /* ------------------------------------------------------------------ */
  function initNewsletterForms() {
    const mainForm = $("#newsletterForm");
    const status = $("#newsletterStatus");
    if (mainForm) {
      mainForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = $("#newsletterEmail");
        if (!input || !input.checkValidity()) {
          if (status) status.textContent = "Please enter a valid email address.";
          return;
        }
        if (status) status.textContent = `You're subscribed. Welcome to NEXORA, ${input.value.split("@")[0]}.`;
        mainForm.reset();
      });
    }

    const footerForm = $("#footerNewsletterForm");
    if (footerForm) {
      footerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = $("#footerEmail");
        if (!input || !input.checkValidity()) {
          showToast("Please enter a valid email address");
          return;
        }
        showToast("Subscribed — welcome to NEXORA");
        footerForm.reset();
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Product Modal Shell (open/close — content injected by products.js) */
  /* ------------------------------------------------------------------ */
  function initModalShell() {
    const overlay = $("#modalOverlay");
    const closeBtn = $("#modalClose");
    if (!overlay) return;

    const close = () => {
      overlay.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    };
    closeBtn && closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    window.NexoraModal = {
      open: () => {
        overlay.classList.add("is-open");
        document.body.classList.add("no-scroll");
      },
      close,
    };
  }

  /* ------------------------------------------------------------------ */
  /*  Lazy Loading Fallback (native loading="lazy" is primary strategy)  */
  /* ------------------------------------------------------------------ */
  function initLazyFallback() {
    if ("loading" in HTMLImageElement.prototype) return;
    // Minimal IO-based fallback for older browsers
    const imgs = $$("img[loading='lazy']");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    imgs.forEach((img) => observer.observe(img));
  }

  /* ------------------------------------------------------------------ */
  /*  Init                                                               */
  /* ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initNavScroll();
    initMobileMenu();
    initSearchPanel();
    initCartToggle();
    initCartInteractions();
    renderCart();
    initAccordion();
    initScrollReveal();
    initCounters();
    initBackToTop();
    initScrollCue();
    initRipple();
    initNewsletterForms();
    initModalShell();
    initLazyFallback();
  });
})();