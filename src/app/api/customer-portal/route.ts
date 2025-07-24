import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { customerId, returnUrl } = await request.json();

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    // Create a portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    });

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error("Customer portal session creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create customer portal session" },
      { status: 500 }
    );
  }
}