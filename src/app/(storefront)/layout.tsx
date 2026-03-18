import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="page-enter relative flex-1">
                <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                {children}
            </main>
            <Footer />
        </div>
    );
}
