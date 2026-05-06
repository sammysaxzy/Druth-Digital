import { broadbandPlans } from "../data/plans.js";
import { createPlanCard } from "../components/PlanCard.jsx";

export function renderBroadbandPlans() {
  return Object.entries(broadbandPlans)
    .map(([key, category]) => `
      <div class="plan-panel${key === "residential" ? " is-active" : ""}" id="${key}" role="tabpanel" aria-labelledby="tab-btn-${key}">
        <div class="plans-grid">
          ${category.plans.map((plan) => createPlanCard(plan, category.label)).join("")}
        </div>
      </div>
    `)
    .join("");
}

