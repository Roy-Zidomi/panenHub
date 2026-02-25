import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-primary">PanenHub</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/" className="transition-colors hover:text-primary">Beranda</Link>
                    <Link href="/products" className="transition-colors hover:text-primary">Produk</Link>
                    <Link href="/about" className="transition-colors hover:text-primary">Tentang</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {/* <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                3
              </span> */}
                        </Button>
                    </Link>
                    <Button variant="outline" className="hidden md:flex">Masuk</Button>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
