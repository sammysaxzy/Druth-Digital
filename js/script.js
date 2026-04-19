const root = document.documentElement;
const body = document.body;
const header = document.querySelector(".header");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const themeToggle = document.getElementById("theme-toggle");
const toastStack = document.getElementById("toast-stack");

const THEME_KEY = "druth-theme";
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const preferredLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const theme = savedTheme || (preferredLight ? "light" : "dark");
    root.setAttribute("data-theme", theme);
}

function toggleTheme() {
    const nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
}

function showToast(title, message, type = "info") {
    if (!toastStack) {
        return;
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-title">
            <i class="fa-solid ${type === "success" ? "fa-circle-check" : type === "error" ? "fa-circle-exclamation" : "fa-circle-info"}"></i>
            <span>${title}</span>
        </div>
        <p>${message}</p>
    `;

    toastStack.appendChild(toast);

    window.setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        window.setTimeout(() => toast.remove(), 250);
    }, 4200);
}

function setButtonLoading(button, isLoading, loadingLabel = "Working...") {
    if (!button) {
        return;
    }

    if (isLoading) {
        button.dataset.originalHtml = button.innerHTML;
        button.disabled = true;
        button.classList.add("is-loading");
        button.innerHTML = `<span class="button-spinner" aria-hidden="true"></span><span>${loadingLabel}</span>`;
        return;
    }

    button.disabled = false;
    button.classList.remove("is-loading");
    if (button.dataset.originalHtml) {
        button.innerHTML = button.dataset.originalHtml;
    }
}

function closeMobileMenu() {
    if (!navMenu || !navToggle) {
        return;
    }

    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
}

function openMobileMenu() {
    if (!navMenu || !navToggle) {
        return;
    }

    navMenu.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
}

function updateHeaderState() {
    if (!header) {
        return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 18);
}

function revealElements() {
    const revealTargets = document.querySelectorAll("[data-reveal]");
    if (!revealTargets.length) {
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);

            if (entry.target.hasAttribute("data-animate-speed")) {
                entry.target.classList.add("is-animated");
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });

    revealTargets.forEach((target) => revealObserver.observe(target));

    document.querySelectorAll("[data-animate-speed]").forEach((target) => revealObserver.observe(target));
}

function activatePlanTab(targetId, syncHash = true) {
    const buttons = document.querySelectorAll("[data-tab-target]");
    const panels = document.querySelectorAll(".plan-panel");

    if (!buttons.length || !panels.length) {
        return;
    }

    buttons.forEach((button) => {
        const isActive = button.dataset.tabTarget === targetId;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
        button.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.id === targetId);
    });

    if (syncHash && window.location.pathname.endsWith("services.html")) {
        history.replaceState(null, "", `#${targetId}`);
    }
}

function initPlanTabs() {
    const buttons = document.querySelectorAll("[data-tab-target]");
    if (!buttons.length) {
        return;
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            activatePlanTab(button.dataset.tabTarget);
        });
    });

    const openFromHash = () => {
        const hash = window.location.hash.replace("#", "");
        if (hash && document.getElementById(hash)?.classList.contains("plan-panel")) {
            activatePlanTab(hash, false);
            document.getElementById("plans")?.scrollIntoView({ behavior: REDUCED_MOTION ? "auto" : "smooth", block: "start" });
        }
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
}

function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const href = anchor.getAttribute("href");
            if (!href || href === "#") {
                return;
            }

            const id = href.slice(1);
            const target = document.getElementById(id);

            if (!target) {
                return;
            }

            event.preventDefault();
            if (target.classList.contains("plan-panel")) {
                activatePlanTab(id, false);
                document.getElementById("plans")?.scrollIntoView({ behavior: REDUCED_MOTION ? "auto" : "smooth", block: "start" });
                history.replaceState(null, "", `#${id}`);
                return;
            }

            const headerOffset = header ? header.offsetHeight + 12 : 0;
            const offsetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({
                top: offsetTop,
                behavior: REDUCED_MOTION ? "auto" : "smooth"
            });
            history.replaceState(null, "", href);
        });
    });
}

function initPageTransitions() {
    document.querySelectorAll("a[href]").forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
                return;
            }

            if (link.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            const url = new URL(link.href, window.location.href);
            if (url.origin !== window.location.origin) {
                return;
            }

            event.preventDefault();
            body.classList.add("is-leaving");
            window.setTimeout(() => {
                window.location.href = url.href;
            }, REDUCED_MOTION ? 0 : 220);
        });
    });
}

function initLoader() {
    const ready = () => {
        body.classList.add("is-ready");
    };

    if (document.readyState === "complete") {
        ready();
    } else {
        window.addEventListener("load", ready, { once: true });
    }
}

function initNav() {
    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            const expanded = navToggle.getAttribute("aria-expanded") === "true";
            expanded ? closeMobileMenu() : openMobileMenu();
        });
    }

    document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });
}

initTheme();
updateHeaderState();
initLoader();
initNav();
initPlanTabs();
initSmoothAnchors();
initPageTransitions();
revealElements();

window.addEventListener("scroll", updateHeaderState, { passive: true });

if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
}

window.DruthSite = {
    activatePlanTab,
    formatTimestamp: () => new Date().toLocaleString(),
    setButtonLoading,
    showToast
};
