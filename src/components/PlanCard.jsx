const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0
});

export function formatCurrency(value) {
  return naira.format(value);
}

export function getTotalCost(plan) {
  return plan.monthly + plan.installation;
}

export function createPlanCard(plan, category) {
  const totalCost = getTotalCost(plan);

  return `
    <article class="plan-card" data-reveal>
      <div class="plan-meta">
        <span><i class="fa-solid fa-layer-group"></i> ${category}</span>
        <span><i class="fa-solid fa-wifi"></i> ${plan.speed}</span>
      </div>
      <h3 class="plan-title">${plan.name}</h3>
      <p class="plan-copy">Clear monthly subscription pricing, separate installation fees, and dependable unlimited connectivity.</p>
      <div class="plan-price">
        <strong>${formatCurrency(plan.monthly)}</strong>
        <span>/ monthly subscription</span>
      </div>
      <ul class="plan-feature-list broadband-feature-list">
        <li><i class="fa-solid fa-check"></i> Monthly subscription: ${formatCurrency(plan.monthly)}</li>
        <li><i class="fa-solid fa-check"></i> Standard installation: ${formatCurrency(plan.installation)}</li>
        <li><i class="fa-solid fa-check"></i> Speed: ${plan.speed}</li>
        <li><i class="fa-solid fa-check"></i> Data: ${plan.data}</li>
        <li><i class="fa-solid fa-check"></i> Devices: ${plan.devices}</li>
      </ul>
      <div class="plan-total">
        <span>First payment at standard rate</span>
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

