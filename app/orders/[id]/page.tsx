import { auth } from "@/auth";
import { getOrderById } from "@/actions/orderActions";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Package, Truck } from "lucide-react";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

const statusSteps = ["pending", "processing", "shipped", "delivered"];

export default async function OrderDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin?callbackUrl=/orders");
  }

  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    return notFound();
  }

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-8">
      <Link
        href="/orders"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-nazim mb-6"
      >
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">
          Order #{order._id.slice(-8).toUpperCase()}
        </h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Status Tracker */}
      {order.status !== "cancelled" && (
        <div className="mb-8 p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-nazim transition-all"
              style={{
                width: `${Math.max(0, (currentStep / (statusSteps.length - 1)) * 100)}%`,
              }}
            />
            {statusSteps.map((step, i) => (
              <div key={step} className="flex flex-col items-center z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    i <= currentStep
                      ? "bg-nazim text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }`}
                >
                  {i <= currentStep ? (
                    <Package size={14} />
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="text-xs mt-2 capitalize">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {order.status === "cancelled" && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 font-medium">
            This order has been cancelled
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-lg mb-4">Order Items</h2>
          {order.items?.map((item: any, index: number) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-md relative overflow-hidden">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Total</span>
                <span>${order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {order.shippingAddress?.street && (
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin size={16} /> Shipping Address
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.shippingAddress.street}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zip}
                <br />
                {order.shippingAddress.country}
              </p>
            </div>
          )}

          {order.trackingNumber && (
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Truck size={16} /> Tracking
              </h3>
              <p className="text-sm font-mono">{order.trackingNumber}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
