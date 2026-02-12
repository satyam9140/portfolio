/* ========================
   ENHANCED PORTFOLIO SCRIPT
======================== */

// ========================
// HELPERS & UTILITIES
// ========================
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => [...el.querySelectorAll(s)];

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

// ========================
// NAVBAR & HEADER
// ========================
const navToggle = qs("#navToggle");
const navLinks = qs("#navLinks");
const header = qs(".header");

navToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
});

qsa(".nav__link").forEach((a) => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Header scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header?.classList.add("scrolled");
  } else {
    header?.classList.remove("scrolled");
  }
}, { passive: true });

// ========================
// TYPEWRITER EFFECT
// ========================
const typeTarget = qs("#typewriter");
const lines = [
  "I build modern web experiences",
  "I create smooth animations",
  "I develop interactive applications"
];

let tLine = 0, tChar = 0, deleting = false;

function tickType() {
  if (!typeTarget) return;

  const current = lines[tLine];
  const speed = deleting ? 25 : 50;

  if (!deleting) {
    tChar++;
    typeTarget.textContent = current.slice(0, tChar);
    if (tChar >= current.length) {
      deleting = true;
      setTimeout(tickType, 1200);
      return;
    }
  } else {
    tChar--;
    typeTarget.textContent = current.slice(0, tChar);
    if (tChar <= 0) {
      deleting = false;
      tLine = (tLine + 1) % lines.length;
    }
  }

  setTimeout(tickType, speed);
}
tickType();

// ========================
// SCROLL PROGRESS & ACTIVE LINKS
// ========================
const progressBar = qs("#scrollProgressBar");
const sections = ["home", "about", "projects", "skills", "contact"]
  .map(id => qs(`#${id}`))
  .filter(Boolean);
const navMap = new Map(qsa(".nav__link").map(a => [a.getAttribute("href"), a]));

function onScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = `${clamp(p, 0, 100)}%`;

  // Active link highlight
  let currentId = "#home";
  for (const sec of sections) {
    const top = sec.getBoundingClientRect().top + window.scrollY;
    if (scrollTop + 140 >= top) currentId = `#${sec.id}`;
  }
  navMap.forEach((el) => el.classList.remove("active"));
  const active = navMap.get(currentId);
  if (active) active.classList.add("active");
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ========================
// REVEAL ON SCROLL ANIMATION
// ========================
const revealEls = qsa(".reveal");

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("show");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => io.observe(el));

// ========================
// COUNT UP ANIMATION (Hero Stats)
// ========================
const counters = qsa("[data-count]");
let counterStarted = false;

function startCounters() {
  if (counterStarted) return;
  counterStarted = true;

  counters.forEach((el) => {
    const to = Number(el.getAttribute("data-count")) || 0;
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      const easeOut = 1 - Math.pow(1 - t, 3);
      const val = Math.round(to * easeOut);
      el.textContent = String(val);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

const hero = qs("#home");
if (hero) {
  const heroIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        startCounters();
        heroIO.disconnect();
      }
    });
  }, { threshold: 0.25 });
  heroIO.observe(hero);
}

// ========================
// PROJECTS SYSTEM
// ========================
const PROJECTS = [
  {
    id: "donation-platform",
    title: "NGO Donation Platform",
    category: "Full Stack",
    tag: "Full Stack",
    description: "Complete donation management system with user authentication and admin dashboard.",
    stack: ["React", "Node.js", "MongoDB", "Stripe"],
    live: "https://example.com",
    code: "https://github.com/",
    highlights: [
      "Secure payment processing with Stripe",
      "Real-time donation tracking",
      "Responsive admin dashboard",
      "Email notifications system"
    ]
  },
  {
    id: "portfolio-website",
    title: "Interactive Portfolio",
    category: "Frontend",
    tag: "Frontend",
    description: "Modern portfolio with smooth animations, project showcase, and contact form.",
    stack: ["HTML", "CSS", "JavaScript", "Canvas API"],
    live: "#",
    code: "https://github.com/",
    highlights: [
      "Animated particle background",
      "Smooth scroll reveals",
      "Project filtering system",
      "Interactive modal previews"
    ]
  },
  {
    id: "todo-app",
    title: "Advanced To-Do Application",
    category: "Frontend",
    tag: "Frontend",
    description: "Feature-rich to-do app with local storage, drag-and-drop, and dark mode.",
    stack: ["JavaScript", "LocalStorage", "CSS Grid"],
    live: "#",
    code: "https://github.com/",
    highlights: [
      "Drag and drop functionality",
      "Category organization",
      "Persistent data storage",
      "Smooth UI animations"
    ]
  },
  {
    id: "ecommerce-store",
    title: "E-Commerce Store",
    category: "Full Stack",
    tag: "Full Stack",
    description: "Full-featured online store with product catalog, shopping cart, and checkout.",
    stack: ["React", "Express", "MongoDB", "Tailwind CSS"],
    live: "#",
    code: "https://github.com/",
    highlights: [
      "Product filtering and search",
      "Shopping cart functionality",
      "Order tracking system",
      "Admin product management"
    ]
  },
  {
    id: "weather-app",
    title: "Real-Time Weather App",
    category: "Frontend",
    tag: "Frontend",
    description: "Beautiful weather application with real-time data and animated weather icons.",
    stack: ["JavaScript", "API Integration", "Chart.js"],
    live: "#",
    code: "https://github.com/",
    highlights: [
      "Real-time weather updates",
      "Location-based forecasts",
      "Beautiful UI animations",
      "Responsive design"
    ]
  },
  {
    id: "chat-app",
    title: "Real-Time Chat Application",
    category: "Full Stack",
    tag: "Full Stack",
    description: "Real-time messaging app with socket.io, user presence, and message history.",
    stack: ["React", "Node.js", "Socket.io", "MongoDB"],
    live: "#",
    code: "https://github.com/",
    highlights: [
      "Real-time messaging with Socket.io",
      "User presence indicators",
      "Chat history persistence",
      "Typing indicators"
    ]
  }
];

const projectsGrid = qs("#projectsGrid");
const filtersWrap = qs("#projectFilters");
const projectSearch = qs("#projectSearch");

const ALL_CATEGORIES = ["All", ...Array.from(new Set(PROJECTS.map(p => p.category)))];

let currentFilter = "All";
let currentSearch = "";

function renderFilters() {
  if (!filtersWrap) return;
  filtersWrap.innerHTML = "";

  ALL_CATEGORIES.forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "tab" + (c === currentFilter ? " active" : "");
    btn.type = "button";
    btn.textContent = c;

    btn.addEventListener("click", () => {
      currentFilter = c;
      qsa(".tab", filtersWrap).forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      renderProjects();
    });

    filtersWrap.appendChild(btn);
  });
}

function matchProject(p) {
  const filterOk = currentFilter === "All" || p.category === currentFilter;
  const s = currentSearch.trim().toLowerCase();
  if (!s) return filterOk;

  const text = (p.title + " " + p.description + " " + p.stack.join(" ")).toLowerCase();
  return filterOk && text.includes(s);
}

function projectCard(p) {
  const el = document.createElement("article");
  el.className = "project reveal";

  el.innerHTML = `
    <div class="project__top">
      <div>
        <h3 class="project__title">${p.title}</h3>
      </div>
      <span class="project__tag">${p.tag}</span>
    </div>
    <p class="project__desc">${p.description}</p>
    <div class="project__stack">
      ${p.stack.map(s => `<span class="pill2">${s}</span>`).join("")}
    </div>
    <div class="project__actions">
      <button class="btn btn--secondary" type="button" data-open="${p.id}">
        <i class="fa-regular fa-eye"></i> View Details
      </button>
      <a class="btn btn--outline" href="${p.code}" target="_blank" rel="noreferrer">
        <i class="fa-brands fa-github"></i> Source
      </a>
    </div>
  `;

  return el;
}

function renderProjects() {
  if (!projectsGrid) return;

  projectsGrid.innerHTML = "";
  const list = PROJECTS.filter(matchProject);

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "card";
    empty.innerHTML = `
      <h3 class="card__title">No Projects Found</h3>
      <p class="muted">Try adjusting your filters or search term.</p>
    `;
    projectsGrid.appendChild(empty);
    return;
  }

  list.forEach((p) => {
    const card = projectCard(p);
    projectsGrid.appendChild(card);
    io.observe(card);
  });
}

projectSearch?.addEventListener("input", (e) => {
  currentSearch = e.target.value || "";
  renderProjects();
});

renderFilters();
renderProjects();

// ========================
// PROJECT MODAL
// ========================
const modal = qs("#projectModal");
const modalBody = qs("#modalBody");

function openModal(projectId) {
  if (!modal || !modalBody) return;
  const p = PROJECTS.find(x => x.id === projectId);
  if (!p) return;

  modalBody.innerHTML = `
    <div class="modal__head">
      <h3 class="modal__title">${p.title}</h3>
      <p class="modal__desc">${p.description}</p>
      <div class="modal__actions">
        <a class="btn btn--primary" href="${p.live}" target="_blank" rel="noreferrer">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo
        </a>
        <a class="btn btn--secondary" href="${p.code}" target="_blank" rel="noreferrer">
          <i class="fa-brands fa-github"></i> Source Code
        </a>
      </div>
    </div>

    <hr class="hr" />

    <div>
      <h4 style="margin:0 0 12px; font-weight:700; color:var(--text-primary);">Technology Stack</h4>
      <div class="project__stack">
        ${p.stack.map(s => `<span class="pill2">${s}</span>`).join("")}
      </div>
    </div>

    <hr class="hr" />

    <div>
      <h4 style="margin:0 0 12px; font-weight:700; color:var(--text-primary);">Key Features</h4>
      <ul class="list">
        ${p.highlights.map(h => `<li><i class="fa-solid fa-check"></i> ${h}</li>`).join("")}
      </ul>
    </div>
  `;

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.addEventListener("click", (e) => {
  const openBtn = e.target.closest("[data-open]");
  if (openBtn) {
    openModal(openBtn.getAttribute("data-open"));
    return;
  }

  const closeBtn = e.target.closest("[data-close='true']");
  if (closeBtn) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ========================
// SKILLS SYSTEM
// ========================
const SKILLS = [
  { name: "HTML5", level: 95, icon: "fa-brands fa-html5", note: "Semantic, SEO optimized" },
  { name: "CSS3", level: 92, icon: "fa-brands fa-css3-alt", note: "Animations, responsive design" },
  { name: "JavaScript", level: 88, icon: "fa-brands fa-js", note: "ES6+, DOM manipulation" },
  { name: "React", level: 82, icon: "fa-brands fa-react", note: "Hooks, state management" },
  { name: "Node.js", level: 75, icon: "fa-brands fa-node-js", note: "APIs, backend development" },
  { name: "MongoDB", level: 70, icon: "fa-solid fa-database", note: "Database design, queries" },
  { name: "Tailwind CSS", level: 85, icon: "fa-solid fa-palette", note: "Utility-first styling" },
  { name: "Git", level: 90, icon: "fa-brands fa-git-alt", note: "Version control, workflows" }
];

const skillsGrid = qs("#skillsGrid");

function skillCard(s) {
  const el = document.createElement("div");
  el.className = "skill reveal";

  el.innerHTML = `
    <div class="skill__head">
      <h3 class="skill__name">${s.name}</h3>
      <div class="skill__level"><span class="skillPercent" data-p="${s.level}">0</span>%</div>
    </div>

    <div class="skill__meta">
      <div class="skill__icon"><i class="${s.icon}"></i></div>
      <div>${s.note}</div>
    </div>

    <div class="bar" aria-label="${s.name} skill level ${s.level}%">
      <div class="bar__fill" style="width:0%"></div>
    </div>
  `;

  return el;
}

function renderSkills() {
  if (!skillsGrid) return;
  skillsGrid.innerHTML = "";
  SKILLS.forEach((s) => {
    const c = skillCard(s);
    skillsGrid.appendChild(c);
    io.observe(c);
  });
}
renderSkills();

function animateSkillsInView() {
  const skillCards = qsa(".skill");
  skillCards.forEach((card) => {
    if (card.dataset.animated === "true") return;

    const rect = card.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.85;
    if (!inView) return;

    card.dataset.animated = "true";
    const fill = qs(".bar__fill", card);
    const percentEl = qs(".skillPercent", card);
    const target = Number(percentEl?.dataset?.p || 0);

    // Animate bar fill
    requestAnimationFrame(() => {
      fill.style.width = `${target}%`;
    });

    // Animate percentage counter
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      const easeOut = 1 - Math.pow(1 - t, 3);
      const val = Math.round(target * easeOut);
      percentEl.textContent = String(val);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

window.addEventListener("scroll", animateSkillsInView, { passive: true });
animateSkillsInView();

// ========================
// CONTACT FORM
// ========================
const contactForm = qs("#contactForm");
const formHint = qs("#formHint");

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(contactForm);

  const name = String(fd.get("name") || "").trim();
  const email = String(fd.get("email") || "").trim();
  const message = String(fd.get("message") || "").trim();

  if (!name || !email || !message) {
    if (formHint) {
      formHint.textContent = "⚠️ Please fill in all fields.";
      formHint.style.color = "#ff6b6b";
    }
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    if (formHint) {
      formHint.textContent = "⚠️ Please enter a valid email address.";
      formHint.style.color = "#ff6b6b";
    }
    return;
  }

  // Mailto fallback
  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  );
  window.location.href = `mailto:satyam@example.com?subject=${subject}&body=${body}`;

  if (formHint) {
    formHint.textContent = "✅ Opening your email client...";
    formHint.style.color = "#22c55e";
  }
  
  setTimeout(() => {
    contactForm.reset();
    if (formHint) formHint.textContent = "";
  }, 500);
});

// ========================
// RESUME BUTTON
// ========================
qs("#downloadResumeBtn")?.addEventListener("click", (e) => {
  e.preventDefault();
  // Replace with your actual resume URL
  window.open("https://example.com/resume.pdf", "_blank");
});

// ========================
// FOOTER YEAR
// ========================
const yearEl = qs("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// ========================
// ANIMATED BACKGROUND CANVAS
// ========================
const canvas = qs("#bgCanvas");
const ctx = canvas?.getContext("2d");

let W = 0, H = 0;
let particles = [];

function resizeCanvas() {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  W = canvas.clientWidth;
  H = canvas.clientHeight;
  canvas.width = Math.floor(W * dpr);
  canvas.height = Math.floor(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);

function createParticles() {
  if (!canvas) return;
  const count = prefersReducedMotion() ? 15 : Math.floor((W * H) / 25000);
  particles = new Array(clamp(count, 20, 60)).fill(0).map(() => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.5 + 0.5,
    life: Math.random() * 0.5 + 0.5
  }));
}

let animationId;

function drawBg() {
  if (!ctx || !canvas) return;

  ctx.fillStyle = "rgba(10, 14, 39, 0)";
  ctx.clearRect(0, 0, W, H);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.002;

    if (p.x < -20) p.x = W + 20;
    if (p.x > W + 20) p.x = -20;
    if (p.y < -20) p.y = H + 20;
    if (p.y > H + 20) p.y = -20;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(124, 58, 237, ${0.4 * p.life})`;
    ctx.fill();
  }

  animationId = requestAnimationFrame(drawBg);
}

function initBg() {
  if (!canvas || !ctx) return;
  resizeCanvas();
  createParticles();
  drawBg();
}

initBg();

// ========================
// HERO CANVAS WITH PARTICLES
// ========================
const heroCanvas = qs("#heroCanvas");
const heroCtx = heroCanvas?.getContext("2d");

let heroW = 0, heroH = 0;
let heroParticles = [];
let mouse = { x: -9999, y: -9999 };

function resizeHeroCanvas() {
  if (!heroCanvas) return;
  const dpr = window.devicePixelRatio || 1;
  heroW = heroCanvas.clientWidth;
  heroH = heroCanvas.clientHeight;
  heroCanvas.width = Math.floor(heroW * dpr);
  heroCanvas.height = Math.floor(heroH * dpr);
  heroCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeHeroCanvas);

function createHeroParticles() {
  if (!heroCanvas) return;
  const count = prefersReducedMotion() ? 20 : Math.floor((heroW * heroH) / 18000);
  heroParticles = new Array(clamp(count, 40, 100)).fill(0).map(() => ({
    x: Math.random() * heroW,
    y: Math.random() * heroH,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    r: Math.random() * 2 + 0.8
  }));
}

function drawHeroCanvas() {
  if (!heroCtx || !heroCanvas) return;

  heroCtx.clearRect(0, 0, heroW, heroH);

  // Draw particles
  for (const p of heroParticles) {
    p.x += p.vx;
    p.y += p.vy;

    // Mouse interaction
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150) {
      const force = (150 - dist) / 150;
      p.x += (dx / (dist + 0.001)) * force * 1.2;
      p.y += (dy / (dist + 0.001)) * force * 1.2;
    }

    // Wrap around
    if (p.x < -20) p.x = heroW + 20;
    if (p.x > heroW + 20) p.x = -20;
    if (p.y < -20) p.y = heroH + 20;
    if (p.y > heroH + 20) p.y = -20;

    heroCtx.beginPath();
    heroCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    heroCtx.fillStyle = "rgba(232, 236, 243, 0.7)";
    heroCtx.fill();
  }

  // Draw connecting lines
  for (let i = 0; i < heroParticles.length; i++) {
    for (let j = i + 1; j < heroParticles.length; j++) {
      const a = heroParticles[i];
      const b = heroParticles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      const maxD = 140;
      if (d < maxD) {
        const alpha = (1 - d / maxD) * 0.25;
        heroCtx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
        heroCtx.lineWidth = 1.5;
        heroCtx.beginPath();
        heroCtx.moveTo(a.x, a.y);
        heroCtx.lineTo(b.x, b.y);
        heroCtx.stroke();
      }
    }
  }

  requestAnimationFrame(drawHeroCanvas);
}

function initHeroCanvas() {
  if (!heroCanvas || !heroCtx) return;

  resizeHeroCanvas();
  createHeroParticles();
  drawHeroCanvas();

  // Mouse tracking
  heroCanvas.addEventListener("mousemove", (e) => {
    const rect = heroCanvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  heroCanvas.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Touch support
  heroCanvas.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (!t) return;
    const rect = heroCanvas.getBoundingClientRect();
    mouse.x = t.clientX - rect.left;
    mouse.y = t.clientY - rect.top;
  }, { passive: true });

  heroCanvas.addEventListener("touchend", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });
}

initHeroCanvas();

// ========================
// SMOOTH SCROLL BEHAVIOR
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ========================
// PERFORMANCE OPTIMIZATION
// ========================
// Reduce animations on low-end devices
if (navigator.deviceMemory && navigator.deviceMemory <= 2) {
  document.body.style.setProperty('--transition', 'all 0.15s ease');
}

// Log when page is fully loaded
window.addEventListener('load', () => {
  console.log('Portfolio loaded successfully! 🚀');
});