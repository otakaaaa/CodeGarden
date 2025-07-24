import { getStripe } from "../../lib/stripe";
import { getSupabaseAdmin } from "../../lib/supabase-admin";
import type Stripe from "stripe";

// Stripe\u306e\u578b\u5b9a\u7fa9\u306b\u4e0d\u8db3\u3057\u3066\u3044\u308b\u30d7\u30ed\u30d1\u30c6\u30a3\u3092\u62e1\u5f35
interface ExtendedSubscription extends Stripe.Subscription {
  current_period_start: number;
  current_period_end: number;
}

interface ExtendedInvoice extends Stripe.Invoice {
  subscription?: string | Stripe.Subscription | null;
}

// Stripe.Response<T>\u578b\u3092\u51e6\u7406\u3059\u308b\u30d8\u30eb\u30d1\u30fc\u95a2\u6570
function asExtendedSubscription(subscription: Stripe.Response<Stripe.Subscription> | Stripe.Subscription): ExtendedSubscription {
  return subscription as ExtendedSubscription;
}

interface SubscriptionData {
  subscription_id: string;
  status: string;
  current_period_start?: string;
  current_period_end?: string;
  plan_id?: string;
  cancel_at?: string | null;
  canceled_at?: string | null;
}

async function updateUserSubscription(
  env: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string },
  userId: string,
  subscriptionData: SubscriptionData
) {
  const supabaseAdmin = getSupabaseAdmin(env);
  
  const { error } = await supabaseAdmin
    .from("user_subscriptions")
    .upsert({
      user_id: userId,
      ...subscriptionData,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Error updating user subscription:", error);
    throw error;
  }
}

export async function onRequestPost(context: {
  request: Request;
  env: {
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
  };
}) {
  try {
    const signature = context.request.headers.get("stripe-signature");
    if (!signature) {
      return new Response(
        JSON.stringify({ error: "No signature found" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await context.request.text();
    const stripe = getStripe(context.env);
    
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        context.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(
        JSON.stringify({ error: "Webhook signature verification failed" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const subscriptionResponse = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          const subscription = asExtendedSubscription(subscriptionResponse);
          const customerId = subscription.customer as string;
          const customer = await stripe.customers.retrieve(customerId);
          
          if ("metadata" in customer && customer.metadata.userId) {
            await updateUserSubscription(context.env, customer.metadata.userId, {
              subscription_id: subscription.id,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              plan_id: subscription.items.data[0].price.id,
              cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
              canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
            });
          }
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as ExtendedSubscription;
        const customerId = subscription.customer as string;
        const customer = await stripe.customers.retrieve(customerId);
        
        if ("metadata" in customer && customer.metadata.userId) {
          await updateUserSubscription(context.env, customer.metadata.userId, {
            subscription_id: subscription.id,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            plan_id: subscription.items.data[0].price.id,
            cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
            canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as ExtendedSubscription;
        const customerId = subscription.customer as string;
        const customer = await stripe.customers.retrieve(customerId);
        
        if ("metadata" in customer && customer.metadata.userId) {
          await updateUserSubscription(context.env, customer.metadata.userId, {
            subscription_id: subscription.id,
            status: "canceled",
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            canceled_at: new Date().toISOString(),
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as ExtendedInvoice;
        if (invoice.subscription) {
          const subscriptionResponse = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          );
          const subscription = asExtendedSubscription(subscriptionResponse);
          const customerId = subscription.customer as string;
          const customer = await stripe.customers.retrieve(customerId);
          
          if ("metadata" in customer && customer.metadata.userId) {
            await updateUserSubscription(context.env, customer.metadata.userId, {
              subscription_id: subscription.id,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              plan_id: subscription.items.data[0].price.id,
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as ExtendedInvoice;
        if (invoice.subscription) {
          const subscriptionResponse = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          );
          const subscription = asExtendedSubscription(subscriptionResponse);
          const customerId = subscription.customer as string;
          const customer = await stripe.customers.retrieve(customerId);
          
          if ("metadata" in customer && customer.metadata.userId) {
            await updateUserSubscription(context.env, customer.metadata.userId, {
              subscription_id: subscription.id,
              status: "past_due",
            });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}