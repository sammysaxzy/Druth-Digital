const EMAIL_CONFIG = {
    publicKey: "zMSgG5f7u8T9XFoCb",
    serviceId: "druth_gmail_service",
    templateId: "template_mx7dcb6",
    inbox: "druthdigital@gmail.com"
};

const ui = window.DruthSite || {};
let emailReady = false;

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function initEmailJs() {
    if (!window.emailjs) {
        return;
    }

    if (!emailReady) {
        window.emailjs.init({
            publicKey: EMAIL_CONFIG.publicKey
        });
        emailReady = true;
    }
}

function sendEmail(params) {
    initEmailJs();

    if (!emailReady) {
        return Promise.reject(new Error("EmailJS is not available."));
    }

    return window.emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, {
        to_email: EMAIL_CONFIG.inbox,
        recipient_email: EMAIL_CONFIG.inbox,
        reply_to: params.reply_to || params.from_email || EMAIL_CONFIG.inbox,
        from_name: params.from_name,
        from_email: params.from_email,
        phone: params.phone || "Not provided",
        service: params.service || "General Inquiry",
        subject: params.subject,
        message: params.message
    });
}

function buildMailtoLink(subject, lines) {
    const body = lines.filter(Boolean).join("\n");
    return `mailto:${EMAIL_CONFIG.inbox}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function attachPlanHandlers() {
    const planButtons = document.querySelectorAll(".plan-select");
    if (!planButtons.length) {
        return;
    }

    planButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const timestamp = ui.formatTimestamp ? ui.formatTimestamp() : new Date().toLocaleString();
            const planName = button.dataset.plan || "Unknown Plan";
            const category = button.dataset.category || "Unspecified";
            const speed = button.dataset.speed || "Not listed";
            const price = button.dataset.price || "Not listed";

            ui.setButtonLoading?.(button, true, "Sending...");

            const subject = `New ${category} plan request - ${planName}`;
            const messageLines = [
                "A plan was selected from the Druth website.",
                `Plan Name: ${planName}`,
                `Category: ${category}`,
                `Speed: ${speed}`,
                `Price: ${price}`,
                `Timestamp: ${timestamp}`,
                `Page: ${window.location.href}`
            ];

            try {
                await sendEmail({
                    from_name: "Druth Website",
                    from_email: EMAIL_CONFIG.inbox,
                    phone: "Not provided",
                    service: category,
                    subject,
                    message: messageLines.join("\n"),
                    reply_to: EMAIL_CONFIG.inbox
                });

                ui.showToast?.(
                    "Plan request sent",
                    `${planName} has been sent to the Druth team. You can also use the contact page for extra details.`,
                    "success"
                );
            } catch (error) {
                ui.showToast?.(
                    "Automatic email needs backup",
                    "The browser could not send this automatically, so your email app will open with the plan details filled in.",
                    "error"
                );

                window.setTimeout(() => {
                    window.location.href = buildMailtoLink(subject, messageLines);
                }, 500);
            } finally {
                ui.setButtonLoading?.(button, false);
            }
        });
    });
}

function applyPlanPrefillFromQuery() {
    const form = document.getElementById("contact-inquiry-form");
    if (!form) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const interestField = form.querySelector("#contact-interest");
    const messageField = form.querySelector("#contact-message");

    const plan = params.get("plan");
    const category = params.get("category");
    const speed = params.get("speed");
    const price = params.get("price");

    if (!plan && !category) {
        return;
    }

    if (interestField && category) {
        interestField.value = `${category} Plans`;
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

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const name = form.querySelector("#contact-name")?.value.trim() || "";
        const email = form.querySelector("#contact-email")?.value.trim() || "";
        const phone = form.querySelector("#contact-phone")?.value.trim() || "";
        const interest = form.querySelector("#contact-interest")?.value.trim() || "General Inquiry";
        const message = form.querySelector("#contact-message")?.value.trim() || "";
        const consent = form.querySelector("#contact-consent")?.checked;

        if (!name || !email || !message) {
            ui.showToast?.("Missing details", "Please complete your name, email, and message before sending.", "error");
            return;
        }

        if (!validateEmail(email)) {
            ui.showToast?.("Email needed", "Please enter a valid email address before sending the form.", "error");
            return;
        }

        if (!consent) {
            ui.showToast?.("Consent required", "Please confirm that Druth can use your information to respond.", "error");
            return;
        }

        const subject = `${interest} inquiry from ${name}`;
        const messageLines = [
            message,
            "",
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone || "Not provided"}`,
            `Interest: ${interest}`,
            `Timestamp: ${ui.formatTimestamp ? ui.formatTimestamp() : new Date().toLocaleString()}`,
            `Page: ${window.location.href}`
        ];

        ui.setButtonLoading?.(submitButton, true, "Sending...");

        try {
            await sendEmail({
                from_name: name,
                from_email: email,
                phone,
                service: interest,
                subject,
                message: messageLines.join("\n"),
                reply_to: email
            });

            ui.showToast?.(
                "Message sent",
                "Your details have been sent to Druth successfully. Expect a follow-up through the contact channel you shared.",
                "success"
            );
            form.reset();
        } catch (error) {
            ui.showToast?.(
                "Automatic send needs backup",
                "The browser could not send the form automatically, so your email app will open with the same message prefilled.",
                "error"
            );

            window.setTimeout(() => {
                window.location.href = buildMailtoLink(subject, messageLines);
            }, 500);
        } finally {
            ui.setButtonLoading?.(submitButton, false);
        }
    });
}

attachPlanHandlers();
attachContactFormHandler();
