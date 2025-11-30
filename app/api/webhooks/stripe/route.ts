import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover", 
});

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const subscriptionId = session.subscription as string;

    // Validate required fields
    if (!userId) {
      console.error("Missing userId in session metadata");
      return new NextResponse("Missing userId in session metadata", { status: 400 });
    }

    if (!subscriptionId) {
      console.error("Missing subscription ID in session");
      return new NextResponse("Missing subscription ID", { status: 400 });
    }

    // Update user profile with error handling
    try {
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          is_premium: true,
          stripe_subscription_id: subscriptionId,
          plan_tier: "premium",
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        console.error("Supabase update error:", error);
        return new NextResponse(`Database Error: ${error.message}`, { status: 500 });
      }

      console.log(`Successfully updated profile for user ${userId}`);
    } catch (err: any) {
      console.error("Unexpected error updating profile:", err);
      return new NextResponse(`Internal Error: ${err.message}`, { status: 500 });
    }
  }
  
  return new NextResponse(null, { status: 200 });
}
