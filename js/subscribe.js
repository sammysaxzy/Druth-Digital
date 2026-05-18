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

function validatePhone(phone) {
  return /^[+]?[0-9()\-\s]{7,20}$/.test(phone);
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
      <p>Monthly subscription: ${formatCurrency(plan.monthly)} | Standard installation: ${formatCurrency(plan.installation)} | First payment: ${formatCurrency(plan.total)}</p>
    `;
  }
}

async function submitSubscription(form, payload) {
  const response = await fetch(form.action, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  });

  let result = {};
  try {
    result = await response.json();
  } catch (error) {
    result = {};
  }

  if (!response.ok) {
    throw new Error(result.message || "Unable to send your request right now.");
  }

  return result;
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
    const notes = form.querySelector("#subscribe-notes")?.value.trim() || "";
    const company = form.querySelector("#subscribe-company")?.value.trim() || "";

    if (!name || !email || !phone || !address || !planValue || !plan) {
      ui.showToast?.("Missing details", "Please choose a plan and complete all required fields before submitting.", "error");
      return;
    }

    if (!validateEmail(email)) {
      ui.showToast?.("Email needed", "Please enter a valid email address before submitting.", "error");
      return;
    }

    if (!validatePhone(phone)) {
      ui.showToast?.("Phone needed", "Please enter a valid phone number before submitting.", "error");
      return;
    }

    ui.setButtonLoading?.(submitButton, true, "Submitting...");

    try {
      const result = await submitSubscription(form, {
        name,
        email,
        phone,
        address,
        plan: planValue,
        notes,
        company
      });

      localStorage.removeItem(STORAGE_KEY);
      ui.showToast?.("Request sent", result.message || "Your request has been received. We will contact you shortly.", "success");
      form.reset();
      populatePlanSummary(null);
      const planField = document.getElementById("subscribe-plan");
      if (planField) {
        planField.value = "No plan selected";
      }
    } catch (error) {
      ui.showToast?.("Submission failed", error.message || "Unable to send your request right now. Please try again shortly.", "error");
    } finally {
      ui.setButtonLoading?.(submitButton, false);
    }
  });
}

attachSubscribeHandler();
