import { getStripe } from "../lib/stripe";

interface CreateCustomerRequestBody {
  email: string;
  name?: string;
  userId: string;
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
    const customer = await stripe.customers.retrieve(customerId, {
      expand: ["subscriptions"],
    });

    return new Response(
      JSON.stringify({ customer }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Get customer error:", error);
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
    const { email, name, userId }: CreateCustomerRequestBody = await context.request.json();

    if (!email || !userId) {
      return new Response(
        JSON.stringify({ error: "Email and userId are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const stripe = getStripe(context.env);

    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    let customer;
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      
      if (!customer.metadata.userId || customer.metadata.userId !== userId) {
        customer = await stripe.customers.update(customer.id, {
          metadata: { userId },
        });
      }
    } else {
      customer = await stripe.customers.create({
        email,
        name,
        metadata: { userId },
      });
    }

    return new Response(
      JSON.stringify({ customer }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Create customer error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}