const ui = window.DruthSite || {};
const COMPANY_EMAIL = "druthdigital@gmail.com";

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^[+]?[0-9()\-\s]{7,20}$/.test(phone);
}

function buildMailtoLink(subject, lines) {
    const body = lines.filter(Boolean).join("\n");
    return `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function applyPlanPrefillFromQuery() {
    const form = document.getElementById("contact-inquiry-form");
    if (!form) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const planField = form.querySelector("#contact-plan");
    const messageField = form.querySelector("#contact-message");

    const plan = params.get("plan");
    const category = params.get("category");
    const speed = params.get("speed");
    const price = params.get("price");

    if (!plan && !category) {
        return;
    }

    if (planField && plan) {
        planField.value = category ? `${category} - ${plan}` : plan;
    }

    if (messageField && !messageField.value.trim()) {
        messageField.value = [
            "I am interested in a plan inquiry.",
            plan ? `Plan: ${plan}` : "",
            category ? `Category: ${category}` : "",
            speed ? `Speed: ${speed}` : "",
            price ? `Price: ${price}` : ""
        ].filter(Boolean).join("\n");
    }
}

function attachContactFormHandler() {
    const form = document.getElementById("contact-inquiry-form");
    if (!form) {
        return;
    }

    applyPlanPrefillFromQuery();

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const payload = {
            name: form.querySelector("#contact-name")?.value.trim() || "",
            email: form.querySelector("#contact-email")?.value.trim() || "",
            phone: form.querySelector("#contact-phone")?.value.trim() || "",
            plan: form.querySelector("#contact-plan")?.value.trim() || "",
            location: form.querySelector("#contact-location")?.value.trim() || "",
            message: form.querySelector("#contact-message")?.value.trim() || "",
            company: "",
        };
        const consent = form.querySelector("#contact-consent")?.checked;

        if (!payload.name || !payload.email || !payload.message) {
            ui.showToast?.("Missing details", "Please complete your name, email, and message before sending.", "error");
            return;
        }

        if (!validateEmail(payload.email)) {
            ui.showToast?.("Email needed", "Please enter a valid email address before sending the form.", "error");
            return;
        }

        if (payload.phone && !validatePhone(payload.phone)) {
            ui.showToast?.("Phone needed", "Please enter a valid phone number before sending the form.", "error");
            return;
        }

        if (!consent) {
            ui.showToast?.("Consent required", "Please confirm that Druth can use your information to respond.", "error");
            return;
        }

        const serviceType = payload.plan || "General Inquiry";
        const subject = `New Contact Request from Druth Website - ${serviceType}`;
        const subjectField = form.querySelector("#contact-subject");
        const replyToField = form.querySelector("#contact-replyto");
        const messageLines = [
            payload.message,
            "",
            `Name: ${payload.name}`,
            `Email: ${payload.email}`,
            `Phone: ${payload.phone || "Not provided"}`,
            `Selected Plan: ${payload.plan || "Not selected"}`,
            `Location: ${payload.location || "Not provided"}`,
            `Timestamp: ${ui.formatTimestamp ? ui.formatTimestamp() : new Date().toLocaleString()}`,
            `Page: ${window.location.href}`
        ];

        if (subjectField) {
            subjectField.value = subject;
        }

        if (replyToField) {
            replyToField.value = payload.email;
        }

        ui.setButtonLoading?.(submitButton, true, "Sending...");

        try {
            HTMLFormElement.prototype.submit.call(form);
        } catch (error) {
            ui.showToast?.(
                "Send failed",
                "Your email app will open so you can still send this to Druth directly.",
                "error"
            );

            window.setTimeout(() => {
                window.location.href = buildMailtoLink(subject, messageLines);
            }, 500);
            ui.setButtonLoading?.(submitButton, false);
        }
    });
}

attachContactFormHandler();
