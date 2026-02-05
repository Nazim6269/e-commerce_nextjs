import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Redirect to signin if not authenticated
    if (!session) {
        redirect("/signin?callbackUrl=/admin");
    }

    // Redirect to home if not admin
    if ((session.user as any)?.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 flex-col md:flex-row">
            <AdminNavbar />
            <AdminSidebar />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    );
}
