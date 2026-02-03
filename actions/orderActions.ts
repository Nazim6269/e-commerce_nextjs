"use server";

import { auth } from "@/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/orderModel";
import { userModel } from "@/models/userModel";

export async function getOrders(page = 1, limit = 10) {
  const session = await auth();
  if (!session?.user?.email) return { orders: [], total: 0 };

  await connectMongoDB();
  const user = await userModel.findOne({ email: session.user.email });
  if (!user) return { orders: [], total: 0 };

  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    OrderModel.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    OrderModel.countDocuments({ userId: user._id }),
  ]);

  return {
    orders: JSON.parse(JSON.stringify(orders)),
    total,
  };
}

export async function getOrderById(orderId: string) {
  const session = await auth();
  if (!session?.user?.email) return null;

  await connectMongoDB();
  const user = await userModel.findOne({ email: session.user.email });
  if (!user) return null;

  const order = await OrderModel.findOne({
    _id: orderId,
    userId: user._id,
  }).lean();

  return order ? JSON.parse(JSON.stringify(order)) : null;
}

export async function cancelOrder(orderId: string) {
  const session = await auth();
  if (!session?.user?.email) return { success: false };

  await connectMongoDB();
  const user = await userModel.findOne({ email: session.user.email });
  if (!user) return { success: false };

  const order = await OrderModel.findOne({ _id: orderId, userId: user._id });
  if (!order || !["pending", "processing"].includes(order.status)) {
    return { success: false, message: "Cannot cancel this order" };
  }

  order.status = "cancelled";
  await order.save();
  return { success: true };
}
