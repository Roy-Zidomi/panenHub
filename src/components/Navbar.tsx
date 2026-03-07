"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Beranda", href: "/" },
    { label: "Produk", href: "/products" },
    { label: "About", href: "/#about" },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-white/70 shadow-sm backdrop-blur-md dark:bg-slate-900/70">
            <div className="container mx-auto flex h-[72px] items-center justify-between px-4 sm:px-8">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-display text-2xl font-bold text-foreground">PanenHub</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
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
                                    "relative py-1 text-sm transition-colors duration-200",
                                    "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform after:duration-200 hover:after:scale-x-100",
                                    isActive ? "text-foreground after:scale-x-100" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/#about" className="text-sm font-medium transition-colors hover:text-primary md:hidden">
                        About
                    </Link>
                    <ThemeToggle />
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative rounded-full border border-border/60 bg-background/60">
                            <ShoppingCart className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
