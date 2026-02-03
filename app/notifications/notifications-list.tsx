"use client";

import {
  deleteNotification,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "@/actions/notificationActions";
import {
  Bell,
  CheckCheck,
  Package,
  ShoppingCart,
  Star,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { useState } from "react";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  order_placed: <ShoppingCart size={16} className="text-green-500" />,
  order_shipped: <Truck size={16} className="text-blue-500" />,
  order_delivered: <Package size={16} className="text-emerald-500" />,
  price_drop: <Tag size={16} className="text-orange-500" />,
  review_reply: <Star size={16} className="text-yellow-500" />,
  welcome: <Bell size={16} className="text-purple-500" />,
  promo: <Tag size={16} className="text-pink-500" />,
};

export default function NotificationsList({
  initialNotifications,
  initialTotal,
}: {
  initialNotifications: Notification[];
  initialTotal: number;
}) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? notifications
      : filter === "unread"
        ? notifications.filter((n) => !n.read)
        : notifications.filter((n) => n.type === filter);

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    setTotal((prev) => prev - 1);
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    const { notifications: more } = await getNotifications(nextPage, 20);
    setNotifications((prev) => [...prev, ...more]);
    setPage(nextPage);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex gap-2 flex-wrap">
          {["all", "unread", "order_placed", "order_shipped", "promo"].map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filter === f
                    ? "bg-nazim text-white"
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {f === "all"
                  ? "All"
                  : f === "unread"
                    ? "Unread"
                    : f.replace("_", " ")}
              </button>
            )
          )}
        </div>
        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1 text-xs text-nazim hover:underline"
        >
          <CheckCheck size={14} /> Mark all read
        </button>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No notifications to show
            </p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n._id}
              className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                !n.read
                  ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900"
                  : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"
              }`}
            >
              <div className="mt-0.5">
                {typeIcons[n.type] || <Bell size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {n.message}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                  {formatDate(n.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!n.read && (
                  <button
                    onClick={() => handleMarkRead(n._id)}
                    className="text-gray-400 hover:text-nazim transition-colors"
                    title="Mark as read"
                  >
                    <CheckCheck size={14} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n._id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length < total && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
