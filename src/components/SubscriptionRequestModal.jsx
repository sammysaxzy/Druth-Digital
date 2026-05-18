import { LoadingButton } from "./LoadingButton.jsx";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(value);
}

export function SubscriptionRequestModal({
  selectedPlan,
  isOpen,
  onClose,
  formValues,
  submissionState,
  onChange,
  onSubmit
}) {
  if (!isOpen || !selectedPlan) {
    return null;
  }

  return (
    <div className="subscription-modal">
      <div className="subscription-modal__backdrop" onClick={onClose} />
      <div className="subscription-modal__panel" role="dialog" aria-modal="true" aria-labelledby="subscription-title">
        <button type="button" className="subscription-modal__close" onClick={onClose}>
          Close
        </button>

        <div className="subscription-modal__header">
          <p className="subscription-modal__eyebrow">Complete Your Request</p>
          <h2 id="subscription-title">{selectedPlan.category} - {selectedPlan.name}</h2>
          <p>
            Monthly subscription: {formatCurrency(selectedPlan.monthly)}.
            One-time installation: {formatCurrency(selectedPlan.installation)}.
          </p>
          {selectedPlan.promoInstallation ? (
            <p>Limited-time residential promo installation: {formatCurrency(selectedPlan.promoInstallation)}.</p>
          ) : null}
        </div>

        <form className="subscription-form" onSubmit={onSubmit}>
          <div className="subscription-form__grid">
            <label>
              Full Name
              <input name="fullName" value={formValues.fullName} onChange={onChange} required />
            </label>
            <label>
              Phone Number
              <input name="phoneNumber" value={formValues.phoneNumber} onChange={onChange} required />
            </label>
            <label>
              Email Address
              <input name="emailAddress" type="email" value={formValues.emailAddress} onChange={onChange} required />
            </label>
            <label>
              Preferred Installation Date
              <input
                name="preferredInstallationDate"
                type="date"
                value={formValues.preferredInstallationDate}
                onChange={onChange}
              />
            </label>
          </div>

          <label>
            Home Address
            <input name="homeAddress" value={formValues.homeAddress} onChange={onChange} required />
          </label>

          <label>
            Additional Message
            <textarea
              name="additionalMessage"
              rows="4"
              value={formValues.additionalMessage}
              onChange={onChange}
              placeholder="Any extra installation details or access notes"
            />
          </label>

          {submissionState.message ? (
            <div className={`subscription-form__feedback subscription-form__feedback--${submissionState.status}`}>
              {submissionState.message}
            </div>
          ) : null}

          <LoadingButton type="submit" isLoading={submissionState.status === "loading"} className="subscription-form__submit">
            Submit Request
          </LoadingButton>
        </form>
      </div>
    </div>
  );
}
