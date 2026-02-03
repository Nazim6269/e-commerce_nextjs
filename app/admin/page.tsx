import AdminChart from "@/components/admin/AdminChart";
import AdminOrders from "@/components/admin/AdminOrders";
import DashboardStats from "@/components/admin/DashboardStats";
import TopProducts from "@/components/admin/TopProducts";
import { Suspense } from "react";

export default function AdminPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <DashboardStats />

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
                <AdminChart />
                <Suspense fallback={<div className="col-span-3 h-[300px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />}>
                    <TopProducts />
                </Suspense>
            </div>

            <AdminOrders />
        </div>
    );
}
