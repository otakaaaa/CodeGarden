import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;

      case "customer.subscription.created":
        const subscriptionCreated = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscriptionCreated);
        break;

      case "customer.subscription.updated":
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscriptionUpdated);
        break;

      case "customer.subscription.deleted":
        const subscriptionDeleted = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscriptionDeleted);
        break;

      case "invoice.payment_succeeded":
        const invoiceSucceeded = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoiceSucceeded);
        break;

      case "invoice.payment_failed":
        const invoiceFailed = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoiceFailed);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler failed:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (!session.customer || !session.subscription) {
    console.error("Missing customer or subscription in session");
    return;
  }

  try {
    // Get user by stripe customer ID
    const customer = await stripe.customers.retrieve(session.customer as string);
    if (!customer || (customer as Stripe.Customer & { deleted?: boolean }).deleted === true) {
      console.error("Customer not found or deleted");
      return;
    }

    // Get the full subscription details
    const subscriptionResponse = await stripe.subscriptions.retrieve(session.subscription as string);
    const subscription = subscriptionResponse as unknown as Stripe.Subscription & {
      current_period_start: number;
      current_period_end: number;
      cancel_at_period_end: boolean;
    };
    
    // Update or create subscription record
    await updateUserSubscription((customer as Stripe.Customer).email!, {
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      status: "active",
      priceId: subscription.items.data[0]?.price.id || null,
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  } catch (error) {
    console.error("Error handling checkout session completed:", error);
    throw error;
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    // Get customer details
    const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
    if (!customer || (customer as Stripe.Customer & { deleted?: boolean }).deleted === true) {
      console.error("Customer not found or deleted");
      return;
    }

    await updateUserSubscription((customer as Stripe.Customer).email!, {
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      priceId: subscription.items.data[0]?.price.id || null,
      currentPeriodStart: new Date((subscription as Stripe.Subscription & { current_period_start: number }).current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date((subscription as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: (subscription as Stripe.Subscription & { cancel_at_period_end: boolean }).cancel_at_period_end,
    });
  } catch (error) {
    console.error("Error handling subscription created:", error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    // Get customer details
    const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
    if (!customer || (customer as Stripe.Customer & { deleted?: boolean }).deleted === true) {
      console.error("Customer not found or deleted");
      return;
    }

    await updateUserSubscription((customer as Stripe.Customer).email!, {
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      priceId: subscription.items.data[0]?.price.id || null,
      currentPeriodStart: new Date((subscription as Stripe.Subscription & { current_period_start: number }).current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date((subscription as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: (subscription as Stripe.Subscription & { cancel_at_period_end: boolean }).cancel_at_period_end,
    });
  } catch (error) {
    console.error("Error handling subscription updated:", error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    // Get customer details
    const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
    if (!customer || (customer as Stripe.Customer & { deleted?: boolean }).deleted === true) {
      console.error("Customer not found or deleted");
      return;
    }

    await updateUserSubscription((customer as Stripe.Customer).email!, {
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      status: "canceled",
      currentPeriodEnd: new Date((subscription as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: true,
    });
  } catch (error) {
    console.error("Error handling subscription deleted:", error);
    throw error;
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("Invoice payment succeeded:", invoice.id);
  
  // This is called for recurring payments
  // The subscription update webhook will handle the actual subscription changes
  // Here we can log the payment or send a receipt email if needed
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    if (!invoice.customer || !(invoice as Stripe.Invoice & { subscription?: string }).subscription) {
      console.error("Missing customer or subscription in invoice");
      return;
    }

    // Get customer details
    const customer = await stripe.customers.retrieve(invoice.customer as string) as Stripe.Customer;
    if (!customer || (customer as Stripe.Customer & { deleted?: boolean }).deleted === true) {
      console.error("Customer not found or deleted");
      return;
    }

    // Update subscription status to past_due
    await updateUserSubscription((customer as Stripe.Customer).email!, {
      stripeCustomerId: invoice.customer as string,
      stripeSubscriptionId: (invoice as Stripe.Invoice & { subscription: string }).subscription,
      status: "past_due",
    });

    // TODO: Send email notification to user about failed payment
  } catch (error) {
    console.error("Error handling invoice payment failed:", error);
    throw error;
  }
}

// Helper function to update user subscription in database
async function updateUserSubscription(
  email: string,
  subscriptionData: {
    stripeCustomerId: string;
    stripeSubscriptionId?: string;
    status?: string;
    priceId?: string | null;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
  }
) {
  try {
    // Get user by email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) {
      console.error("Error fetching users:", userError);
      throw userError;
    }

    const user = userData.users.find(u => u.email === email);
    if (!user) {
      console.error("User not found for email:", email);
      throw new Error("User not found");
    }

    // Check if subscription already exists
    const { data: existingSubscription, error: fetchError } = await supabaseAdmin
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 = not found
      console.error("Error fetching subscription:", fetchError);
      throw fetchError;
    }

    const subscriptionRecord = {
      user_id: user.id,
      stripe_customer_id: subscriptionData.stripeCustomerId,
      stripe_subscription_id: subscriptionData.stripeSubscriptionId || null,
      status: subscriptionData.status || "inactive",
      price_id: subscriptionData.priceId || null,
      current_period_start: subscriptionData.currentPeriodStart || null,
      current_period_end: subscriptionData.currentPeriodEnd || null,
      cancel_at_period_end: subscriptionData.cancelAtPeriodEnd || false,
    };

    if (existingSubscription) {
      // Update existing subscription
      const { error: updateError } = await supabaseAdmin
        .from("user_subscriptions")
        .update(subscriptionRecord)
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating subscription:", updateError);
        throw updateError;
      }
    } else {
      // Insert new subscription
      const { error: insertError } = await supabaseAdmin
        .from("user_subscriptions")
        .insert(subscriptionRecord);

      if (insertError) {
        console.error("Error inserting subscription:", insertError);
        throw insertError;
      }
    }
  } catch (error) {
    console.error("Error in updateUserSubscription:", error);
    throw error;
  }
}