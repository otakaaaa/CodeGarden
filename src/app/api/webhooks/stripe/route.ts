import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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
  console.log("Checkout session completed:", session.id);
  
  // TODO: Update user subscription status in database
  // Example:
  // await updateUserSubscription(session.customer as string, {
  //   subscriptionId: session.subscription as string,
  //   status: "active",
  //   priceId: session.line_items?.data[0]?.price?.id,
  // });
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log("Subscription created:", subscription.id);
  
  // TODO: Update user subscription in database
  // await updateUserSubscription(subscription.customer as string, {
  //   subscriptionId: subscription.id,
  //   status: subscription.status,
  //   currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  //   priceId: subscription.items.data[0]?.price.id,
  // });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("Subscription updated:", subscription.id);
  
  // TODO: Update user subscription in database
  // await updateUserSubscription(subscription.customer as string, {
  //   subscriptionId: subscription.id,
  //   status: subscription.status,
  //   currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  //   priceId: subscription.items.data[0]?.price.id,
  // });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("Subscription deleted:", subscription.id);
  
  // TODO: Update user subscription in database
  // await updateUserSubscription(subscription.customer as string, {
  //   subscriptionId: subscription.id,
  //   status: "canceled",
  //   currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  // });
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("Invoice payment succeeded:", invoice.id);
  
  // TODO: Handle successful payment
  // This is called for recurring payments
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("Invoice payment failed:", invoice.id);
  
  // TODO: Handle failed payment
  // Notify user, update subscription status, etc.
}