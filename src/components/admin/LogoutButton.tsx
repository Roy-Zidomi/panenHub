"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
    isCollapsed?: boolean;
}

export function LogoutButton({ isCollapsed }: LogoutButtonProps) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/admin/login");
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
                "w-full justify-start gap-3 text-red-500 hover:bg-red-500/10 hover:text-red-600",
                isCollapsed && "px-0 justify-center"
            )}
        >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Keluar</span>}
        </Button>
    );
}
