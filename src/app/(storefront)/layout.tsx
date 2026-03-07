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
            <main className="page-enter flex-1">{children}</main>
            <Footer />
        </div>
    );
}
