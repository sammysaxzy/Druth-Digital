import { broadbandPlans } from "../src/data/plans.js";

const ui = window.DruthSite || {};
const COMPANY_EMAIL = "druthdigital@gmail.com";
const PHONE_PATTERN = /^[+]?[0-9()\-\s]{7,20}$/;

let selectedPlan = null;
let lastFocusedButton = null;

function formatCurrency(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(value);
}

function getTotalCost(plan) {
  return plan.monthly + plan.installation;
}

function buildPlanLabel(plan) {
  return `${plan.category} - ${plan.name} (${plan.speed}, ${formatCurrency(plan.monthly)}/month)`;
}

function createPlanCard(plan, category) {
  const totalCost = getTotalCost(plan);

  return `
    <article class="plan-card" data-reveal>
      <div class="plan-meta">
        <span><i class="fa-solid fa-layer-group"></i> ${category}</span>
        <span><i class="fa-solid fa-wifi"></i> ${plan.speed}</span>
      </div>
      <h3 class="plan-title">${plan.name}</h3>
      <p class="plan-copy">Built for dependable connectivity with unlimited data and a simple setup path.</p>
      <div class="plan-price">
        <strong>${formatCurrency(plan.monthly)}</strong>
        <span>/ month</span>
      </div>
      <ul class="plan-feature-list broadband-feature-list">
        <li><i class="fa-solid fa-check"></i> Installation: ${formatCurrency(plan.installation)}</li>
        <li><i class="fa-solid fa-check"></i> Speed: ${plan.speed}</li>
        <li><i class="fa-solid fa-check"></i> Data: ${plan.data}</li>
        <li><i class="fa-solid fa-check"></i> Devices: ${plan.devices}</li>
      </ul>
      <div class="plan-total">
        <span>Total first payment</span>
        <strong>${formatCurrency(totalCost)}</strong>
      </div>
      <button
        class="btn-primary plan-select"
        type="button"
        data-plan="${plan.name}"
        data-category="${category}"
        data-speed="${plan.speed}"
        data-monthly="${plan.monthly}"
        data-installation="${plan.installation}"
        data-data="${plan.data}"
        data-devices="${plan.devices}"
        data-total="${totalCost}"
      >
        Get Started
      </button>
    </article>
  `;
}

function renderSummaryCards() {
  const summaryContainer = document.getElementById("broadband-summary");
  if (!summaryContainer) {
    return;
  }

  const categories = Object.values(broadbandPlans);
  summaryContainer.innerHTML = categories.map((category) => {
    const lowestMonthly = Math.min(...category.plans.map((plan) => plan.monthly));
    const highestSpeed = category.plans.reduce((max, plan) => {
      const speedValue = Number.parseInt(plan.speed, 10);
      return speedValue > max ? speedValue : max;
    }, 0);

    return `
      <div class="info-panel">
        <strong>${category.label}</strong>
        <p>Starts from ${formatCurrency(lowestMonthly)} monthly with speeds up to ${highestSpeed} Mbps.</p>
      </div>
    `;
  }).join("");
}

function renderPlanPanels() {
  const panelsContainer = document.getElementById("broadband-plan-panels");
  if (!panelsContainer) {
    return;
  }

  panelsContainer.innerHTML = Object.entries(broadbandPlans)
    .map(([key, category]) => `
      <div class="plan-panel${key === "residential" ? " is-active" : ""}" id="${key}" role="tabpanel" aria-labelledby="tab-btn-${key}">
        <div class="plans-grid">
          ${category.plans.map((plan) => createPlanCard(plan, category.label)).join("")}
        </div>
      </div>
    `)
    .join("");
}

function triggerRevealRefresh() {
  document.querySelectorAll(".plan-card[data-reveal]").forEach((card) => {
    card.classList.add("is-visible");
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return PHONE_PATTERN.test(phone);
}

function getModalElements() {
  return {
    modal: document.getElementById("plan-request-modal"),
    form: document.getElementById("plan-request-form"),
    summary: document.getElementById("plan-request-summary"),
    planField: document.getElementById("plan-selected-name"),
    successBanner: document.getElementById("plan-request-success")
  };
}

function updateModalSummary(plan) {
  const { summary, planField } = getModalElements();
  if (!summary || !planField) {
    return;
  }

  planField.value = buildPlanLabel(plan);
  summary.innerHTML = `
    <strong>${plan.name}</strong>
    <p>${plan.category} plan with ${plan.speed}, ${plan.data} data, and support for ${plan.devices}.</p>
    <p>Monthly: ${formatCurrency(plan.monthly)} | Installation: ${formatCurrency(plan.installation)} | Total first payment: ${formatCurrency(plan.total)}</p>
  `;
}

function openModal(plan, triggerButton) {
  const { modal, form, successBanner } = getModalElements();
  if (!modal || !form) {
    return;
  }

  selectedPlan = plan;
  lastFocusedButton = triggerButton || document.activeElement;
  updateModalSummary(plan);

  if (successBanner) {
    successBanner.hidden = true;
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  window.setTimeout(() => {
    form.querySelector("#plan-full-name")?.focus();
  }, 60);
}

function closeModal() {
  const { modal, form, successBanner } = getModalElements();
  if (!modal) {
    return;
  }

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (form) {
    form.reset();
  }

  if (successBanner) {
    successBanner.hidden = true;
  }

  if (lastFocusedButton instanceof HTMLElement) {
    lastFocusedButton.focus();
  }
}

function buildFallbackMailto(payload) {
  const lines = [
    "New internet plan request",
    "",
    `Full Name: ${payload.name}`,
    `Phone Number: ${payload.phone}`,
    `Email: ${payload.email}`,
    `Installation Address: ${payload.address}`,
    `Selected Plan: ${payload.plan}`,
    `Additional Notes: ${payload.notes || "None"}`
  ];

  return `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent("New Internet Plan Request")}&body=${encodeURIComponent(lines.join("\n"))}`;
}

function attachSelectionHandlers() {
  document.querySelectorAll(".plan-select").forEach((button) => {
    button.addEventListener("click", () => {
      openModal({
        name: button.dataset.plan || "",
        category: button.dataset.category || "",
        speed: button.dataset.speed || "",
        monthly: Number(button.dataset.monthly || 0),
        installation: Number(button.dataset.installation || 0),
        data: button.dataset.data || "Unlimited",
        devices: button.dataset.devices || "",
        total: Number(button.dataset.total || 0)
      }, button);
    });
  });
}

function attachModalHandlers() {
  const { modal, form, successBanner } = getModalElements();
  if (!modal || !form) {
    return;
  }

  modal.querySelectorAll("[data-modal-close]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!selectedPlan) {
      ui.showToast?.("Plan required", "Please select an internet plan first.", "error");
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const replyToField = form.querySelector("#plan-replyto");
    const payload = {
      name: form.querySelector("#plan-full-name")?.value.trim() || "",
      phone: form.querySelector("#plan-phone-number")?.value.trim() || "",
      email: form.querySelector("#plan-email-address")?.value.trim() || "",
      address: form.querySelector("#plan-installation-address")?.value.trim() || "",
      plan: form.querySelector("#plan-selected-name")?.value.trim() || "",
      notes: form.querySelector("#plan-additional-notes")?.value.trim() || "",
      company: form.querySelector("#plan-company")?.value.trim() || ""
    };

    if (!payload.name || !payload.phone || !payload.email || !payload.address || !payload.plan) {
      ui.showToast?.("Missing details", "Please complete all required fields before submitting.", "error");
      return;
    }

    if (!validateEmail(payload.email)) {
      ui.showToast?.("Invalid email", "Please enter a valid email address.", "error");
      return;
    }

    if (!validatePhone(payload.phone)) {
      ui.showToast?.("Invalid phone", "Please enter a valid phone number.", "error");
      return;
    }

    ui.setButtonLoading?.(submitButton, true, "Submitting...");

    if (replyToField) {
      replyToField.value = payload.email;
    }

    try {
      HTMLFormElement.prototype.submit.call(form);
    } catch (error) {
      ui.showToast?.("Submission failed", "Your email app will open so you can still send the request to Druth directly.", "error");
      window.setTimeout(() => {
        window.location.href = buildFallbackMailto(payload);
      }, 500);
      ui.setButtonLoading?.(submitButton, false);
    }
  });
}

renderSummaryCards();
renderPlanPanels();
attachSelectionHandlers();
attachModalHandlers();
triggerRevealRefresh();
