import { getStripe } from "../lib/stripe";

interface CustomerPortalRequestBody {
  customerId: string;
  returnUrl: string;
}

export async function onRequestPost(context: {
  request: Request;
  env: { STRIPE_SECRET_KEY: string };
}) {
  try {
    const { customerId, returnUrl }: CustomerPortalRequestBody = await context.request.json();

    if (!customerId || !returnUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const stripe = getStripe(context.env);

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Customer portal error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}