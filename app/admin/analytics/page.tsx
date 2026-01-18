import AdminChart from "@/components/admin/AdminChart";
import DashboardStats from "@/components/admin/DashboardStats";

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            </div>

            <DashboardStats />

            <div className="grid gap-6">
                <AdminChart />
            </div>
        </div>
    );
}
