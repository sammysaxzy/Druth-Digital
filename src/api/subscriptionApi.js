const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong while sending your request.");
  }

  return data;
}

export async function fetchPricingPlans() {
  const response = await fetch(`${API_BASE_URL}/plans`);
  return handleResponse(response);
}

export async function submitSubscriptionRequest(payload) {
  const response = await fetch(`${API_BASE_URL}/subscription-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(response);
}

export { API_BASE_URL };
