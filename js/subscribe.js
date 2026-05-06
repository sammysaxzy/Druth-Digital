const STORAGE_KEY = "druth-selected-plan";
const ui = window.DruthSite || {};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(value);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getSelectedPlan() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch (error) {
    return null;
  }
}

function buildPlanLabel(plan) {
  if (!plan) {
    return "";
  }

  return `${plan.category} - ${plan.name} (${plan.speed}, ${formatCurrency(plan.monthly)}/month)`;
}

function populatePlanSummary(plan) {
  const planField = document.getElementById("subscribe-plan");
  const planSummary = document.getElementById("selected-plan-summary");

  if (!plan) {
    if (planField) {
      planField.value = "No plan selected";
    }
    if (planSummary) {
      planSummary.innerHTML = `
        <strong>No broadband plan selected yet.</strong>
        <p>Return to the plans page to choose a residential or SME package first.</p>
      `;
    }
    return;
  }

  if (planField) {
    planField.value = buildPlanLabel(plan);
  }

  if (planSummary) {
    planSummary.innerHTML = `
      <strong>${plan.name}</strong>
      <p>${plan.category} plan with ${plan.speed}, ${plan.data} data, and support for ${plan.devices}.</p>
      <p>Monthly: ${formatCurrency(plan.monthly)} | Installation: ${formatCurrency(plan.installation)} | Total first payment: ${formatCurrency(plan.total)}</p>
    `;
  }
}

function attachSubscribeHandler() {
  const form = document.getElementById("subscribe-form");
  if (!form) {
    return;
  }

  const plan = getSelectedPlan();
  populatePlanSummary(plan);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const name = form.querySelector("#subscribe-name")?.value.trim() || "";
    const email = form.querySelector("#subscribe-email")?.value.trim() || "";
    const phone = form.querySelector("#subscribe-phone")?.value.trim() || "";
    const address = form.querySelector("#subscribe-address")?.value.trim() || "";
    const planValue = form.querySelector("#subscribe-plan")?.value.trim() || "";
    const replyToField = document.getElementById("subscribe-replyto");

    if (!name || !email || !phone || !address || !planValue || !plan) {
      ui.showToast?.("Missing details", "Please choose a plan and complete all required fields before submitting.", "error");
      return;
    }

    if (!validateEmail(email)) {
      ui.showToast?.("Email needed", "Please enter a valid email address before submitting.", "error");
      return;
    }

    if (replyToField) {
      replyToField.value = email;
    }

    ui.setButtonLoading?.(submitButton, true, "Submitting...");
    localStorage.removeItem(STORAGE_KEY);
    form.submit();
  });
}

attachSubscribeHandler();
