import { auth } from "@/auth";
import { getNotifications } from "@/actions/notificationActions";
import { redirect } from "next/navigation";
import NotificationsList from "./notifications-list";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notifications - Buyly",
  description: "View your notifications",
};

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin?callbackUrl=/notifications");
  }

  const { notifications, total } = await getNotifications(1, 20);

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-8">
      <h1 className="text-2xl font-semibold mb-6">Notifications</h1>
      <NotificationsList
        initialNotifications={notifications}
        initialTotal={total}
      />
    </div>
  );
}
