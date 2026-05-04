// ----------- Countdown -----------
const eventDateTime = new Date("2026-06-15T12:00:00");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function updateCountdown() {
  const now = new Date();
  const distance = eventDateTime - now;

  if (distance <= 0) {
    daysEl.textContent = "0";
    hoursEl.textContent = "0";
    minutesEl.textContent = "0";
    secondsEl.textContent = "0";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  daysEl.textContent = String(days);
  hoursEl.textContent = String(hours);
  minutesEl.textContent = String(minutes);
  secondsEl.textContent = String(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ----------- Music toggle -----------
const musicToggle = document.getElementById("music-toggle");
const musicHint = document.getElementById("music-hint");
const bgMusic = document.getElementById("bg-music");
let musicPlaying = false;

setTimeout(() => musicHint && musicHint.classList.add("show"), 1800);
setTimeout(() => musicHint && musicHint.classList.remove("show"), 8000);

musicToggle.addEventListener("click", async () => {
  if (musicHint) musicHint.classList.remove("show");
  try {
    if (musicPlaying) {
      bgMusic.pause();
      musicToggle.textContent = "♪";
      musicToggle.setAttribute("aria-label", "Enable music");
      musicPlaying = false;
    } else {
      await bgMusic.play();
      musicToggle.textContent = "♫";
      musicToggle.setAttribute("aria-label", "Pause music");
      musicPlaying = true;
    }
  } catch (_error) {
    musicToggle.textContent = "×";
    musicToggle.setAttribute("aria-label", "Audio unavailable");
  }
});

// ----------- Scroll Reveal -----------
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));

// ----------- Cursor Trail (sparkles + leaves) -----------
const trailContainer = document.getElementById("cursor-trail");
const trailVariants = ["l1", "l2", "l3", "l4"];
let trailLastEmit = 0;
const trailIsTouch = matchMedia("(pointer: coarse)").matches;
const trailDisabled = prefersReducedMotionInit() || trailIsTouch;

function prefersReducedMotionInit() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function emitTrailParticle(x, y) {
  if (!trailContainer) return;
  const variant = trailVariants[Math.floor(Math.random() * trailVariants.length)];
  const el = document.createElement("div");
  el.className = `trail-leaf ${variant}`;

  const size = 12 + Math.random() * 14;
  const dx = (Math.random() - 0.5) * 60;
  const dy = 14 + Math.random() * 38;
  const rot = 120 + Math.random() * 220;

  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.setProperty("--dx", `${dx}px`);
  el.style.setProperty("--dy", `${dy}px`);
  el.style.setProperty("--rot", `${rot}deg`);

  trailContainer.appendChild(el);
  setTimeout(() => el.remove(), 1700);
}

if (!trailDisabled) {
  document.addEventListener("mousemove", (e) => {
    const now = performance.now();
    if (now - trailLastEmit < 55) return;
    trailLastEmit = now;
    emitTrailParticle(e.clientX, e.clientY);
  });
}

// ----------- Click / Tap Burst -----------
function burstAt(x, y, count = 12) {
  if (!trailContainer) return;
  for (let i = 0; i < count; i++) {
    const variant = trailVariants[Math.floor(Math.random() * trailVariants.length)];
    const el = document.createElement("div");
    el.className = `trail-leaf ${variant} burst`;
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const dist = 60 + Math.random() * 80;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const size = 14 + Math.random() * 14;

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.setProperty("--dx", `${dx}px`);
    el.style.setProperty("--dy", `${dy}px`);
    el.style.setProperty("--rot", `${Math.random() * 540}deg`);

    trailContainer.appendChild(el);
    setTimeout(() => el.remove(), 1700);
  }
}

document.addEventListener("click", (e) => {
  if (
    e.target.closest("a, button, iframe, .music-toggle, .direction-btn") ||
    prefersReducedMotionInit()
  ) {
    return;
  }
  burstAt(e.clientX, e.clientY, 10);
});

// Big celebration burst from monogram
const emblemBtn = document.getElementById("emblem-btn");
if (emblemBtn && !prefersReducedMotionInit()) {
  emblemBtn.addEventListener("click", () => {
    const rect = emblemBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    burstAt(cx, cy, 24);
    emblemBtn.classList.add("bursting");
    setTimeout(() => emblemBtn.classList.remove("bursting"), 1000);
  });
}

// ----------- 3D tilt on couple frame -----------
const coupleFrame = document.querySelector(".couple-frame");
if (coupleFrame && !matchMedia("(pointer: coarse)").matches && !prefersReducedMotionInit()) {
  let frameRect = null;

  const updateRect = () => {
    frameRect = coupleFrame.getBoundingClientRect();
  };

  coupleFrame.addEventListener("mouseenter", () => {
    coupleFrame.classList.add("tilting");
    updateRect();
  });

  coupleFrame.addEventListener("mousemove", (e) => {
    if (!frameRect) updateRect();
    const x = (e.clientX - frameRect.left) / frameRect.width - 0.5;
    const y = (e.clientY - frameRect.top) / frameRect.height - 0.5;
    const rx = -y * 8;
    const ry = x * 10;
    coupleFrame.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });

  coupleFrame.addEventListener("mouseleave", () => {
    coupleFrame.style.transform = "";
    coupleFrame.classList.remove("tilting");
  });

  window.addEventListener("scroll", updateRect, { passive: true });
  window.addEventListener("resize", updateRect);
}

// ----------- Falling Petals -----------
const petalsContainer = document.getElementById("petals");
const petalVariants = ["p1", "p2", "p3", "p4"];
const isSmallScreen = window.matchMedia("(max-width: 760px)").matches;
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const TOTAL_PETALS = prefersReducedMotion ? 0 : isSmallScreen ? 12 : 22;

function createPetal() {
  const petal = document.createElement("div");
  const variant = petalVariants[Math.floor(Math.random() * petalVariants.length)];
  petal.className = `petal ${variant}`;

  const size = 14 + Math.random() * 18;
  const left = Math.random() * 100;
  const duration = 10 + Math.random() * 12;
  const delay = -Math.random() * duration;
  const opacity = 0.55 + Math.random() * 0.4;

  petal.style.width = `${size}px`;
  petal.style.height = `${size}px`;
  petal.style.left = `${left}%`;
  petal.style.animationDuration = `${duration}s`;
  petal.style.animationDelay = `${delay}s`;
  petal.style.opacity = String(opacity);

  petalsContainer.appendChild(petal);
}

if (petalsContainer) {
  for (let i = 0; i < TOTAL_PETALS; i++) {
    createPetal();
  }
}
