/**
 * Akansh Rawat Portfolio Scripts
 * Handles accessible contact popover, clipboard interactions, and smooth navigation.
 */
(() => {
  // --- Page Route Transitions ---
  const direction = window.sessionStorage.getItem("portfolio-route-direction");

  if (direction === "forward" || direction === "back") {
    document.documentElement.dataset.routeDirection = direction;
  }

  if (direction === "forward" || direction === "back") {
    document.body.classList.add(`page-enter-${direction}`);
    window.setTimeout(() => {
      document.body.classList.remove(`page-enter-${direction}`);
      window.sessionStorage.removeItem("portfolio-route-direction");
    }, 620);
  }

  document.querySelectorAll('a[href="index.html"], a[href="index.html#top"], a[href="about.html"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = link.getAttribute("href");
      if (!target) return;

      const isAboutLink = target === "about.html";
      const isAlreadyAbout = window.location.pathname.endsWith("/about.html");
      const isAlreadyHome = window.location.pathname.endsWith("/index.html") ||
        window.location.pathname.endsWith("/");

      if ((isAboutLink && isAlreadyAbout) || (!isAboutLink && isAlreadyHome)) return;

      event.preventDefault();

      const routeDirection = isAboutLink ? "forward" : "back";
      window.sessionStorage.setItem("portfolio-route-direction", routeDirection);
      document.documentElement.dataset.routeDirection = routeDirection;

      if (!document.startViewTransition) {
        document.body.classList.add(`page-leaving-${routeDirection}`);
      }

      window.setTimeout(() => {
        window.location.href = target;
      }, document.startViewTransition ? 20 : 280);
    });
  });

  // --- Contact Popover & Copy Email ---
  const menu = document.querySelector(".contact-menu");

  if (menu) {
    const trigger = menu.querySelector(".say-hi");
    const card = menu.querySelector(".contact-card");
    let copyTimeout = null;

    const setMenu = (open) => {
      card.hidden = !open;
      trigger.setAttribute("aria-expanded", String(open));
    };

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      setMenu(card.hidden);
    });

    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target)) {
        setMenu(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !card.hidden) {
        setMenu(false);
        trigger.focus();
      }
    });

    const copyBtn = menu.querySelector(".copy-email");
    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        const label = copyBtn.querySelector("small");
        const email = copyBtn.dataset.email || "akanshrawat.in@gmail.com";

        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(email);
          } else {
            throw new Error("Clipboard API unavailable");
          }
        } catch {
          const textarea = document.createElement("textarea");
          textarea.value = email;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          textarea.style.pointerEvents = "none";
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand("copy");
          } catch {
            // Silently fail if blocked
          }
          textarea.remove();
        }

        if (label) {
          label.textContent = "copied";
          if (copyTimeout) clearTimeout(copyTimeout);
          copyTimeout = window.setTimeout(() => {
            label.textContent = "copy";
          }, 1800);
        }
      });
    }
  }

  // --- Smooth Scroll & Navigation for Home & Work ---
  const isHomePage =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname.endsWith("/") ||
    document.getElementById("home") !== null;

  if (isHomePage) {
    const workSection = document.getElementById("work");

    // Intercept clicks on top/home links to guarantee smooth scroll to top
    document.querySelectorAll('.signature, a[href="#top"], a[href="index.html#top"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (window.history.pushState) {
          window.history.pushState(null, "", window.location.pathname);
        }
      });
    });

    // Intercept clicks to #work
    document.querySelectorAll('a[href="#work"], a[href="index.html#work"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        if (workSection) {
          event.preventDefault();
          workSection.scrollIntoView({ behavior: "smooth", block: "start" });
          if (window.history.pushState) {
            window.history.pushState(null, "", "#work");
          }
        }
      });
    });

    // Handle hash on page load
    if (window.location.hash === "#work" && workSection) {
      window.setTimeout(() => {
        workSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }

  // --- Accessible Questions Accordion ---
  const questionItems = document.querySelectorAll(".question-item");

  if (questionItems.length) {
    questionItems.forEach((item) => {
      const trigger = item.querySelector(".question-trigger");
      const answer = item.querySelector(".question-answer");

      if (!trigger || !answer) return;

      if (item.classList.contains("is-open")) {
        answer.hidden = false;
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      } else {
        answer.style.maxHeight = "0px";
      }

      trigger.addEventListener("click", () => {
        const willOpen = !item.classList.contains("is-open");

        questionItems.forEach((otherItem) => {
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
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
          answer.hidden = false;
          answer.style.maxHeight = "0px";
          requestAnimationFrame(() => {
            answer.style.maxHeight = `${answer.scrollHeight}px`;
          });
        }
      });
    });
  }

  // --- Visitor Counter Fallback Protection ---
  const counterImg = document.querySelector(".visitor-counter img");
  if (counterImg) {
    counterImg.addEventListener("error", () => {
      const parent = counterImg.closest(".visitor-counter");
      if (parent) {
        parent.style.display = "none";
      }
    });
  }
})();
