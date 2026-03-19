"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, LocateFixed, PackageCheck, SendHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHydrated } from "@/hooks/use-hydrated";

const checkoutSchema = z.object({
  name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  phone: z.string().min(10, "Nomor WhatsApp tidak valid"),
  address: z.string().min(10, "Alamat pengiriman terlalu pendek"),
  locationUrl: z.string().url("Masukkan link lokasi Google Maps yang valid"),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

type PublicCheckoutConfig = {
  adminWhatsapp: string;
  whatsappTemplate: string;
  defaultOrderNote: string;
};

export default function CheckoutPage() {
  const mounted = useHydrated();
  const cart = useCartStore();
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [locationBusy, setLocationBusy] = useState(false);
  const [locationHint, setLocationHint] = useState<string | null>(null);
  const [locationPreview, setLocationPreview] = useState("");
  const [checkoutConfig, setCheckoutConfig] = useState<PublicCheckoutConfig>({
    adminWhatsapp: "6288262668629",
    whatsappTemplate: "*PESANAN BARU - PANENHUB*",
    defaultOrderNote: "",
  });

  useEffect(() => {
    if (mounted && cart.items.length === 0) {
      router.push("/cart");
    }
  }, [mounted, cart.items.length, router]);

  useEffect(() => {
    let cancelled = false;

    async function loadPublicSettings() {
      try {
        const res = await fetch("/api/settings/public", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;

        setCheckoutConfig({
          adminWhatsapp: data?.checkout?.adminWhatsapp || "6288262668629",
          whatsappTemplate: data?.checkout?.whatsappTemplate || "*PESANAN BARU - PANENHUB*",
          defaultOrderNote: data?.checkout?.defaultOrderNote || "",
        });
      } catch {
        // Fallback to defaults when settings are unavailable.
      }
    }

    void loadPublicSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });
  const locationUrlField = register("locationUrl");

  const handleUseCurrentLocation = () => {
    setLocationHint(null);

    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setLocationHint("Browser tidak mendukung fitur lokasi. Isi link Google Maps secara manual.");
      return;
    }

    setLocationBusy(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        setValue("locationUrl", mapsUrl, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
        setLocationPreview(mapsUrl);
        setLocationHint("Lokasi berhasil diambil. Silakan lanjutkan checkout.");
        setLocationBusy(false);
      },
      () => {
        setLocationHint("Gagal mengambil lokasi. Izinkan akses lokasi atau isi link Google Maps manual.");
        setLocationBusy(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    setSubmitError(null);

    const payload = {
      customerName: data.name,
      customerPhone: data.phone,
      customerAddress: data.address,
      locationUrl: data.locationUrl,
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
        let message = "Pesanan gagal dibuat. Silakan coba lagi.";

        try {
          const errorData = await res.json();
          if (typeof errorData?.error === "string") {
            message = errorData.error;
          }
          const locationFieldError = errorData?.details?.fieldErrors?.locationUrl;
          if (Array.isArray(locationFieldError) && locationFieldError.length > 0) {
            message = locationFieldError[0] as string;
          }

          const stockProductName = errorData?.details?.insufficientItem?.productName;
          if (typeof stockProductName === "string" && stockProductName.trim().length > 0) {
            message = `Stok ${stockProductName} tidak mencukupi. Mohon sesuaikan jumlah belanja.`;
          }
        } catch {
          // keep generic message for non-JSON error responses
        }

        setSubmitError(message);
        return;
      }

      const created = await res.json();
      const adminPhone = checkoutConfig.adminWhatsapp.replace(/\D/g, "") || "6288262668629";

      let message = `${checkoutConfig.whatsappTemplate || "*PESANAN BARU - PANENHUB*"}\n\n`;
      message += `Order ID: ${created.id}\n`;
      message += "*Data Pemesan:*\n";
      message += `Nama: ${data.name}\n`;
      message += `No. WhatsApp: ${data.phone}\n`;
      message += `Alamat: ${data.address}\n`;
      message += `Lokasi Maps: ${data.locationUrl}\n`;
      if (data.notes) {
        message += `Catatan: ${data.notes}\n`;
      } else if (checkoutConfig.defaultOrderNote) {
        message += `Catatan: ${checkoutConfig.defaultOrderNote}\n`;
      }

      message += "\n*Detail Pesanan:*\n";
      cart.items.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (${item.quantity}x) - Rp ${(item.price * item.quantity).toLocaleString("id-ID")}\n`;
      });

      message += `\n*Total Tagihan: Rp ${cart.getTotal().toLocaleString("id-ID")}*`;
      message += "\n\nMohon konfirmasi ketersediaan dan ongkos kirim. Terima kasih!";

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;

      cart.clearCart();
      window.location.assign(whatsappUrl);
    } catch (error) {
      console.error("Checkout error", error);
      setSubmitError("Terjadi gangguan saat checkout. Silakan coba lagi.");
    }
  };

  if (!mounted || cart.items.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-8 md:py-12">
      <h1 className="font-display mb-8 text-3xl font-bold tracking-tight">Checkout Pesanan</h1>

      <div className="grid items-start gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card className="surface-panel reveal-up rounded-2xl border">
            <CardContent className="p-6">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                <PackageCheck className="h-5 w-5 text-primary" /> Alamat Pengiriman
              </h2>

              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input id="name" placeholder="Contoh: Budi Santoso" {...register("name")} aria-invalid={!!errors.name} />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">No. WhatsApp</Label>
                  <Input id="phone" placeholder="Contoh: 081234567890" {...register("phone")} aria-invalid={!!errors.phone} />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Pengiriman Lengkap</Label>
                  <Input
                    id="address"
                    placeholder="Nama Jalan, RT/RW, Kecamatan, Kota, dsb."
                    {...register("address")}
                    aria-invalid={!!errors.address}
                  />
                  {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locationUrl">Titik Lokasi Rumah (Google Maps)</Label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      id="locationUrl"
                      placeholder="https://www.google.com/maps?q=-6.200000,106.816666"
                      {...locationUrlField}
                      onChange={(event) => {
                        locationUrlField.onChange(event);
                        setLocationPreview(event.target.value);
                      }}
                      aria-invalid={!!errors.locationUrl}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      className="gap-2 sm:w-auto"
                      onClick={handleUseCurrentLocation}
                      disabled={locationBusy}
                    >
                      <LocateFixed className="h-4 w-4" />
                      {locationBusy ? "Mengambil..." : "Gunakan Lokasi Saya"}
                    </Button>
                  </div>
                  {errors.locationUrl && <p className="text-sm text-red-500">{errors.locationUrl.message}</p>}
                  {!errors.locationUrl && locationHint && <p className="text-xs text-muted-foreground">{locationHint}</p>}
                  {!errors.locationUrl && locationPreview && (
                    <a
                      href={locationPreview}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-xs text-primary hover:underline"
                    >
                      Cek titik lokasi di Google Maps
                    </a>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan Pesanan (Opsional)</Label>
                  <Input id="notes" placeholder="Contoh: Pilih buah yang belum terlalu matang" {...register("notes")} />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card className="surface-panel reveal-up reveal-delay-1 rounded-2xl border">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-bold">Ringkasan Pesanan</h2>

              <div className="mb-6 space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">No Image</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="line-clamp-1 text-sm font-semibold">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                      </p>
                      <p className="mt-1 text-sm font-bold">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-border/70 pt-4 text-sm">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Tagihan</span>
                  <span className="text-primary">Rp {cart.getTotal().toLocaleString("id-ID")}</span>
                </div>
                <div className="flex items-start gap-2 rounded-md border border-blue-200/70 bg-blue-50/80 p-3 text-xs text-blue-800">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>Ongkos kirim akan dikonfirmasi oleh Admin via WhatsApp setelah pesanan dibuat.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            form="checkout-form"
            size="lg"
            className="w-full gap-2 text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Memproses..." : <><span>Lanjut ke WhatsApp</span><SendHorizontal className="h-4 w-4" /></>}
          </Button>
          {submitError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <Link href="/cart" className="inline-block w-full text-center text-sm text-muted-foreground hover:text-foreground">
            Kembali ke Keranjang
          </Link>
        </div>
      </div>
    </div>
  );
}
