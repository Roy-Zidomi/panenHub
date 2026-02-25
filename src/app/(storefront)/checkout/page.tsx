"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  ArrowRight,
  PackageCheck,
  SendHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const checkoutSchema = z.object({
  name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  phone: z.string().min(10, "Nomor WhatsApp tidak valid"),
  address: z.string().min(10, "Alamat pengiriman terlalu pendek"),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const cart = useCartStore();
  const router = useRouter();

  // Redirect if cart is empty
  useEffect(() => {
    setMounted(true);
    if (cart.items.length === 0) {
      router.push("/cart");
    }
  }, [cart.items.length, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    // 1. Save order to database via API
    const payload = {
      customerName: data.name,
      customerPhone: data.phone,
      customerAddress: data.address,
      notes: data.notes || null,
      totalPrice: cart.getTotal(),
      items: cart.items.map((it) => ({
        productId: it.id,
        quantity: it.quantity,
        price: it.price,
      })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Failed to create order", await res.text());
        return;
      }

      const created = await res.json();

      // 2. Format WhatsApp Message (include order id so admin can correlate)
      const adminPhone = "6288262668629";

      let message = `*PESANAN BARU - PANENHUB*\n\n`;
      message += `Order ID: ${created.id}\n`;
      message += `*Data Pemesan:*\n`;
      message += `Nama: ${data.name}\n`;
      message += `No. WhatsApp: ${data.phone}\n`;
      message += `Alamat: ${data.address}\n`;
      if (data.notes) message += `Catatan: ${data.notes}\n`;

      message += `\n*Detail Pesanan:*\n`;
      cart.items.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (${item.quantity}x) - Rp ${(item.price * item.quantity).toLocaleString("id-ID")}\n`;
      });

      message += `\n*Total Tagihan: Rp ${cart.getTotal().toLocaleString("id-ID")}*`;
      message += `\n\nMohon konfirmasi ketersediaan dan ongkos kirim. Terima kasih!`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;

      // Clear cart upon successful creation
      cart.clearCart();

      // Redirect to WhatsApp
      window.location.href = whatsappUrl;
    } catch (error) {
      console.error("Checkout error", error);
    }
  };

  if (!mounted || cart.items.length === 0) return null;

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Checkout Pesanan
      </h1>

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <PackageCheck className="h-5 w-5 text-primary" /> Alamat
                Pengiriman
              </h2>

              <form
                id="checkout-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    placeholder="Contoh: Budi Santoso"
                    {...register("name")}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">No. WhatsApp</Label>
                  <Input
                    id="phone"
                    placeholder="Contoh: 081234567890"
                    {...register("phone")}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Pengiriman Lengkap</Label>
                  <Input
                    id="address"
                    placeholder="Nama Jalan, RT/RW, Kecamatan, Kota, dsb."
                    {...register("address")}
                    aria-invalid={!!errors.address}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan Pesanan (Opsional)</Label>
                  <Input
                    id="notes"
                    placeholder="Contoh: Pilih buah yang belum terlalu matang"
                    {...register("notes")}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>

              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-muted rounded-md overflow-hidden shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x Rp{" "}
                        {item.price.toLocaleString("id-ID")}
                      </p>
                      <p className="font-bold text-sm mt-1">
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3 text-sm">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Tagihan</span>
                  <span className="text-primary">
                    Rp {cart.getTotal().toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex items-start gap-2 bg-blue-50 text-blue-800 p-3 rounded-md text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>
                    Ongkos kirim akan dikonfirmasi oleh Admin via WhatsApp
                    setelah pesanan dibuat.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            form="checkout-form"
            size="lg"
            className="w-full text-base gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Memproses..."
            ) : (
              <>
                Lanjut ke WhatsApp <SendHorizontal className="h-4 w-4" />
              </>
            )}
          </Button>
          <Link
            href="/cart"
            className="w-full inline-block text-center mt-4 text-sm text-muted-foreground hover:text-foreground"
          >
            Kembali ke Keranjang
          </Link>
        </div>
      </div>
    </div>
  );
}
