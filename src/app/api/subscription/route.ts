import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 10,
    });

    return NextResponse.json({
      subscriptions: subscriptions.data,
    });
  } catch (error) {
    console.error("Subscription retrieval failed:", error);
    return NextResponse.json(
      { error: "Failed to retrieve subscriptions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, subscriptionId, priceId } = await request.json();

    switch (action) {
      case "cancel":
        if (!subscriptionId) {
          return NextResponse.json(
            { error: "Subscription ID is required for cancellation" },
            { status: 400 }
          );
        }

        const canceledSubscription = await stripe.subscriptions.update(
          subscriptionId,
          {
            cancel_at_period_end: true,
          }
        );

        return NextResponse.json({
          subscription: canceledSubscription,
          message: "Subscription will be canceled at the end of the current period",
        });

      case "reactivate":
        if (!subscriptionId) {
          return NextResponse.json(
            { error: "Subscription ID is required for reactivation" },
            { status: 400 }
          );
        }

        const reactivatedSubscription = await stripe.subscriptions.update(
          subscriptionId,
          {
            cancel_at_period_end: false,
          }
        );

        return NextResponse.json({
          subscription: reactivatedSubscription,
          message: "Subscription has been reactivated",
        });

      case "update":
        if (!subscriptionId || !priceId) {
          return NextResponse.json(
            { error: "Subscription ID and Price ID are required for update" },
            { status: 400 }
          );
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const updatedSubscription = await stripe.subscriptions.update(
          subscriptionId,
          {
            items: [
              {
                id: subscription.items.data[0].id,
                price: priceId,
              },
            ],
            proration_behavior: "create_prorations",
          }
        );

        return NextResponse.json({
          subscription: updatedSubscription,
          message: "Subscription plan has been updated",
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Subscription action failed:", error);
    return NextResponse.json(
      { error: "Failed to perform subscription action" },
      { status: 500 }
    );
  }
}