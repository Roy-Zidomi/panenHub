"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Loader2, ShieldAlert, Save } from "lucide-react";

type AppSettings = {
  storeProfile: {
    storeName: string;
    storeDescription: string;
    storeLogoUrl: string;
    contactWhatsapp: string;
    contactEmail: string;
    address: string;
  };
  checkout: {
    adminWhatsapp: string;
    whatsappTemplate: string;
    defaultOrderNote: string;
    allowGuestCheckout: boolean;
  };
  shipping: {
    serviceAreas: string;
    deliveryEstimate: string;
    defaultShippingCost: number;
    freeShippingMinimum: number;
  };
  payment: {
    methods: {
      bankTransfer: boolean;
      eWallet: boolean;
      cod: boolean;
    };
    instructions: string;
  };
  operations: {
    openDays: Array<"Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun">;
    openTime: string;
    closeTime: string;
  };
  notifications: {
    newOrder: boolean;
    orderStatus: boolean;
    dailySummary: boolean;
    lowStock: boolean;
    lowStockThreshold: number;
  };
  security: {
    authTokenVersion: number;
  };
};

type AccountData = {
  id: string;
  name: string;
  email: string;
  role: string;
  updatedAt: string;
};

type ActivityItem = {
  id: string;
  action: string;
  details: string | null;
  createdAt: string;
};

const DAY_OPTIONS: Array<{ value: AppSettings["operations"]["openDays"][number]; label: string }> = [
  { value: "Mon", label: "Senin" },
  { value: "Tue", label: "Selasa" },
  { value: "Wed", label: "Rabu" },
  { value: "Thu", label: "Kamis" },
  { value: "Fri", label: "Jumat" },
  { value: "Sat", label: "Sabtu" },
  { value: "Sun", label: "Minggu" },
];

export function SettingsClient() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [account, setAccount] = useState<AccountData | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [accountForm, setAccountForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    void loadSettings();
  }, []);

  const activityLabel = useMemo(
    () => ({
      LOGIN_SUCCESS: "Login berhasil",
      SETTINGS_UPDATED: "Pengaturan diperbarui",
      ACCOUNT_UPDATED: "Akun diperbarui",
      LOGOUT_ALL_SESSIONS: "Logout semua sesi",
    }),
    []
  );

  async function loadSettings() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data pengaturan");
      const data = await res.json();
      setSettings(data.settings as AppSettings);
      setAccount(data.account as AccountData);
      setActivities((data.recentActivity ?? []) as ActivityItem[]);
      setAccountForm({
        name: data.account?.name ?? "",
        email: data.account?.email ?? "",
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Gagal memuat pengaturan.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function saveSettingsPatch(key: string, patch: unknown) {
    setSavingKey(key);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan pengaturan");
      setSettings(data.settings as AppSettings);
      setMessage({ type: "success", text: "Pengaturan berhasil disimpan." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Gagal menyimpan pengaturan.",
      });
    } finally {
      setSavingKey(null);
    }
  }

  async function saveAccount() {
    setSavingKey("account");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accountForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui akun");

      setAccount(data.account as AccountData);
      setAccountForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
      setMessage({ type: "success", text: "Akun admin berhasil diperbarui." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Gagal memperbarui akun.",
      });
    } finally {
      setSavingKey(null);
    }
  }

  async function logoutAllSessions() {
    setSavingKey("logout-all");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings/security/logout-all", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memutus semua sesi");
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Gagal memutus semua sesi.",
      });
      setSavingKey(null);
    }
  }

  if (loading || !settings) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="reveal-up">
        <h1 className="font-display text-3xl font-bold tracking-tight">Pengaturan Admin</h1>
        <p className="text-muted-foreground">Kelola pengaturan toko, operasional, notifikasi, akun, dan keamanan.</p>
      </div>

      {message && (
        <div
          className={[
            "rounded-xl border px-4 py-3 text-sm",
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700",
          ].join(" ")}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="surface-panel rounded-2xl border">
          <CardHeader>
            <CardTitle>Profil Toko</CardTitle>
            <CardDescription>Informasi utama yang tampil pada storefront dan kontak toko.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Toko</Label>
              <Input
                value={settings.storeProfile.storeName}
                onChange={(e) =>
                  setSettings((prev) =>
                    prev
                      ? { ...prev, storeProfile: { ...prev.storeProfile, storeName: e.target.value } }
                      : prev
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <textarea
                className="min-h-[88px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                value={settings.storeProfile.storeDescription}
                onChange={(e) =>
                  setSettings((prev) =>
                    prev
                      ? { ...prev, storeProfile: { ...prev.storeProfile, storeDescription: e.target.value } }
                      : prev
                  )
                }
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input
                  value={settings.storeProfile.contactWhatsapp}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev
                        ? { ...prev, storeProfile: { ...prev.storeProfile, contactWhatsapp: e.target.value } }
                        : prev
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email Kontak</Label>
                <Input
                  value={settings.storeProfile.contactEmail}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev
                        ? { ...prev, storeProfile: { ...prev.storeProfile, contactEmail: e.target.value } }
                        : prev
                    )
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Alamat Toko</Label>
              <Input
                value={settings.storeProfile.address}
                onChange={(e) =>
                  setSettings((prev) =>
                    prev ? { ...prev, storeProfile: { ...prev.storeProfile, address: e.target.value } } : prev
                  )
                }
              />
            </div>
            <Button
              className="gap-2"
              onClick={() => saveSettingsPatch("store", { storeProfile: settings.storeProfile })}
              disabled={savingKey === "store"}
            >
              {savingKey === "store" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Profil Toko
            </Button>
          </CardContent>
        </Card>

        <Card className="surface-panel rounded-2xl border">
          <CardHeader>
            <CardTitle>Pengaturan Checkout</CardTitle>
            <CardDescription>Nomor tujuan WhatsApp dan template pesan order.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nomor WhatsApp Admin</Label>
              <Input
                value={settings.checkout.adminWhatsapp}
                onChange={(e) =>
                  setSettings((prev) =>
                    prev ? { ...prev, checkout: { ...prev.checkout, adminWhatsapp: e.target.value } } : prev
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Template Header Pesan</Label>
              <Input
                value={settings.checkout.whatsappTemplate}
                onChange={(e) =>
                  setSettings((prev) =>
                    prev ? { ...prev, checkout: { ...prev.checkout, whatsappTemplate: e.target.value } } : prev
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Catatan Default Checkout</Label>
              <textarea
                className="min-h-[88px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                value={settings.checkout.defaultOrderNote}
                onChange={(e) =>
                  setSettings((prev) =>
                    prev ? { ...prev, checkout: { ...prev.checkout, defaultOrderNote: e.target.value } } : prev
                  )
                }
              />
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 px-3 py-2">
              <Checkbox
                checked={settings.checkout.allowGuestCheckout}
                onCheckedChange={(checked) =>
                  setSettings((prev) =>
                    prev
                      ? { ...prev, checkout: { ...prev.checkout, allowGuestCheckout: checked === true } }
                      : prev
                  )
                }
              />
              <span className="text-sm">Izinkan checkout tanpa akun</span>
            </label>
            <Button
              className="gap-2"
              onClick={() => saveSettingsPatch("checkout", { checkout: settings.checkout })}
              disabled={savingKey === "checkout"}
            >
              {savingKey === "checkout" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Checkout
            </Button>
          </CardContent>
        </Card>

        <Card className="surface-panel rounded-2xl border">
          <CardHeader>
            <CardTitle>Pengiriman</CardTitle>
            <CardDescription>Atur area layanan, estimasi, dan biaya pengiriman.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Area Layanan</Label>
              <Input
                value={settings.shipping.serviceAreas}
                onChange={(e) =>
                  setSettings((prev) =>
                    prev ? { ...prev, shipping: { ...prev.shipping, serviceAreas: e.target.value } } : prev
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Estimasi Pengiriman</Label>
              <Input
                value={settings.shipping.deliveryEstimate}
                onChange={(e) =>
                  setSettings((prev) =>
                    prev ? { ...prev, shipping: { ...prev.shipping, deliveryEstimate: e.target.value } } : prev
                  )
                }
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Ongkir Default (Rp)</Label>
                <Input
                  type="number"
                  min={0}
                  value={settings.shipping.defaultShippingCost}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev
                        ? {
                            ...prev,
                            shipping: {
                              ...prev.shipping,
                              defaultShippingCost: Number(e.target.value || 0),
                            },
                          }
                        : prev
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Gratis Ongkir Minimal (Rp)</Label>
                <Input
                  type="number"
                  min={0}
                  value={settings.shipping.freeShippingMinimum}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev
                        ? {
                            ...prev,
                            shipping: {
                              ...prev.shipping,
                              freeShippingMinimum: Number(e.target.value || 0),
                            },
                          }
                        : prev
                    )
                  }
                />
              </div>
            </div>
            <Button
              className="gap-2"
              onClick={() => saveSettingsPatch("shipping", { shipping: settings.shipping })}
              disabled={savingKey === "shipping"}
            >
              {savingKey === "shipping" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Pengiriman
            </Button>
          </CardContent>
        </Card>

        <Card className="surface-panel rounded-2xl border">
          <CardHeader>
            <CardTitle>Metode Pembayaran</CardTitle>
            <CardDescription>Pilih metode pembayaran aktif dan instruksi untuk pelanggan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <label className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 px-3 py-2">
                <Checkbox
                  checked={settings.payment.methods.bankTransfer}
                  onCheckedChange={(checked) =>
                    setSettings((prev) =>
                      prev
                        ? {
                            ...prev,
                            payment: {
                              ...prev.payment,
                              methods: { ...prev.payment.methods, bankTransfer: checked === true },
                            },
                          }
                        : prev
                    )
                  }
                />
                <span className="text-sm">Bank Transfer</span>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 px-3 py-2">
                <Checkbox
                  checked={settings.payment.methods.eWallet}
                  onCheckedChange={(checked) =>
                    setSettings((prev) =>
                      prev
                        ? {
                            ...prev,
                            payment: {
                              ...prev.payment,
                              methods: { ...prev.payment.methods, eWallet: checked === true },
                            },
                          }
                        : prev
                    )
                  }
                />
                <span className="text-sm">E-Wallet</span>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 px-3 py-2">
                <Checkbox
                  checked={settings.payment.methods.cod}
                  onCheckedChange={(checked) =>
                    setSettings((prev) =>
                      prev
                        ? {
                            ...prev,
                            payment: {
                              ...prev.payment,
                              methods: { ...prev.payment.methods, cod: checked === true },
                            },
                          }
                        : prev
                    )
                  }
                />
                <span className="text-sm">COD</span>
              </label>
            </div>
            <div className="space-y-2">
              <Label>Instruksi Pembayaran</Label>
              <textarea
                className="min-h-[88px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                value={settings.payment.instructions}
                onChange={(e) =>
                  setSettings((prev) =>
                    prev ? { ...prev, payment: { ...prev.payment, instructions: e.target.value } } : prev
                  )
                }
              />
            </div>
            <Button
              className="gap-2"
              onClick={() => saveSettingsPatch("payment", { payment: settings.payment })}
              disabled={savingKey === "payment"}
            >
              {savingKey === "payment" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Pembayaran
            </Button>
          </CardContent>
        </Card>

        <Card className="surface-panel rounded-2xl border">
          <CardHeader>
            <CardTitle>Jam Operasional</CardTitle>
            <CardDescription>Atur hari buka dan jam operasional toko.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {DAY_OPTIONS.map((day) => {
                const checked = settings.operations.openDays.includes(day.value);
                return (
                  <label
                    key={day.value}
                    className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/60 px-3 py-2 text-sm"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(next) =>
                        setSettings((prev) => {
                          if (!prev) return prev;
                          const nextDays = next === true
                            ? [...prev.operations.openDays, day.value]
                            : prev.operations.openDays.filter((d) => d !== day.value);

                          return {
                            ...prev,
                            operations: {
                              ...prev.operations,
                              openDays: Array.from(new Set(nextDays)),
                            },
                          };
                        })
                      }
                    />
                    {day.label}
                  </label>
                );
              })}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Jam Buka</Label>
                <Input
                  type="time"
                  value={settings.operations.openTime}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev ? { ...prev, operations: { ...prev.operations, openTime: e.target.value } } : prev
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Jam Tutup</Label>
                <Input
                  type="time"
                  value={settings.operations.closeTime}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev ? { ...prev, operations: { ...prev.operations, closeTime: e.target.value } } : prev
                    )
                  }
                />
              </div>
            </div>
            <Button
              className="gap-2"
              onClick={() => saveSettingsPatch("operations", { operations: settings.operations })}
              disabled={savingKey === "operations"}
            >
              {savingKey === "operations" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Operasional
            </Button>
          </CardContent>
        </Card>

        <Card className="surface-panel rounded-2xl border">
          <CardHeader>
            <CardTitle>Notifikasi Admin</CardTitle>
            <CardDescription>Pilih notifikasi yang ingin diterima pada panel admin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 px-3 py-2">
              <Checkbox
                checked={settings.notifications.newOrder}
                onCheckedChange={(checked) =>
                  setSettings((prev) =>
                    prev
                      ? { ...prev, notifications: { ...prev.notifications, newOrder: checked === true } }
                      : prev
                  )
                }
              />
              <span className="text-sm">Notifikasi order baru</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 px-3 py-2">
              <Checkbox
                checked={settings.notifications.orderStatus}
                onCheckedChange={(checked) =>
                  setSettings((prev) =>
                    prev
                      ? { ...prev, notifications: { ...prev.notifications, orderStatus: checked === true } }
                      : prev
                  )
                }
              />
              <span className="text-sm">Notifikasi perubahan status order</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 px-3 py-2">
              <Checkbox
                checked={settings.notifications.dailySummary}
                onCheckedChange={(checked) =>
                  setSettings((prev) =>
                    prev
                      ? { ...prev, notifications: { ...prev.notifications, dailySummary: checked === true } }
                      : prev
                  )
                }
              />
              <span className="text-sm">Ringkasan harian</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 px-3 py-2">
              <Checkbox
                checked={settings.notifications.lowStock}
                onCheckedChange={(checked) =>
                  setSettings((prev) =>
                    prev
                      ? { ...prev, notifications: { ...prev.notifications, lowStock: checked === true } }
                      : prev
                  )
                }
              />
              <span className="text-sm">Notifikasi stok menipis</span>
            </label>
            <div className="space-y-2">
              <Label>Ambang Batas Stok Menipis</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={settings.notifications.lowStockThreshold}
                onChange={(e) =>
                  setSettings((prev) =>
                    prev
                      ? {
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            lowStockThreshold: Math.min(100, Math.max(1, Number(e.target.value || 1))),
                          },
                        }
                      : prev
                  )
                }
              />
              <p className="text-xs text-muted-foreground">
                Produk dengan stok kurang dari atau sama dengan nilai ini akan memicu notifikasi.
              </p>
            </div>
            <Button
              className="gap-2"
              onClick={() => saveSettingsPatch("notifications", { notifications: settings.notifications })}
              disabled={savingKey === "notifications"}
            >
              {savingKey === "notifications" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Notifikasi
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="surface-panel rounded-2xl border">
          <CardHeader>
            <CardTitle>Akun Admin</CardTitle>
            <CardDescription>Perbarui profil akun dan password admin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nama</Label>
              <Input value={accountForm.name} onChange={(e) => setAccountForm((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={accountForm.email} onChange={(e) => setAccountForm((prev) => ({ ...prev, email: e.target.value }))} />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Password Saat Ini</Label>
                <Input
                  type="password"
                  value={accountForm.currentPassword}
                  onChange={(e) => setAccountForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Password Baru</Label>
                <Input
                  type="password"
                  value={accountForm.newPassword}
                  onChange={(e) => setAccountForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                />
              </div>
            </div>
            <Button className="gap-2" onClick={saveAccount} disabled={savingKey === "account"}>
              {savingKey === "account" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Akun
            </Button>
          </CardContent>
        </Card>

        <Card className="surface-panel rounded-2xl border">
          <CardHeader>
            <CardTitle>Keamanan</CardTitle>
            <CardDescription>Kelola sesi login dan pantau aktivitas akun admin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-amber-200/70 bg-amber-50/80 px-4 py-3 text-sm text-amber-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Tombol ini akan memutus semua sesi aktif admin di semua perangkat dan meminta login ulang.
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              className="gap-2"
              onClick={logoutAllSessions}
              disabled={savingKey === "logout-all"}
            >
              {savingKey === "logout-all" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
              Logout Semua Sesi
            </Button>

            <div className="rounded-xl border border-border/70 bg-card/60 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Aktivitas Terakhir</p>
              {activities.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada riwayat aktivitas login.</p>
              ) : (
                <div className="space-y-2">
                  {activities.map((item) => (
                    <div key={item.id} className="rounded-md border border-border/70 px-3 py-2">
                      <p className="text-sm font-medium">
                        {activityLabel[item.action as keyof typeof activityLabel] ?? item.action}
                      </p>
                      {item.details && <p className="text-xs text-muted-foreground">{item.details}</p>}
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {account && (
              <p className="text-xs text-muted-foreground">
                Akun aktif: <span className="font-medium text-foreground">{account.name}</span> ({account.role})
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
