"use server";

import { auth } from "@/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { PushSubscriptionModel } from "@/models/pushSubscriptionModel";
import { userModel } from "@/models/userModel";
import webpush from "web-push";

if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    `mailto:${process.env.GMAIL_USER || "noreply@buyly.com"}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function subscribeToPush(subscription: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}) {
  const session = await auth();
  if (!session?.user?.email) return { success: false };

  await connectMongoDB();
  const user = await userModel.findOne({ email: session.user.email });
  if (!user) return { success: false };

  // Remove existing subscription for this user
  await PushSubscriptionModel.deleteMany({ userId: user._id });

  await PushSubscriptionModel.create({
    userId: user._id,
    endpoint: subscription.endpoint,
    keys: subscription.keys,
  });

  return { success: true };
}

export async function unsubscribeFromPush() {
  const session = await auth();
  if (!session?.user?.email) return { success: false };

  await connectMongoDB();
  const user = await userModel.findOne({ email: session.user.email });
  if (!user) return { success: false };

  await PushSubscriptionModel.deleteMany({ userId: user._id });
  return { success: true };
}

export async function sendPushNotification(
  userId: string,
  payload: { title: string; body: string; url?: string }
) {
  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return { success: false, error: "VAPID keys not configured" };
  }

  await connectMongoDB();

  const subscriptions = await PushSubscriptionModel.find({ userId });

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.keys.p256dh,
            auth: sub.keys.auth,
          },
        },
        JSON.stringify(payload)
      )
    )
  );

  // Clean up expired subscriptions
  const failed = results
    .map((r, i) => (r.status === "rejected" ? i : -1))
    .filter((i) => i !== -1);

  if (failed.length > 0) {
    const failedIds = failed.map((i) => subscriptions[i]._id);
    await PushSubscriptionModel.deleteMany({ _id: { $in: failedIds } });
  }

  return { success: true };
}
