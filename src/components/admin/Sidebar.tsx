"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ShoppingBag, Package, Settings, ChevronLeft, ChevronRight, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LogoutButton } from "./LogoutButton";
import { ThemeModeMenuItem } from "@/components/ThemeModeMenuItem";
import { ThemeToggle } from "@/components/theme-toggle";

export const ADMIN_MENU_ITEMS = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Produk", href: "/admin/products", icon: Package },
  { name: "Pesanan", href: "/admin/orders", icon: ShoppingBag },
  { name: "Pengaturan", href: "/admin/settings", icon: Settings },
];

export type AdminAccount = {
  name: string;
  role: string;
};

export function AdminSidebar({ account }: { account?: AdminAccount }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const accountName = account?.name || "Admin User";
  const accountRole = account?.role || "Admin";
  const accountInitial = accountName.charAt(0).toUpperCase();

  return (
    <aside
      className={cn(
        "surface-glass sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-border/70 transition-all duration-300 md:flex",
        isCollapsed ? "w-[78px]" : "w-[270px]"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border/70 px-4">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-foreground">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Store className="h-4 w-4" />
            </span>
            <span>PanenHub</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto rounded-full border border-border/70"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {ADMIN_MENU_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              pathname.startsWith(item.href)
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-border/70 p-3">
        {!isCollapsed && (
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Akun
          </p>
        )}
        {isCollapsed ? (
          <div className="mb-2 flex justify-center">
            <ThemeToggle />
          </div>
        ) : (
          <ThemeModeMenuItem className="mb-2" />
        )}
        {!isCollapsed && (
          <div className="mb-2 flex items-center gap-3 rounded-xl border border-border/70 bg-card/55 px-3 py-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
              {accountInitial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{accountName}</p>
              <p className="text-xs text-muted-foreground">{accountRole}</p>
            </div>
          </div>
        )}
        <LogoutButton isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}
