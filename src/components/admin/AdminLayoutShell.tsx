"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Store, X } from "lucide-react";
import { AdminSidebar, ADMIN_MENU_ITEMS, type AdminAccount } from "@/components/admin/Sidebar";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeModeMenuItem } from "@/components/ThemeModeMenuItem";
import { AdminNotifications } from "@/components/admin/AdminNotifications";

export function AdminLayoutShell({
  children,
  account,
}: {
  children: React.ReactNode;
  account?: AdminAccount;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const accountName = account?.name || "Admin User";
  const accountRole = account?.role || "Admin";
  const accountInitial = accountName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isMobileMenuOpen]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar account={account} />
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 md:hidden",
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden={!isMobileMenuOpen}
      />
      <aside
        id="admin-mobile-menu"
        className={cn(
          "surface-glass fixed left-0 top-0 z-50 flex h-screen w-[84vw] max-w-[320px] flex-col overflow-hidden border-r border-border/70 transition-transform duration-300 ease-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/70 px-4">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-foreground">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Store className="h-4 w-4" />
            </span>
            <span>PanenHub</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-border/70"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Tutup menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
          {ADMIN_MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                pathname.startsWith(item.href)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-border/70 p-3">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Akun
          </p>
          <ThemeModeMenuItem className="mb-2" />
          <div className="mb-2 flex items-center gap-3 rounded-xl border border-border/70 bg-card/55 px-3 py-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
              {accountInitial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{accountName}</p>
              <p className="text-xs text-muted-foreground">{accountRole}</p>
            </div>
          </div>
          <LogoutButton className="text-sm" />
        </div>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="surface-glass flex h-[64px] items-center gap-4 border-b px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full border border-border/70 md:hidden"
              aria-label={isMobileMenuOpen ? "Tutup menu admin" : "Buka menu admin"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="admin-mobile-menu"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Admin Panel
            </h2>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <AdminNotifications />
          </div>
        </header>
        <div className="page-enter relative flex-1 overflow-auto p-4 md:p-8">
          <div className="pointer-events-none absolute -left-20 top-0 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
          {children}
        </div>
      </main>
    </div>
  );
}
