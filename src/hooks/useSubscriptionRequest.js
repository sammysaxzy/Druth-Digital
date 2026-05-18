import { useState } from "react";
import { submitSubscriptionRequest } from "../api/subscriptionApi.js";

const initialState = {
  fullName: "",
  phoneNumber: "",
  emailAddress: "",
  homeAddress: "",
  preferredInstallationDate: "",
  additionalMessage: ""
};

export function useSubscriptionRequest(selectedPlan) {
  const [formValues, setFormValues] = useState(initialState);
  const [submissionState, setSubmissionState] = useState({
    status: "idle",
    message: ""
  });

  function updateField(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: value
    }));
  }

  function resetForm() {
    setFormValues(initialState);
    setSubmissionState({
      status: "idle",
      message: ""
    });
  }

  async function submit(event) {
    event.preventDefault();

    if (!selectedPlan) {
      setSubmissionState({
        status: "error",
        message: "Please choose an internet plan before submitting the form."
      });
      return;
    }

    setSubmissionState({
      status: "loading",
      message: ""
    });

    try {
      const response = await submitSubscriptionRequest({
        ...formValues,
        selectedPlan: {
          planName: selectedPlan.name,
          category: selectedPlan.category
        }
      });

      setSubmissionState({
        status: "success",
        message: response.message
      });
      setFormValues(initialState);
    } catch (error) {
      setSubmissionState({
        status: "error",
        message: error.message
      });
    }
  }

  return {
    formValues,
    submissionState,
    updateField,
    submit,
    resetForm
  };
}
