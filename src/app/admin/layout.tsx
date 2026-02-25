import { AdminSidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            <AdminSidebar />
            <main className="flex-1 flex flex-col min-w-0">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Admin Panel
                    </h2>
                </header>
                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
