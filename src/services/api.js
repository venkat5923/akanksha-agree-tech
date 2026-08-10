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

  try {
    // Attempt standard CORS fetch first
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        return response.json();
      }
      return { success: true };
    }
  } catch (err) {
    console.warn("Standard fetch CORS issue (common with Google Apps Script redirect), attempting fallback:", err);
  }

  // Fallback to no-cors mode ensuring the data reaches Google Apps Script regardless of browser preflight
  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });
    return { success: true, message: "Submitted successfully" };
  } catch (fallbackErr) {
    console.error("Submission failed completely:", fallbackErr);
    throw new Error(fallbackErr.message || "Failed to submit form to Google Sheet.");
  }
}
