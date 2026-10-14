/* Aqua Vista Residences – interactions */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Navbar: scroll state, mobile menu, scroll spy ---------- */
  const navbar = $("#navbar");
  const navLinks = $("#navLinks");
  const hamburger = $("#hamburger");
  const actionBar = $("#actionBar");
  const toTop = $("#toTop");
  const hero = $("#home");

  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 40);
    actionBar.classList.toggle("show", y > hero.offsetHeight * 0.6);
    toTop.classList.toggle("show", y > 700);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  hamburger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  $$("a", navLinks).forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.classList.remove("open");
    })
  );

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        $$("a", navLinks).forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  $$("section[id]").forEach((s) => spy.observe(s));

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Reveal on scroll (staggered) ---------- */
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const siblings = $$(".reveal", e.target.parentElement);
        e.target.style.transitionDelay = Math.min(siblings.indexOf(e.target), 8) * 70 + "ms";
        e.target.classList.add("in");
        revealObs.unobserve(e.target);
      });
    },
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => revealObs.observe(el));

  /* ---------- Animated counters ---------- */
  const countObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const decimals = (el.dataset.count.split(".")[1] || "").length;
        const start = performance.now();
        const dur = 1600;
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(decimals);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countObs.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  $$("[data-count]").forEach((el) => countObs.observe(el));

  /* ---------- Liquid light following cursor on glass cards ---------- */
  $$(".h-card, .amenity, .pt-row, .stat, .b-stat, .loc-group, .hero-form").forEach((card) => {
    card.classList.add("liquid");
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  /* ---------- Water ripple on click ---------- */
  document.addEventListener("click", (e) => {
    const el = e.target.closest(".ripple");
    if (!el) return;
    const r = el.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const wave = document.createElement("span");
    wave.className = "ripple-wave";
    wave.style.width = wave.style.height = size + "px";
    wave.style.left = e.clientX - r.left - size / 2 + "px";
    wave.style.top = e.clientY - r.top - size / 2 + "px";
    el.appendChild(wave);
    wave.addEventListener("animationend", () => wave.remove());
  });

  /* ---------- Floor plans (drawn as SVG) ---------- */
  // Each room: [x, y, w, h, label, dimension, isBalcony]
  const plans = [
    {
      title: "2 BHK Residence",
      desc: "A compact, efficient home with a large living-dining space that opens onto a lake-facing balcony.",
      view: [420, 300],
      specs: [["Super Built-up", "1,150 sq.ft"], ["Carpet Area", "845 sq.ft"], ["Bedrooms", "2"], ["Bathrooms", "2"]],
      rooms: [
        [0, 0, 240, 170, "Living / Dining", "20'0\" × 14'0\""],
        [240, 0, 180, 100, "Kitchen", "10'0\" × 9'0\""],
        [240, 100, 70, 70, "Utility", "5'6\" × 5'0\""],
        [310, 100, 110, 70, "Toilet", "8'0\" × 5'0\""],
        [0, 170, 190, 130, "Master Bed", "13'0\" × 12'0\""],
        [190, 170, 80, 70, "M. Toilet", "7'6\" × 5'0\""],
        [190, 240, 80, 60, "Balcony", "7'6\" × 5'0\"", true],
        [270, 170, 150, 130, "Bedroom 2", "11'0\" × 11'0\""],
      ],
    },
    {
      title: "3 BHK Residence",
      desc: "A family home with a central living room between the bedrooms, plus two balconies facing the lake.",
      view: [500, 320],
      specs: [["Super Built-up", "1,650 sq.ft"], ["Carpet Area", "1,210 sq.ft"], ["Bedrooms", "3"], ["Bathrooms", "3"]],
      rooms: [
        [0, 0, 150, 120, "Bedroom 3", "11'0\" × 10'6\""],
        [150, 0, 70, 60, "Toilet", "7'6\" × 4'6\""],
        [150, 60, 70, 60, "Utility", "6'0\" × 4'6\""],
        [220, 0, 130, 120, "Kitchen", "10'0\" × 10'0\""],
        [350, 0, 150, 120, "Dining", "11'0\" × 10'6\""],
        [0, 120, 170, 140, "Master Bed", "14'0\" × 12'0\""],
        [0, 260, 100, 60, "M. Toilet", "8'0\" × 5'0\""],
        [100, 260, 70, 60, "Balcony", "6'0\" × 5'0\"", true],
        [170, 120, 180, 200, "Living", "14'0\" × 17'0\""],
        [350, 120, 150, 140, "Bedroom 2", "12'0\" × 11'6\""],
        [350, 260, 80, 60, "Toilet", "7'0\" × 5'0\""],
        [430, 260, 70, 60, "Balcony", "6'0\" × 5'0\"", true],
      ],
    },
    {
      title: "4 BHK Residence",
      desc: "A spacious home with a private lift lobby, a walk-in dressing room and a wrap-around sundeck.",
      view: [580, 340],
      specs: [["Super Built-up", "2,450 sq.ft"], ["Carpet Area", "1,820 sq.ft"], ["Bedrooms", "4"], ["Bathrooms", "4 + Powder"]],
      rooms: [
        [0, 0, 150, 130, "Bedroom 4", "12'0\" × 11'0\""],
        [150, 0, 70, 65, "Toilet", "7'6\" × 5'0\""],
        [150, 65, 70, 65, "Powder", "5'0\" × 5'0\""],
        [220, 0, 140, 130, "Kitchen", "12'0\" × 11'0\""],
        [360, 0, 70, 130, "Utility", "6'0\" × 11'0\""],
        [430, 0, 150, 130, "Bedroom 3", "12'0\" × 11'0\""],
        [0, 130, 170, 140, "Master Bed", "15'0\" × 13'0\""],
        [0, 270, 100, 70, "M. Toilet", "9'0\" × 6'0\""],
        [100, 270, 70, 70, "Dress", "6'0\" × 6'0\""],
        [170, 130, 240, 150, "Living / Dining", "22'0\" × 13'0\""],
        [170, 280, 240, 60, "Sundeck", "22'0\" × 5'6\"", true],
        [410, 130, 170, 140, "Bedroom 2", "14'0\" × 12'0\""],
        [410, 270, 90, 70, "Toilet", "8'0\" × 6'0\""],
        [500, 270, 80, 70, "Toilet", "7'0\" × 6'0\""],
      ],
    },
  ];

  const planSvg = $("#planSvg");
  const tabs = $$(".tab");
  const indicator = $(".tab-indicator");

  function renderPlan(i) {
    const p = plans[i];
    const [w, h] = p.view;
    const rooms = p.rooms
      .map(([x, y, rw, rh, label, dim, bal]) => {
        const cx = x + rw / 2;
        const cy = y + rh / 2;
        return `<g><rect x="${x}" y="${y}" width="${rw}" height="${rh}" class="${bal ? "balcony" : ""}"/>` +
          `<text x="${cx}" y="${cy - (rh > 60 ? 4 : 0)}">${label}</text>` +
          (rh > 60 ? `<text class="dim" x="${cx}" y="${cy + 12}">${dim}</text>` : "") +
          `</g>`;
      })
      .join("");
    planSvg.innerHTML =
      `<svg class="draw" viewBox="-6 -6 ${w + 12} ${h + 12}" role="img" aria-label="${p.title} floor plan">${rooms}` +
      `<rect x="0" y="0" width="${w}" height="${h}" fill="none" style="fill:none;stroke-width:5"/></svg>`;
    $("#planTitle").textContent = p.title;
    $("#planDesc").textContent = p.desc;
    $("#planSpecs").innerHTML = p.specs.map(([k, v]) => `<div><small>${k}</small><strong>${v}</strong></div>`).join("");
  }

  function moveIndicator(tab) {
    indicator.style.left = tab.offsetLeft + "px";
    indicator.style.width = tab.offsetWidth + "px";
  }

  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      moveIndicator(tab);
      renderPlan(+tab.dataset.plan);
    })
  );
  renderPlan(0);
  moveIndicator(tabs[0]);
  window.addEventListener("resize", () => moveIndicator($(".tab.active")));

  /* ---------- Gallery lightbox ---------- */
  const items = $$(".g-item");
  const lb = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbCap = $("#lbCap");
  let current = 0;

  const showImg = (i) => {
    current = (i + items.length) % items.length;
    const img = $("img", items[current]);
    lbImg.src = img.src.replace(/w=\d+/, "w=1600");
    lbImg.alt = img.alt;
    lbCap.textContent = $("figcaption", items[current]).textContent;
  };
  const openLb = (i) => { showImg(i); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; };
  const closeLb = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };

  items.forEach((it, i) => it.addEventListener("click", () => openLb(i)));
  $(".lb-close").addEventListener("click", closeLb);
  $(".lb-prev").addEventListener("click", () => showImg(current - 1));
  $(".lb-next").addEventListener("click", () => showImg(current + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });

  /* ---------- Enquiry modal ---------- */
  const modal = $("#modal");
  const openModal = () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => $("input", modal).focus(), 300);
  };
  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };
  $$("[data-open-modal]").forEach((b) => b.addEventListener("click", openModal));
  $$("[data-close-modal]").forEach((b) => b.addEventListener("click", closeModal));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeModal(); closeLb(); }
    if (lb.classList.contains("open")) {
      if (e.key === "ArrowLeft") showImg(current - 1);
      if (e.key === "ArrowRight") showImg(current + 1);
    }
  });

  /* ---------- Footer: disclaimer read more + copy RERA ---------- */
  const discBox = $("#disclaimerBox");
  const readMore = $("#readMore");
  readMore.addEventListener("click", () => {
    const open = discBox.classList.toggle("expanded");
    readMore.setAttribute("aria-expanded", open);
    $("span", readMore).textContent = open ? "Read less" : "Read more";
  });

  $$(".rera-copy").forEach((btn) =>
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        const icon = $("i", btn);
        icon.className = "fa-solid fa-check";
        btn.classList.add("copied");
        setTimeout(() => { icon.className = "fa-regular fa-copy"; btn.classList.remove("copied"); }, 1600);
      } catch (_) { /* clipboard unavailable (e.g. file://) */ }
    })
  );

})();
