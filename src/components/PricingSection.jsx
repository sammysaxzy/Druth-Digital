import { PlanCard } from "./PlanCard.jsx";

export function PricingSection({ plansByCategory, onSubscribe }) {
  return (
    <section className="pricing-section">
      {Object.entries(plansByCategory).map(([key, category]) => (
        <div key={key} className="pricing-section__group">
          <div className="pricing-section__heading">
            <p>{category.label}</p>
            <h2>{category.label} Broadband Plans</h2>
          </div>

          <div className="pricing-section__grid">
            {category.plans.map((plan) => (
              <PlanCard
                key={`${category.label}-${plan.name}`}
                plan={plan}
                category={category.label}
                onSubscribe={onSubscribe}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
