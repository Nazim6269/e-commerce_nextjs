import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
