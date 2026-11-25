document.addEventListener("DOMContentLoaded", () => {
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navLinkItems = document.querySelectorAll(".nav-link");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const contactForm = document.getElementById("contactForm");
  const toast = document.getElementById("toast");
  const yearEl = document.getElementById("year");

  // Set current year in footer
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Theme initialization & persistence
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    htmlEl.setAttribute("data-theme", savedTheme);
  }

  themeToggle?.addEventListener("click", () => {
    const current = htmlEl.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    htmlEl.setAttribute("data-theme", next);
    localStorage.setItem("portfolio-theme", next);
  });

  // Mobile navigation drawer
  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinkItems.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Project category filtering
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      projectCards.forEach((card) => {
        const category = card.dataset.category;
        const shouldShow = filter === "all" || category === filter;
        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  // 3D Interactive Tilt & Specular Glare for Cards & Hero Portrait
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isPointerFine = window.matchMedia("(pointer: fine)").matches;

  if (!prefersReducedMotion && isPointerFine) {
    const attachTilt = (el, maxTilt = 7, lift = 6) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * maxTilt;
        const rotateX = -((y - centerY) / centerY) * maxTilt;

        el.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
        el.style.setProperty("--my", `${(y / rect.height) * 100}%`);
        el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-${lift}px)`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    };

    document.querySelectorAll(".card").forEach((card) => attachTilt(card, 6, 5));

    const portraitStage = document.querySelector(".portrait-3d-stage");
    if (portraitStage) {
      attachTilt(portraitStage, 12, 4);
    }
  }

  // Scroll reveal animations
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // Active nav link highlight on scroll
  const sections = document.querySelectorAll("main section[id]");
  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      const targetLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (targetLink) {
        if (scrollPos >= top && scrollPos < top + height) {
          navLinkItems.forEach((l) => l.classList.remove("active"));
          targetLink.classList.add("active");
        }
      }
    });
  };
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  // Toast helper
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3600);
  };

  // Contact form handling
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      showToast("Please fill in all fields before sending.");
      return;
    }

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:Mitkumarpatel20@gnu.ac.in?subject=${subject}&body=${body}`;

    showToast("Opening your email client to send the message!");
    contactForm.reset();
  });
});
