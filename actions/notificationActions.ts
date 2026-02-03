"use server";

import { auth } from "@/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { NotificationModel } from "@/models/notificationModel";
import { userModel } from "@/models/userModel";

export async function getNotifications(page = 1, limit = 10) {
  const session = await auth();
  if (!session?.user?.email) return { notifications: [], total: 0 };

  await connectMongoDB();
  const user = await userModel.findOne({ email: session.user.email });
  if (!user) return { notifications: [], total: 0 };

  const skip = (page - 1) * limit;
  const [notifications, total] = await Promise.all([
    NotificationModel.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    NotificationModel.countDocuments({ userId: user._id }),
  ]);

  return {
    notifications: JSON.parse(JSON.stringify(notifications)),
    total,
  };
}

export async function getUnreadCount() {
  const session = await auth();
  if (!session?.user?.email) return 0;

  await connectMongoDB();
  const user = await userModel.findOne({ email: session.user.email });
  if (!user) return 0;

  return NotificationModel.countDocuments({ userId: user._id, read: false });
}

export async function markAsRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.email) return { success: false };

  await connectMongoDB();
  await NotificationModel.findByIdAndUpdate(notificationId, { read: true });
  return { success: true };
}

export async function markAllAsRead() {
  const session = await auth();
  if (!session?.user?.email) return { success: false };

  await connectMongoDB();
  const user = await userModel.findOne({ email: session.user.email });
  if (!user) return { success: false };

  await NotificationModel.updateMany(
    { userId: user._id, read: false },
    { read: true }
  );
  return { success: true };
}

export async function deleteNotification(notificationId: string) {
  const session = await auth();
  if (!session?.user?.email) return { success: false };

  await connectMongoDB();
  await NotificationModel.findByIdAndDelete(notificationId);
  return { success: true };
}

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  await connectMongoDB();
  const notification = await NotificationModel.create(data);
  return JSON.parse(JSON.stringify(notification));
}
