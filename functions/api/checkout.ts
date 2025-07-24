import { getStripe } from "../lib/stripe";

interface CheckoutRequestBody {
  priceId: string;
  customerId: string;
  successUrl: string;
  cancelUrl: string;
}

export async function onRequestPost(context: {
  request: Request;
  env: { STRIPE_SECRET_KEY: string };
}) {
  try {
    const { priceId, customerId, successUrl, cancelUrl }: CheckoutRequestBody = await context.request.json();

    if (!priceId || !customerId || !successUrl || !cancelUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const stripe = getStripe(context.env);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}