import { useState } from "react";
import { broadbandPlans } from "../data/plans.js";
import { PricingSection } from "../components/PricingSection.jsx";
import { SubscriptionRequestModal } from "../components/SubscriptionRequestModal.jsx";
import { useSubscriptionRequest } from "../hooks/useSubscriptionRequest.js";
import "../styles/subscription.css";

export default function BroadbandPlansPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const {
    formValues,
    submissionState,
    updateField,
    submit,
    resetForm
  } = useSubscriptionRequest(selectedPlan);

  function openSubscription(plan) {
    setSelectedPlan(plan);
  }

  function closeSubscription() {
    setSelectedPlan(null);
    resetForm();
  }

  return (
    <>
      <PricingSection plansByCategory={broadbandPlans} onSubscribe={openSubscription} />
      <SubscriptionRequestModal
        isOpen={Boolean(selectedPlan)}
        selectedPlan={selectedPlan}
        onClose={closeSubscription}
        formValues={formValues}
        submissionState={submissionState}
        onChange={updateField}
        onSubmit={submit}
      />
    </>
  );
}
