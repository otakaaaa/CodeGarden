import { loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<import("@stripe/stripe-js").Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export interface CreateCheckoutSessionParams {
  priceId: string;
  customerId?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Failed to create checkout session");
  }

  return response.json();
}

export async function createCustomer(email: string, name?: string, userId?: string) {
  const response = await fetch("/api/customer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, name, userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to create customer");
  }

  return response.json();
}

export async function getCustomerSubscriptions(customerId: string) {
  const response = await fetch(`/api/subscription?customerId=${customerId}`);

  if (!response.ok) {
    throw new Error("Failed to get customer subscriptions");
  }

  return response.json();
}

export async function cancelSubscription(subscriptionId: string) {
  const response = await fetch("/api/subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "cancel",
      subscriptionId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to cancel subscription");
  }

  return response.json();
}

export async function reactivateSubscription(subscriptionId: string) {
  const response = await fetch("/api/subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "reactivate",
      subscriptionId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to reactivate subscription");
  }

  return response.json();
}

export async function updateSubscription(subscriptionId: string, priceId: string) {
  const response = await fetch("/api/subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "update",
      subscriptionId,
      priceId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update subscription");
  }

  return response.json();
}

export async function createCustomerPortalSession(customerId: string, returnUrl?: string) {
  const response = await fetch("/api/customer-portal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerId,
      returnUrl,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create customer portal session");
  }

  return response.json();
}