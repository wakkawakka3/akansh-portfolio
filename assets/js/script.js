/**
 * Akansh Rawat Portfolio Scripts
 * Handles accessible contact popover, clipboard interactions, and smooth navigation.
 */
(() => {
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
