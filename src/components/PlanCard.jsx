function formatCurrency(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(value);
}

export function PlanCard({ plan, category, onSubscribe }) {
  return (
    <article className="pricing-card">
      <div className="pricing-card__top">
        <span className="pricing-card__badge">{category}</span>
        <h3>{plan.name}</h3>
        <p>{plan.speed} with {plan.data}</p>
      </div>

      <div className="pricing-card__price">
        <strong>{formatCurrency(plan.monthly)}</strong>
        <span>Monthly Subscription</span>
      </div>

      <ul className="pricing-card__features">
        <li>Speed: {plan.speed}</li>
        <li>Devices: {plan.devices}</li>
        <li>One-time installation: {formatCurrency(plan.installation)}</li>
        {plan.promoInstallation ? (
          <li>Limited-time promo installation: {formatCurrency(plan.promoInstallation)}</li>
        ) : null}
      </ul>

      <button
        type="button"
        className="pricing-card__button"
        onClick={() => onSubscribe({ ...plan, category })}
      >
        Subscribe Now
      </button>
    </article>
  );
}
