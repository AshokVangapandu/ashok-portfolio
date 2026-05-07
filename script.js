const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const cursorLight = document.querySelector(".cursor-light");
const magneticItems = document.querySelectorAll(".magnetic");
const tiltCards = document.querySelectorAll(".tilt-card");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

const closeMenu = () => {
  navToggle.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navMenu.classList.remove("is-open");
};

setHeaderState();

window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navMenu.classList.toggle("is-open", isOpen);
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

if (!prefersReducedMotion) {
  window.addEventListener("pointermove", (event) => {
    const x = event.clientX;
    const y = event.clientY;
    const normalizedX = (x / window.innerWidth - 0.5).toFixed(3);
    const normalizedY = (y / window.innerHeight - 0.5).toFixed(3);

    document.body.classList.add("has-pointer");
    document.documentElement.style.setProperty("--mx", normalizedX);
    document.documentElement.style.setProperty("--my", normalizedY);
    cursorLight.style.setProperty("--x", `${x}px`);
    cursorLight.style.setProperty("--y", `${y}px`);
  }, { passive: true });

  magneticItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = x - rect.width / 2;
      const centerY = y - rect.height / 2;

      item.style.setProperty("--tx", `${centerX * 0.1}px`);
      item.style.setProperty("--ty", `${centerY * 0.14}px`);
      item.style.setProperty("--local-x", `${x}px`);
      item.style.setProperty("--local-y", `${y}px`);
    }, { passive: true });

    item.addEventListener("pointerleave", () => {
      item.style.setProperty("--tx", "0px");
      item.style.setProperty("--ty", "0px");
      item.style.removeProperty("--local-x");
      item.style.removeProperty("--local-y");
    });
  });

  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width - 0.5) * 7).toFixed(2);
      const rotateX = ((0.5 - y / rect.height) * 7).toFixed(2);

      card.style.setProperty("--rx", `${rotateX}deg`);
      card.style.setProperty("--ry", `${rotateY}deg`);
      card.style.setProperty("--local-x", `${x}px`);
      card.style.setProperty("--local-y", `${y}px`);
    }, { passive: true });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
      card.style.removeProperty("--local-x");
      card.style.removeProperty("--local-y");
    });
  });
}
