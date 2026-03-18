"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, Sparkles, X } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { ThemeModeMenuItem } from "./ThemeModeMenuItem";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Beranda", href: "/" },
    { label: "Produk", href: "/products" },
    { label: "About", href: "/#about" },
];

export function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 md:hidden",
                    isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-hidden={!isMobileMenuOpen}
            />
            <aside
                id="storefront-mobile-menu"
                className={cn(
                    "surface-glass fixed left-0 top-0 z-50 flex h-screen w-[84vw] max-w-[320px] flex-col border-r border-border/70 transition-transform duration-300 ease-out md:hidden",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
                aria-hidden={!isMobileMenuOpen}
            >
                <div className="flex h-16 items-center justify-between border-b border-border/70 px-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
                            <Sparkles className="h-4 w-4" />
                        </span>
                        <span className="font-display text-xl font-bold tracking-tight text-foreground">PanenHub</span>
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

                <nav className="flex-1 space-y-2 p-3">
                    {navItems.map((item) => {
                        const isActive =
                            item.href === "/"
                                ? pathname === "/"
                                : item.href === "/products"
                                  ? pathname.startsWith("/products")
                                  : false;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-border/70 p-3">
                    <Link
                        href="/cart"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                            "mb-2 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                            pathname.startsWith("/cart")
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                        )}
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Keranjang
                    </Link>
                    <ThemeModeMenuItem />
                </div>
            </aside>
            <div className="container mx-auto flex h-[68px] items-center justify-between px-4 sm:h-[74px] sm:px-8">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full border border-border/70 md:hidden"
                        aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="storefront-mobile-menu"
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    >
                        {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>
                    <Link href="/" className="group flex items-center space-x-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-105">
                            <Sparkles className="h-4 w-4" />
                        </span>
                        <span className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">PanenHub</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-2 rounded-full border border-border/70 bg-card/70 p-1 text-sm font-medium">
                    {navItems.map((item) => {
                        const isActive =
                            item.href === "/"
                                ? pathname === "/"
                                : item.href === "/products"
                                  ? pathname.startsWith("/products")
                                  : false;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "rounded-full px-4 py-1.5 transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden items-center gap-4 md:flex">
                    <ThemeToggle />
                    <Link href="/cart">
                        <Button
                            variant="outline"
                            size="icon"
                            className="relative rounded-full border-border/80 bg-card/70 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                        >
                            <ShoppingCart className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
