"use server";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const {
      lines,
      shippingLabel,
      guest,
      coupon,
      shippingAmount,
      taxAmount,
    } = await req.json();

    if (!Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json(
        { error: "No line items provided" },
        { status: 400 }
      );
    }

    const origin = req.nextUrl.origin;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      ...lines.map((l: any) => ({
        quantity: l.qty,
        price_data: {
          currency: "usd",
          product_data: {
            name: l.name,
          },
          unit_amount: Math.round(l.price * 100),
        },
      })),
    ];

    // Optional: send shipping and tax as separate line items just for demo clarity
    if (typeof shippingAmount === "number" && shippingAmount > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: shippingLabel || "Shipping",
          },
          unit_amount: Math.round(shippingAmount * 100),
        },
      });
    }

    if (typeof taxAmount === "number" && taxAmount > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: "Tax",
          },
          unit_amount: Math.round(taxAmount * 100),
        },
      });
    }

    // Very simple coupon handling — for a real app, map coupon to Stripe coupons/promo codes
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    if (coupon?.code && coupon.amount && coupon.amount > 0) {
      // Represent discount as a negative line item instead of true Stripe coupon for demo
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: `Discount (${coupon.code})`,
          },
          unit_amount: -Math.round(Math.abs(coupon.amount) * 100),
        },
      });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Stripe is not configured on the server" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      // Collect email at checkout (guest checkout)
      customer_email: guest?.email || undefined,
      metadata: {
        guestName: guest?.name || "",
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

