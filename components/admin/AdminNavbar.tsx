"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Package, Users, BarChart, X, Home, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

const sidebarItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart },
];

export default function AdminNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header className="md:hidden bg-white dark:bg-gray-900 border-b dark:border-gray-700 p-4 flex items-center justify-between sticky top-0 z-50">
            <h1 className="text-xl font-bold text-primary">Admin</h1>
            <button onClick={toggleMenu} className="p-2">
                <Menu className="w-6 h-6" />
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
                    <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-xl animate-in slide-in-from-left duration-200">
                        <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-primary">Admin</h1>
                            <button onClick={toggleMenu}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <nav className="p-4 space-y-2">
                            {sidebarItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700 space-y-2">
                            <Link
                                href="/"
                                className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <Home className="w-5 h-5" />
                                <span className="font-medium">Store Front</span>
                            </Link>
                            <button
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
