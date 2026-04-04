const STRIPE_API_BASE = "https://api.stripe.com/v1";

function toFormBody(payload) {
  const params = new URLSearchParams();

  function appendValue(key, value) {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item, index) => appendValue(`${key}[${index}]`, item));
      return;
    }

    if (typeof value === "object") {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        appendValue(`${key}[${nestedKey}]`, nestedValue);
      });
      return;
    }

    params.append(key, String(value));
  }

  Object.entries(payload).forEach(([key, value]) => appendValue(key, value));
  return params;
}

export async function stripeRequest(env, path, payload, options = {}) {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not configured");
  }

  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    method: options.method || "POST",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2026-02-25.clover",
    },
    body: payload ? toFormBody(payload) : undefined,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Stripe request failed");
  }

  return data;
}
