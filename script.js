
 // Small interactions: scroll reveals, typing text, theme, mobile navigation.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -35px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Cycle through the technologies shown in the hero.
const roleElement = document.querySelector(".typed-role");

const roles = [
  "Python & FastAPI",
  "REST API Development",
  "SQL Databases",
  "Open-Source Learning",
];

if (roleElement && !reduceMotion) {
  let roleIndex = 0;
  let letterIndex = roles[0].length;
  let deleting = true;

  const typeNext = () => {
    const current = roles[roleIndex];

    roleElement.textContent = current.slice(0, letterIndex);

    if (deleting) {
      letterIndex--;

      if (letterIndex < 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;

        window.setTimeout(typeNext, 350);
        return;
      }
    } else {
      letterIndex++;

      if (letterIndex > roles[roleIndex].length) {
        deleting = true;

        window.setTimeout(typeNext, 1600);
        return;
      }
    }

    window.setTimeout(typeNext, deleting ? 42 : 75);
  };

  window.setTimeout(typeNext, 1600);
}

// Mobile navigation.
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

const closeMenu = () => {
  navLinks?.classList.remove("open");

  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open navigation menu");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

  menuToggle.setAttribute("aria-expanded", String(!isOpen));

  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Open navigation menu" : "Close navigation menu"
  );

  navLinks?.classList.toggle("open", !isOpen);
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

// Scroll progress, sticky-nav border, back-to-top, and active section link.
const progress = document.querySelector(".scroll-progress");
const nav = document.querySelector(".site-nav");
const backToTop = document.querySelector(".back-to-top");

const sectionLinks = [
  ...document.querySelectorAll('.nav-links a[href^="#"]'),
];

const updateScrollUI = () => {
  const scrollable =
    document.documentElement.scrollHeight - window.innerHeight;

  const percentage =
    scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

  if (progress) {
    progress.style.width = `${percentage}%`;
  }

  nav?.classList.toggle("scrolled", window.scrollY > 12);

  backToTop?.classList.toggle("visible", window.scrollY > 500);
};

window.addEventListener("scroll", updateScrollUI, {
  passive: true,
});

updateScrollUI();

backToTop?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: reduceMotion ? "auto" : "smooth",
  });
});

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        sectionLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
    }
  );

  document
    .querySelectorAll("main section[id], main header[id]")
    .forEach((section) => sectionObserver.observe(section));
}

// Theme toggle remembers the choice for this browser.
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");

const savedTheme = (() => {
  try {
    return localStorage.getItem("akeem-portfolio-theme");
  } catch {
    return null;
  }
})();

if (savedTheme === "light") {
  document.body.classList.add("light-theme");
}

const syncThemeIcon = () => {
  const light = document.body.classList.contains("light-theme");

  if (themeIcon) {
    themeIcon.textContent = light ? "☾" : "☼";
  }

  themeToggle?.setAttribute(
    "aria-label",
    light ? "Switch to dark theme" : "Switch to light theme"
  );
};

syncThemeIcon();

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");

  const theme = document.body.classList.contains("light-theme")
    ? "light"
    : "dark";

  try {
    localStorage.setItem("akeem-portfolio-theme", theme);
  } catch {
    // Storage may be unavailable.
  }

  syncThemeIcon();
});

// Keep the footer year current.
const yearElement = document.querySelector("#year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
