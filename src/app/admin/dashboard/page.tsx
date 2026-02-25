export const dynamic = 'force-dynamic';

import { getDashboardStats } from "@/services/analytics.service";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    DollarSign,
    Package,
    ShoppingBag,
    TrendingUp,
    Clock
} from "lucide-react";
import { SalesChart } from "@/components/admin/SalesChart";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Ringkasan</h1>
                <p className="text-muted-foreground">
                    Selamat datang kembali. Berikut adalah performa toko Anda hari ini.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-sm bg-emerald-50/50 dark:bg-emerald-950/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp {stats.revenue.toLocaleString("id-ID")}</div>
                        <p className="text-xs text-muted-foreground">+20.1% dari bulan lalu</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pesanan Masuk</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.ordersCount}</div>
                        <p className="text-xs text-muted-foreground">Total pesanan di sistem</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
                        <Package className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.productsCount}</div>
                        <p className="text-xs text-muted-foreground">Item dalam inventaris</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Tingkat Penjualan</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12.5%</div>
                        <p className="text-xs text-muted-foreground">Pertumbuhan minggu ini</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Grafik Penjualan (7 Hari Terakhir)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <SalesChart data={stats.dailySales} />
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-muted-foreground" /> Aktivitas Terbaru
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {stats.recentOrders.length === 0 ? (
                                <p className="text-sm text-center text-muted-foreground py-8">
                                    Belum ada aktivitas pesanan.
                                </p>
                            ) : (
                                stats.recentOrders.map((order: any) => (
                                    <div key={order.id} className="flex items-center">
                                        <div className="space-y-1 flex-1">
                                            <p className="text-sm font-medium leading-none">
                                                Pesanan baru dari {order.customerName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {order.items.length} item • Rp {order.totalPrice.toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                        <Badge variant={order.status === 'COMPLETED' ? 'default' : 'secondary'} className="text-[10px]">
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
