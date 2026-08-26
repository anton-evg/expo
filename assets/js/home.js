document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".home-header__menu-button");
  const navigation = document.querySelector(".home-header__navigation");
  const cookieBanner = document.querySelector(".home-cookie");
  const cookieButton = document.querySelector(".home-cookie__button");
  const lightbox = document.querySelector(".home-lightbox");
  const lightboxImage = document.querySelector(".home-lightbox__image");
  const lightboxClose = document.querySelector(".home-lightbox__close");
  const portfolioCards = document.querySelectorAll(".home-portfolio__card[data-image]");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      navigation.classList.toggle("home-header__navigation--open", !isOpen);
      document.body.classList.toggle("home-menu--open", !isOpen);
    });
  }

  if (cookieBanner && localStorage.getItem("expo-cookie-accepted") === "true") {
    cookieBanner.hidden = true;
  }

  if (cookieButton && cookieBanner) {
    cookieButton.addEventListener("click", () => {
      localStorage.setItem("expo-cookie-accepted", "true");
      cookieBanner.hidden = true;
    });
  }

  const closeLightbox = () => {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove("home-lightbox--open");
    lightboxImage.removeAttribute("src");
    lightboxImage.removeAttribute("alt");
  };

  portfolioCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = card.dataset.image;
      lightboxImage.alt = card.dataset.alt || "Фото реализованного выставочного стенда";
      lightbox.classList.add("home-lightbox--open");
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });

  if (!window.gsap || !window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);
  const animationContext = window.gsap.context(() => {
    const motionQuery = window.gsap.matchMedia();

    motionQuery.add(
      {
        desktop: "(min-width: 701px)",
        reduceMotion: "(prefers-reduced-motion: reduce)"
      },
      (context) => {
        const { reduceMotion } = context.conditions;

        if (reduceMotion) return undefined;

        const heroTimeline = window.gsap.timeline({
          defaults: { duration: 0.9, ease: "power3.out" }
        });

        heroTimeline
          .from(".home-hero__image", { autoAlpha: 0, xPercent: -34, duration: 1.35, ease: "power4.out" })
          .from(".home-hero__mark", { autoAlpha: 0, y: 18 }, "<0.16")
          .from(".home-hero__title", { autoAlpha: 0, y: 36 }, "<0.12")
          .from(".home-hero__description, .home-hero__action", { autoAlpha: 0, y: 24, stagger: 0.12 }, "<0.12")
          .from(".home-hero__fact", { autoAlpha: 0, y: 18, stagger: 0.1 }, "<0.2")
          .from(".home-hero__frame", { autoAlpha: 0, scaleX: 0, transformOrigin: "left center" }, "<0.08")
          .from(".home-hero__accent", { xPercent: 100 }, "<0.14");

        window.ScrollTrigger.batch(".home-company__intro, .home-company__benefit, .home-portfolio__header, .home-portfolio__card, .home-clients__layout, .home-production__visual, .home-production__copy, .home-contacts__content, .home-contacts__map", {
          start: "top 82%",
          onEnter: (elements) => window.gsap.from(elements, {
            autoAlpha: 0,
            y: 28,
            duration: 0.72,
            ease: "power3.out",
            stagger: 0.09,
            overwrite: "auto"
          })
        });

        const processTimeline = window.gsap.timeline({
          defaults: { duration: 0.8, ease: "power3.out" },
          scrollTrigger: {
            trigger: ".home-process__steps",
            start: "top 76%",
            toggleActions: "restart none none reset"
          }
        });

        processTimeline.from(".home-process__step", {
          autoAlpha: 0,
          y: 54,
          stagger: 0.16
        });

        let removePointerMotion = () => {};

        if (context.conditions.desktop) {
          window.gsap.to(".home-hero__image", {
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: ".home-hero",
              start: "top top",
              end: "bottom top",
              scrub: 0.7
            }
          });

          const heroVisual = document.querySelector(".home-hero__visual");
          const heroImage = document.querySelector(".home-hero__image");
          const heroFrame = document.querySelector(".home-hero__frame");
          const heroAccent = document.querySelector(".home-hero__accent");

          if (heroVisual && heroImage && heroFrame && heroAccent) {
            const imageX = window.gsap.quickTo(heroImage, "x", { duration: 0.7, ease: "power3.out" });
            const imageY = window.gsap.quickTo(heroImage, "y", { duration: 0.7, ease: "power3.out" });
            const frameX = window.gsap.quickTo(heroFrame, "x", { duration: 0.55, ease: "power3.out" });
            const accentX = window.gsap.quickTo(heroAccent, "x", { duration: 0.55, ease: "power3.out" });

            const handlePointerMove = (event) => {
              const bounds = heroVisual.getBoundingClientRect();
              const horizontalPosition = (event.clientX - bounds.left) / bounds.width - 0.5;
              const verticalPosition = (event.clientY - bounds.top) / bounds.height - 0.5;
              imageX(horizontalPosition * 18);
              imageY(verticalPosition * 14);
              frameX(horizontalPosition * -16);
              accentX(horizontalPosition * 22);
            };

            const handlePointerLeave = () => {
              imageX(0);
              imageY(0);
              frameX(0);
              accentX(0);
            };

            heroVisual.addEventListener("pointermove", handlePointerMove);
            heroVisual.addEventListener("pointerleave", handlePointerLeave);
            removePointerMotion = () => {
              heroVisual.removeEventListener("pointermove", handlePointerMove);
              heroVisual.removeEventListener("pointerleave", handlePointerLeave);
            };
          }
        }

        return () => {
          removePointerMotion();
          window.ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
      }
    );

    window.addEventListener("load", () => window.ScrollTrigger.refresh(), { once: true });
  });

  window.addEventListener("beforeunload", () => animationContext.revert(), { once: true });
});
