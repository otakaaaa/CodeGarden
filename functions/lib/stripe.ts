import Stripe from "stripe";

export function getStripe(env: { STRIPE_SECRET_KEY: string }): Stripe {
  return new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-06-30.basil",
  });
}