import { getStripe } from "../lib/stripe";

interface UpdateSubscriptionRequestBody {
  action: "cancel" | "reactivate" | "update";
  subscriptionId: string;
  priceId?: string;
}

export async function onRequestGet(context: {
  request: Request;
  env: { STRIPE_SECRET_KEY: string };
}) {
  try {
    const url = new URL(context.request.url);
    const customerId = url.searchParams.get("customerId");

    if (!customerId) {
      return new Response(
        JSON.stringify({ error: "Customer ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const stripe = getStripe(context.env);
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      expand: ["data.default_payment_method"],
    });

    return new Response(
      JSON.stringify({ subscriptions: subscriptions.data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Get subscriptions error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function onRequestPost(context: {
  request: Request;
  env: { STRIPE_SECRET_KEY: string };
}) {
  try {
    const { action, subscriptionId, priceId }: UpdateSubscriptionRequestBody = await context.request.json();

    if (!action || !subscriptionId) {
      return new Response(
        JSON.stringify({ error: "Action and subscriptionId are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const stripe = getStripe(context.env);
    let subscription;

    switch (action) {
      case "cancel":
        subscription = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
        break;

      case "reactivate":
        subscription = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: false,
        });
        break;

      case "update":
        if (!priceId) {
          return new Response(
            JSON.stringify({ error: "Price ID is required for update" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        const currentSubscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        subscription = await stripe.subscriptions.update(subscriptionId, {
          items: [{
            id: currentSubscription.items.data[0].id,
            price: priceId,
          }],
          proration_behavior: "create_prorations",
        });
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    return new Response(
      JSON.stringify({ subscription }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Update subscription error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}