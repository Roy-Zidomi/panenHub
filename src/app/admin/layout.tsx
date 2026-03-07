import { AdminSidebar } from "@/components/admin/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            <AdminSidebar />
            <main className="flex-1 flex flex-col min-w-0">
                <header className="surface-glass flex h-[64px] items-center justify-between gap-4 border-b px-6">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.24em]">
                        Admin Panel
                    </h2>
                    <ThemeToggle />
                </header>
                <div className="page-enter flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
