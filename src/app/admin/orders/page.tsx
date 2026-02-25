export const dynamic = 'force-dynamic';

import { getOrders } from "@/services/order.service";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
    PENDING: { label: "Menunggu", className: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200" },
    PROCESSING: { label: "Diproses", className: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200" },
    COMPLETED: { label: "Selesai", className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200" },
    CANCELLED: { label: "Dibatalkan", className: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200" },
};

export default async function AdminOrdersPage() {
    const orders = await getOrders();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Manajemen Pesanan</h1>
                <p className="text-muted-foreground">
                    Kelola pesanan pelanggan dan perbarui status pengiriman.
                </p>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ORDER ID</TableHead>
                            <TableHead>Pelanggan</TableHead>
                            <TableHead>Produk</TableHead>
                            <TableHead>Total Harga</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    Belum ada pesanan masuk.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order: any) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs uppercase">
                                        #{order.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{order.customerName}</span>
                                            <span className="text-xs text-muted-foreground">{order.customerPhone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-xs">
                                            <ShoppingCart className="h-3 w-3" />
                                            {order.items.length} Barang
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        Rp {order.totalPrice.toLocaleString("id-ID")}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={cn("border", statusConfig[order.status as OrderStatus].className)}>
                                            {statusConfig[order.status as OrderStatus].label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/orders/${order.id}`}>
                                            <Button variant="ghost" size="sm" className="gap-2">
                                                <Eye className="h-4 w-4" /> Detail
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
