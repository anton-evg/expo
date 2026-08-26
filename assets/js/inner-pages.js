document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".inner-header__menu-button");
  const navigation = document.querySelector(".inner-header__navigation");
  const cookieBanner = document.querySelector(".inner-cookie");
  const cookieButton = document.querySelector(".inner-cookie__button");
  const lightbox = document.querySelector(".inner-lightbox");
  const lightboxImage = document.querySelector(".inner-lightbox__image");

  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation?.classList.toggle("inner-header__navigation--open", !isOpen);
  });

  if (cookieBanner && localStorage.getItem("expo-cookie-accepted") === "true") cookieBanner.hidden = true;
  cookieButton?.addEventListener("click", () => {
    localStorage.setItem("expo-cookie-accepted", "true");
    if (cookieBanner) cookieBanner.hidden = true;
  });

  const closeLightbox = () => {
    lightbox?.classList.remove("inner-lightbox--open");
    lightboxImage?.removeAttribute("src");
  };

  document.querySelectorAll(".portfolio-card[data-image]").forEach((card) => {
    card.addEventListener("click", () => {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = card.dataset.image;
      lightboxImage.alt = card.dataset.alt || "Реализованный выставочный стенд";
      lightbox.classList.add("inner-lightbox--open");
    });
  });

  document.querySelector(".inner-lightbox__close")?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  if (!window.gsap || !window.ScrollTrigger || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  window.gsap.registerPlugin(window.ScrollTrigger);
  window.gsap.from(".inner-hero__eyebrow, .inner-hero__title, .inner-hero__lead", {
    autoAlpha: 0,
    duration: 0.8,
    stagger: 0.12,
    y: 28,
    ease: "power3.out"
  });
  window.ScrollTrigger.batch(".inner-animate", {
    start: "top 82%",
    onEnter: (elements) => window.gsap.from(elements, {
      autoAlpha: 0,
      duration: 0.72,
      ease: "power3.out",
      overwrite: "auto",
      stagger: 0.09,
      y: 28
    })
  });
});
