"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
    isCollapsed?: boolean;
    className?: string;
}

export function LogoutButton({ isCollapsed, className }: LogoutButtonProps) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.replace("/admin/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
                "w-full justify-start gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-600",
                isCollapsed && "justify-center px-0",
                className
            )}
        >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Keluar</span>}
        </Button>
    );
}
