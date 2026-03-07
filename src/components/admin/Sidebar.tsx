"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Settings,
    ChevronLeft,
    ChevronRight,
    Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LogoutButton } from "./LogoutButton";

const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Produk", href: "/admin/products", icon: Package },
    { name: "Pesanan", href: "/admin/orders", icon: ShoppingBag },
    { name: "Pengaturan", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "flex flex-col border-r border-border/70 bg-card/60 backdrop-blur-md transition-all duration-300",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            <div className="flex h-16 items-center justify-between border-b border-border/70 px-4">
                {!isCollapsed && (
                    <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                        <Store className="h-5 w-5" />
                        <span>PanenHub</span>
                    </Link>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="ml-auto"
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            <nav className="flex-1 space-y-1.5 p-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent/70",
                            pathname.startsWith(item.href)
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                ))}
            </nav>

            <div className="mt-auto border-t border-border/70 p-2">
                <LogoutButton isCollapsed={isCollapsed} />
            </div>
        </aside>
    );
}
