/**
 * Portfolio interactions: theme, contact menu, navigation, and About accordion.
 */
(() => {
  const routeDirection = window.sessionStorage.getItem("portfolio-route-direction");
  if (routeDirection === "forward" || routeDirection === "back") {
    document.documentElement.dataset.routeDirection = routeDirection;
    document.body.classList.add(`page-enter-${routeDirection}`);
    window.setTimeout(() => {
      document.body.classList.remove(`page-enter-${routeDirection}`);
      window.sessionStorage.removeItem("portfolio-route-direction");
    }, 520);
  }

  document.querySelectorAll('a[href="index.html"], a[href="index.html#top"], a[href="about.html"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = link.getAttribute("href");
      if (!target) return;
      const isAbout = target === "about.html";
      const alreadyAbout = window.location.pathname.endsWith("/about.html");
      const alreadyHome = window.location.pathname.endsWith("/index.html") || window.location.pathname.endsWith("/");
      if ((isAbout && alreadyAbout) || (!isAbout && alreadyHome)) return;

      event.preventDefault();
      const direction = isAbout ? "forward" : "back";
      window.sessionStorage.setItem("portfolio-route-direction", direction);
      document.documentElement.dataset.routeDirection = direction;
      if (!document.startViewTransition) document.body.classList.add(`page-leaving-${direction}`);
      window.setTimeout(() => {
        window.location.href = target;
      }, document.startViewTransition ? 20 : 280);
    });
  });

  const intro = document.querySelector(".intro-screen");
  const introName = document.querySelector(".intro-screen-name");
  if (intro && introName) {
    const alreadyShown = window.sessionStorage.getItem("portfolio-intro-shown") === "true";
    const isRouteNavigation = routeDirection === "forward" || routeDirection === "back";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (alreadyShown || isRouteNavigation) {
      window.sessionStorage.setItem("portfolio-intro-shown", "true");
      intro.remove();
    } else {
      window.sessionStorage.setItem("portfolio-intro-shown", "true");
      document.body.classList.add("intro-active");
      const text = introName.textContent;
      introName.textContent = "";
      let index = 0;
      let timer;

      const finish = () => {
        window.clearInterval(timer);
        intro.classList.add("is-leaving");
        window.setTimeout(() => {
          intro.remove();
          document.body.classList.remove("intro-active");
        }, reducedMotion ? 20 : 280);
      };

      if (reducedMotion) {
        introName.textContent = text;
        window.setTimeout(finish, 450);
      } else {
        timer = window.setInterval(() => {
          index += 1;
          introName.textContent = text.slice(0, index);
          if (index >= text.length) {
            window.clearInterval(timer);
            window.setTimeout(finish, 700);
          }
        }, 82);
      }

      intro.addEventListener("click", finish);
    }
  }

  const savedTheme = window.localStorage.getItem("portfolio-theme");
  document.documentElement.dataset.theme = savedTheme === "dark" ? "dark" : "light";

  document.querySelectorAll(".theme-toggle").forEach((toggle) => {
    const updateToggle = () => {
      const isDark = document.documentElement.dataset.theme === "dark";
      toggle.textContent = isDark ? "light" : "dark";
      toggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
      toggle.setAttribute("aria-pressed", String(isDark));
    };

    updateToggle();
    toggle.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = nextTheme;
      window.localStorage.setItem("portfolio-theme", nextTheme);
      updateToggle();
    });
  });

  const menu = document.querySelector(".contact-menu");
  if (menu) {
    const trigger = menu.querySelector(".say-hi");
    const card = menu.querySelector(".contact-card");
    const copyButton = menu.querySelector(".copy-email");

    const setMenu = (open) => {
      card.hidden = !open;
      trigger.setAttribute("aria-expanded", String(open));
    };

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      setMenu(card.hidden);
    });

    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target)) setMenu(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !card.hidden) {
        setMenu(false);
        trigger.focus();
      }
    });

    if (copyButton) {
      copyButton.addEventListener("click", async () => {
        const label = copyButton.querySelector("small");
        const email = copyButton.dataset.email || "akanshrawat.in@gmail.com";

        try {
          await navigator.clipboard.writeText(email);
        } catch {
          const textarea = document.createElement("textarea");
          textarea.value = email;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          textarea.remove();
        }

        if (label) {
          label.textContent = "copied";
          window.setTimeout(() => {
            label.textContent = "copy";
          }, 1800);
        }
      });
    }
  }

  const resumeModal = document.querySelector(".resume-modal");
  if (resumeModal) {
    const resumeTrigger = document.querySelector(".resume-link");
    const resumeClose = resumeModal.querySelector(".resume-close");
    const resumeBackdrop = resumeModal.querySelector(".resume-backdrop");
    const mobileResume = window.matchMedia("(max-width: 640px)");

    const updateResumeAccessibility = () => {
      if (!mobileResume.matches) {
        resumeTrigger?.setAttribute("aria-haspopup", "dialog");
        resumeTrigger?.setAttribute("aria-expanded", String(!resumeModal.hidden));
      } else {
        resumeTrigger?.removeAttribute("aria-haspopup");
        resumeTrigger?.removeAttribute("aria-expanded");
      }
    };

    updateResumeAccessibility();
    mobileResume.addEventListener("change", updateResumeAccessibility);

    const setResume = (open) => {
      if (open) {
        resumeModal.hidden = false;
        resumeModal.classList.remove("is-closing");
        document.body.classList.add("resume-open");
        if (resumeTrigger) resumeTrigger.setAttribute("aria-expanded", "true");
        window.setTimeout(() => resumeClose?.focus(), 0);
        return;
      }

      resumeModal.classList.add("is-closing");
      document.body.classList.remove("resume-open");
      if (resumeTrigger) resumeTrigger.setAttribute("aria-expanded", "false");
      window.setTimeout(() => {
        resumeModal.hidden = true;
        resumeModal.classList.remove("is-closing");
        resumeTrigger?.focus();
      }, 620);
    };

    resumeTrigger?.addEventListener("click", (event) => {
      if (mobileResume.matches) return;
      event.preventDefault();
      setResume(true);
    });
    resumeClose?.addEventListener("click", () => setResume(false));
    resumeBackdrop?.addEventListener("click", () => setResume(false));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !resumeModal.hidden) setResume(false);
    });
  }

  const workSection = document.getElementById("work");
  if (workSection) {
    document.querySelectorAll('.signature, a[href="#top"], a[href="index.html#top"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.replaceState(null, "", window.location.pathname);
      });
    });

    document.querySelectorAll('a[href="#work"], a[href="index.html#work"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        workSection.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", "#work");
      });
    });

    if (window.location.hash === "#work") {
      window.setTimeout(() => {
        workSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }

    const navHome = document.querySelector(".nav-home");
    const navWork = document.querySelector(".nav-work");
    if (navHome && navWork) {
      const updateNavigation = () => {
        const workReached = workSection.getBoundingClientRect().top < window.innerHeight * 0.45;
        navHome.classList.toggle("active", !workReached);
        navWork.classList.toggle("active", workReached);
      };
      updateNavigation();
      window.addEventListener("scroll", updateNavigation, { passive: true });
    }
  } else if (window.location.pathname.endsWith("/about.html")) {
    document.querySelector(".nav-about")?.classList.add("active");
  }

  document.querySelectorAll(".question-item").forEach((item) => {
    const trigger = item.querySelector(".question-trigger");
    const answer = item.querySelector(".question-answer");
    if (!trigger || !answer) return;

    if (item.classList.contains("is-open")) {
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    } else {
      answer.style.maxHeight = "0px";
    }

    trigger.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");

      document.querySelectorAll(".question-item").forEach((otherItem) => {
        const otherTrigger = otherItem.querySelector(".question-trigger");
        const otherAnswer = otherItem.querySelector(".question-answer");
        if (!otherTrigger || !otherAnswer) return;
        otherItem.classList.remove("is-open");
        otherTrigger.setAttribute("aria-expanded", "false");
        otherAnswer.style.maxHeight = "0px";
        window.setTimeout(() => {
          if (!otherItem.classList.contains("is-open")) {
            otherAnswer.hidden = true;
          }
        }, 420);
      });

      if (willOpen) {
        answer.hidden = false;
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = "0px";
        window.requestAnimationFrame(() => {
          answer.style.maxHeight = `${answer.scrollHeight}px`;
        });
        window.setTimeout(() => {
          if (item.classList.contains("is-open")) {
            answer.style.maxHeight = "none";
          }
        }, 420);
      }
    });
  });

  const revealTargets = document.querySelectorAll(
    ".intro-list li, .detail-row, .links-row, .about-intro, .about-gallery, .questions-section, .preview-card, .question-item"
  );
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = Array.from(revealTargets).indexOf(entry.target);
        window.setTimeout(() => entry.target.classList.add("is-visible"), Math.min(index % 5, 4) * 70);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    revealTargets.forEach((target) => revealObserver.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
  }

  const ambient = document.querySelector(".ambient-bg");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (ambient && window.matchMedia("(pointer: fine)").matches && !reducedMotion) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener("pointermove", (event) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 16;
      targetY = (event.clientY / window.innerHeight - 0.5) * 16;
      ambient.style.setProperty("--ambient-x", `${event.clientX / window.innerWidth * 100}%`);
      ambient.style.setProperty("--ambient-y", `${event.clientY / window.innerHeight * 100}%`);
    }, { passive: true });

    const animateAmbient = () => {
      currentX += (targetX - currentX) * 0.035;
      currentY += (targetY - currentY) * 0.035;
      ambient.style.setProperty("--ambient-offset-x", `${currentX}px`);
      ambient.style.setProperty("--ambient-offset-y", `${currentY}px`);
      window.requestAnimationFrame(animateAmbient);
    };
    animateAmbient();
  }

})();
