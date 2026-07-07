const root = document.documentElement;
const body = document.body;
const header = document.querySelector(".header");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const toastStack = document.getElementById("toast-stack");

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const WHATSAPP_CHAT_CONFIG = {
    // Update this number in one place if the company WhatsApp complaint line changes later.
    phoneNumber: "2349065197058",
    // Update this message if you want a different default text in WhatsApp.
    message: "Hello Druth Digital Support, I need help with a complaint or request."
};

function initTheme() {
    root.setAttribute("data-theme", "dark");
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

function createWhatsAppUrl(phoneNumber, message) {
    const sanitizedPhone = String(phoneNumber).replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${sanitizedPhone}?text=${encodedMessage}`;
}

function syncWhatsAppLinks() {
    const { phoneNumber, message } = WHATSAPP_CHAT_CONFIG;
    const whatsappUrl = createWhatsAppUrl(phoneNumber, message);
    const selectors = [
        'a[data-whatsapp-link]',
        'a[href*="wa.me/"]',
        'a[href*="api.whatsapp.com/"]'
    ];

    document.querySelectorAll(selectors.join(", ")).forEach((link) => {
        link.href = whatsappUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    });
}

function initWhatsAppChat() {
    const { phoneNumber, message } = WHATSAPP_CHAT_CONFIG;

    if (!phoneNumber || document.querySelector("[data-whatsapp-chat-button]")) {
        return;
    }

    const style = document.createElement("style");
    style.textContent = `
        .whatsapp-chat-button {
            position: fixed;
            right: 1.25rem;
            bottom: 1.25rem;
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.95rem 1.15rem;
            border: 0;
            border-radius: 999px;
            background: linear-gradient(135deg, #25d366 0%, #128c4a 100%);
            color: #ffffff;
            box-shadow: 0 18px 38px rgba(18, 140, 74, 0.28);
            z-index: 1400;
            transition: transform var(--transition-fast, 180ms ease), box-shadow var(--transition-fast, 180ms ease), filter var(--transition-fast, 180ms ease);
        }

        .whatsapp-chat-button:hover,
        .whatsapp-chat-button:focus-visible {
            transform: translateY(-2px) scale(1.03);
            box-shadow: 0 22px 46px rgba(18, 140, 74, 0.34);
            filter: brightness(1.05);
        }

        .whatsapp-chat-button:focus-visible {
            outline: 3px solid rgba(255, 255, 255, 0.3);
            outline-offset: 3px;
        }

        .whatsapp-chat-button__icon {
            display: inline-grid;
            place-items: center;
            width: 2.7rem;
            height: 2.7rem;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.16);
            flex-shrink: 0;
        }

        .whatsapp-chat-button__icon svg {
            width: 1.4rem;
            height: 1.4rem;
            fill: currentColor;
        }

        .whatsapp-chat-button__text {
            display: flex;
            flex-direction: column;
            line-height: 1.15;
        }

        .whatsapp-chat-button__eyebrow {
            font-size: 0.68rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            opacity: 0.82;
        }

        .whatsapp-chat-button__label {
            font-size: 0.95rem;
            font-weight: 700;
            white-space: nowrap;
        }

        @media (max-width: 640px) {
            .whatsapp-chat-button {
                right: 1rem;
                bottom: 1rem;
                padding: 0.9rem;
            }

            .whatsapp-chat-button__text {
                display: none;
            }
        }
    `;

    const button = document.createElement("a");
    button.href = createWhatsAppUrl(phoneNumber, message);
    button.className = "whatsapp-chat-button";
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.setAttribute("aria-label", "Chat with us on WhatsApp");
    button.setAttribute("data-whatsapp-chat-button", "true");
    button.innerHTML = `
        <span class="whatsapp-chat-button__icon" aria-hidden="true">
            <svg viewBox="0 0 32 32" role="img" aria-hidden="true">
                <path d="M19.11 17.53c-.29-.14-1.72-.85-1.99-.95-.27-.1-.46-.14-.66.14-.19.29-.76.95-.93 1.14-.17.19-.34.22-.63.07-.29-.14-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.12-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.66-1.59-.9-2.18-.24-.57-.49-.49-.66-.5h-.56c-.19 0-.51.07-.78.36-.27.29-1.02.99-1.02 2.41s1.05 2.79 1.19 2.99c.14.19 2.05 3.13 4.97 4.39.7.3 1.24.48 1.67.62.7.22 1.34.19 1.85.12.57-.08 1.72-.7 1.97-1.37.24-.66.24-1.22.17-1.37-.07-.14-.27-.22-.56-.36Z"></path>
                <path d="M27.27 4.69A15.8 15.8 0 0 0 16.02 0C7.3 0 .2 7.09.2 15.81c0 2.79.73 5.51 2.12 7.91L0 32l8.49-2.22a15.75 15.75 0 0 0 7.53 1.92h.01c8.72 0 15.82-7.09 15.82-15.81 0-4.22-1.64-8.18-4.58-11.2Zm-11.24 24.3h-.01a13.1 13.1 0 0 1-6.68-1.83l-.48-.29-5.04 1.32 1.35-4.91-.31-.5A13.05 13.05 0 0 1 2.9 15.81C2.9 8.58 8.79 2.69 16.03 2.69c3.51 0 6.8 1.37 9.28 3.85a13.02 13.02 0 0 1 3.85 9.27c0 7.23-5.89 13.12-13.13 13.12Z"></path>
            </svg>
        </span>
        <span class="whatsapp-chat-button__text">
            <span class="whatsapp-chat-button__eyebrow">WhatsApp</span>
            <span class="whatsapp-chat-button__label">Chat with us</span>
        </span>
    `;

    document.head.appendChild(style);
    document.body.appendChild(button);
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
syncWhatsAppLinks();
initWhatsAppChat();

window.addEventListener("scroll", updateHeaderState, { passive: true });

window.DruthSite = {
    activatePlanTab,
    createWhatsAppUrl,
    formatTimestamp: () => new Date().toLocaleString(),
    setButtonLoading,
    showToast,
    whatsappChatConfig: WHATSAPP_CHAT_CONFIG
};
