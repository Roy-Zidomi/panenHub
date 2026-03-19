export const dynamic = "force-dynamic";

import { getOrderById } from "@/services/order.service";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Package, User, MapPin, Phone, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function extractLocationAndNotes(rawNotes: string | null | undefined) {
  if (!rawNotes) {
    return {
      locationUrl: null,
      customerNotes: null,
    };
  }

  const locationMatch = rawNotes.match(/\[LOKASI_MAPS\]\s*(https?:\/\/\S+)/i);
  const locationUrl = locationMatch?.[1] ?? null;

  const customerNotes = rawNotes
    .replace(/\[LOKASI_MAPS\]\s*https?:\/\/\S+/gi, "")
    .trim();

  return {
    locationUrl,
    customerNotes: customerNotes.length > 0 ? customerNotes : null,
  };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }
  const { locationUrl, customerNotes } = extractLocationAndNotes(order.notes);

  return (
    <div className="space-y-6">
      <div className="reveal-up flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-display text-3xl font-bold tracking-tight">Detail Pesanan</h1>
        </div>
        <StatusSelect orderId={order.id} initialStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="surface-panel reveal-up reveal-delay-1 rounded-2xl border md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Package className="h-5 w-5" /> Isi Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead className="text-center">Jumlah</TableHead>
                  <TableHead className="text-right">Harga Satuan</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product.name}</TableCell>
                    <TableCell className="text-center">{item.quantity}x</TableCell>
                    <TableCell className="text-right">Rp {item.price.toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-right font-semibold">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={3} className="text-right text-lg font-bold">
                    Total Akhir
                  </TableCell>
                  <TableCell className="text-right text-lg font-bold text-primary">Rp {order.totalPrice.toLocaleString("id-ID")}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="surface-panel reveal-up reveal-delay-2 rounded-2xl border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <User className="h-5 w-5" /> Informasi Pelanggan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <User className="mt-1 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Nama</span>
                  <span className="font-medium">{order.customerName}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="mt-1 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Telepon / WA</span>
                  <span className="font-medium">{order.customerPhone}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Alamat Pengiriman</span>
                  <span className="font-medium leading-tight">{order.customerAddress}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="mt-1 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Waktu Pemesanan</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {locationUrl && (
            <Card className="surface-panel reveal-up reveal-delay-3 rounded-2xl border">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Titik Lokasi Pengantaran</CardTitle>
              </CardHeader>
              <CardContent>
                <a href={locationUrl} target="_blank" rel="noreferrer">
                  <Button variant="outline" className="w-full justify-between gap-2">
                    <span className="truncate text-left">Buka Lokasi di Google Maps</span>
                    <ExternalLink className="h-4 w-4 shrink-0" />
                  </Button>
                </a>
                <p className="mt-2 break-all text-[11px] text-muted-foreground">{locationUrl}</p>
              </CardContent>
            </Card>
          )}

          {customerNotes && (
            <Card className="surface-panel reveal-up reveal-delay-3 rounded-2xl border">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Catatan Pembeli</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="rounded-md bg-muted/40 p-3 text-sm italic text-muted-foreground">
                  &quot;{customerNotes}&quot;
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
