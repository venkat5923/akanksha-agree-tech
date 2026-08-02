import { APP_CONFIG } from "../config/appConfig.js";

// Submits form data to the Google Apps Script Web App endpoint.
// Returns a promise that resolves with the response data on success.
export async function submitFormData(formType, data) {
  const url =
    formType === "service-provider"
      ? APP_CONFIG.serviceProviderUrl
      : APP_CONFIG.farmerUrl;

  if (!url) {
    throw new Error(
      "Google Apps Script URL is not configured. Please set it in src/config/appConfig.js"
    );
  }

  const payload = {
    formType,
    submittedAt: new Date().toISOString(),
    data,
  };

  // Use text/plain to avoid CORS preflight (OPTIONS) request.
  // Google Apps Script doesn't handle OPTIONS, so we must not trigger it.
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Submission failed with status ${response.status}`);
  }

  // Apps Script may return text or JSON
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}
