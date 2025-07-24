import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { email, name, userId } = await request.json();

    if (!email || !userId) {
      return NextResponse.json(
        { error: "Email and userId are required" },
        { status: 400 }
      );
    }

    // Check if customer already exists
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      return NextResponse.json({
        customerId: existingCustomers.data[0].id,
        existing: true,
      });
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email: email,
      name: name,
      metadata: {
        userId: userId,
      },
    });

    return NextResponse.json({
      customerId: customer.id,
      existing: false,
    });
  } catch (error) {
    console.error("Customer creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}

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

    const customer = await stripe.customers.retrieve(customerId);
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 10,
    });

    return NextResponse.json({
      customer,
      subscriptions: subscriptions.data,
    });
  } catch (error) {
    console.error("Customer retrieval failed:", error);
    return NextResponse.json(
      { error: "Failed to retrieve customer" },
      { status: 500 }
    );
  }
}