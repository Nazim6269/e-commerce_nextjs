import { createNotification } from "@/actions/notificationActions";
import { sendEmail } from "@/lib/mailer";
import { orderConfirmationEmail } from "@/lib/email-templates/orderConfirmation";
import { connectMongoDB } from "@/lib/mongodb";
import { userModel } from "@/models/userModel";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await connectMongoDB();

      const customerEmail =
        session.customer_details?.email || session.metadata?.guestEmail;
      const customerName =
        session.metadata?.guestName ||
        session.customer_details?.name ||
        "Customer";

      if (customerEmail) {
        // Find user for in-app notification
        const user = await userModel.findOne({ email: customerEmail });

        if (user) {
          // Create in-app notification
          await createNotification({
            userId: (user._id as any).toString(),
            type: "order_placed",
            title: "Order Confirmed",
            message: `Your order has been placed successfully! Order total: $${((session.amount_total || 0) / 100).toFixed(2)}`,
            link: "/orders",
          });
        }

        // Send confirmation email
        const emailHtml = orderConfirmationEmail({
          customerName,
          orderId: session.id.slice(-8).toUpperCase(),
          items: [
            {
              name: "Your Buyly Order",
              price: (session.amount_total || 0) / 100,
              quantity: 1,
            },
          ],
          total: (session.amount_total || 0) / 100,
        });

        await sendEmail(customerEmail, "Order Confirmation - Buyly", emailHtml);
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
    }
  }

  return NextResponse.json({ received: true });
}
