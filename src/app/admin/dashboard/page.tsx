export const dynamic = "force-dynamic";

import { getDashboardStats } from "@/services/analytics.service";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Package,
    ShoppingBag,
    DollarSign,
    Users,
    Clock3,
} from "lucide-react";
import { SalesChart } from "@/components/admin/SalesChart";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats();

    const metrics = [
        {
            title: "Total Products",
            value: stats.productsCount.toLocaleString("id-ID"),
            caption: "Produk aktif di marketplace",
            icon: Package,
            iconClass: "text-emerald-500",
        },
        {
            title: "Total Orders",
            value: stats.ordersCount.toLocaleString("id-ID"),
            caption: "Total pesanan tercatat",
            icon: ShoppingBag,
            iconClass: "text-sky-500",
        },
        {
            title: "Revenue",
            value: `Rp ${stats.revenue.toLocaleString("id-ID")}`,
            caption: "Akumulasi pesanan selesai",
            icon: DollarSign,
            iconClass: "text-amber-500",
        },
        {
            title: "New Users",
            value: `+${stats.newUsersCount.toLocaleString("id-ID")}`,
            caption: `${stats.usersCount.toLocaleString("id-ID")} total user`,
            icon: Users,
            iconClass: "text-violet-500",
        },
    ];

    return (
        <div className="page-enter space-y-8">
            <div>
                <h1 className="font-display text-3xl font-bold tracking-tight">My Dashboard</h1>
                {/* <p className="text-muted-foreground">
                    Selamat datang kembali. Berikut adalah performa toko Anda hari ini.
                </p> */}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric) => (
                    <Card key={metric.title} className="rounded-xl border border-border/70 bg-card/70 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                            <div className="rounded-lg bg-muted/70 p-2">
                                <metric.icon className={cn("h-4 w-4", metric.iconClass)} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metric.value}</div>
                            <p className="mt-1 text-xs text-muted-foreground">{metric.caption}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-7">
                <Card className="rounded-xl border border-border/70 bg-card/70 shadow-md lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Grafik Penjualan (7 Hari Terakhir)</CardTitle>
                        {/* <p className="text-sm text-muted-foreground">
                            Menampilkan tren pendapatan harian dari transaksi selesai dan diproses.
                        </p> */}
                    </CardHeader>
                    <CardContent className="pl-2">
                        <SalesChart data={stats.dailySales} />
                    </CardContent>
                </Card>

                <Card className="rounded-xl border border-border/70 bg-card/70 shadow-md lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock3 className="h-5 w-5 text-muted-foreground" /> Aktivitas Terbaru
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.recentOrders.length === 0 ? (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    Belum ada aktivitas pesanan.
                                </p>
                            ) : (
                                stats.recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center rounded-lg border border-border/60 bg-muted/20 px-3 py-2"
                                    >
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                Pesanan baru dari {order.customerName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {order.items.length} item - Rp {order.totalPrice.toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={order.status === "COMPLETED" ? "default" : "secondary"}
                                            className="text-[10px]"
                                        >
                                            {order.status}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
