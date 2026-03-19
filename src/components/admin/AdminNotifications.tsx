"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, BellDot, Loader2, Package, ShoppingBag } from "lucide-react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type NotificationSnapshot = {
  settings: {
    newOrder: boolean;
    lowStock: boolean;
    lowStockThreshold: number;
  };
  latestOrder: {
    id: string;
    customerName: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  orderSummary: {
    openCount: number;
    pendingCount: number;
    processingCount: number;
  };
  lowStock: {
    count: number;
    products: Array<{
      id: string;
      name: string;
      stock: number;
      updatedAt: string;
    }>;
  };
  generatedAt: string;
};

type AdminAlert = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
};

const POLLING_INTERVAL_MS = 15000;
const PANEL_MAX_WIDTH = 340;
const PANEL_MARGIN = 12;

type PanelPosition = {
  top: number;
  left: number;
  width: number;
};

function getNotificationPermission(): NotificationPermission {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
}

export function AdminNotifications() {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [panelPosition, setPanelPosition] = useState<PanelPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState<NotificationSnapshot | null>(null);
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [permissionBusy, setPermissionBusy] = useState(false);

  const initializedRef = useRef(false);
  const lastOrderIdRef = useRef<string | null>(null);
  const lastOpenOrderCountRef = useRef<number>(0);
  const knownLowStockIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setIsMounted(true);
    setPermission(getNotificationPermission());
  }, []);

  const updatePanelPosition = useCallback(() => {
    if (!triggerRef.current || typeof window === "undefined") return;

    const rect = triggerRef.current.getBoundingClientRect();
    const width = Math.min(PANEL_MAX_WIDTH, window.innerWidth - PANEL_MARGIN * 2);
    const left = Math.min(
      window.innerWidth - PANEL_MARGIN - width,
      Math.max(PANEL_MARGIN, rect.right - width)
    );
    const top = rect.bottom + 8;

    setPanelPosition({ top, left, width });
  }, []);

  const appendAlert = useCallback((nextAlert: AdminAlert) => {
    setAlerts((prev) => {
      if (prev.some((item) => item.id === nextAlert.id)) return prev;
      return [nextAlert, ...prev].slice(0, 20);
    });
  }, []);

  const emitBrowserNotification = useCallback(
    (title: string, body: string, tag: string) => {
      if (permission !== "granted") return;
      if (typeof window === "undefined" || !("Notification" in window)) return;

      try {
        const notification = new Notification(title, {
          body,
          tag,
        });

        setTimeout(() => notification.close(), 7000);
      } catch {
        // Browser may reject notifications on unsupported context.
      }
    },
    [permission]
  );

  const pollNotifications = useCallback(async () => {
    const response = await fetch("/api/admin/notifications", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Gagal memuat notifikasi admin");
    }

    const data = (await response.json()) as NotificationSnapshot;
    setSnapshot(data);

    const latestOrderId = data.latestOrder?.id ?? null;
    const openOrderCount = data.orderSummary.openCount;
    const currentLowStockIds = new Set(data.lowStock.products.map((item) => item.id));

    if (!initializedRef.current) {
      initializedRef.current = true;
      lastOrderIdRef.current = latestOrderId;
      lastOpenOrderCountRef.current = openOrderCount;
      knownLowStockIdsRef.current = currentLowStockIds;
      return;
    }

    if (data.settings.newOrder && openOrderCount > lastOpenOrderCountRef.current) {
      const delta = openOrderCount - lastOpenOrderCountRef.current;
      const orderAlert: AdminAlert = {
        id: `order-delta-${data.generatedAt}`,
        title: "Pesanan baru masuk",
        message: `Pesanan aktif bertambah +${delta} (total ${openOrderCount}).`,
        createdAt: new Date().toISOString(),
      };
      appendAlert(orderAlert);
      emitBrowserNotification(orderAlert.title, orderAlert.message, orderAlert.id);
    } else if (data.settings.newOrder && latestOrderId && latestOrderId !== lastOrderIdRef.current && data.latestOrder) {
      // Fallback when count cannot represent order event accurately.
      const orderAlert: AdminAlert = {
        id: `order-${latestOrderId}`,
        title: "Pesanan diperbarui",
        message: `Pesanan dari ${data.latestOrder.customerName} terdeteksi.`,
        createdAt: new Date().toISOString(),
      };
      appendAlert(orderAlert);
      emitBrowserNotification(orderAlert.title, orderAlert.message, orderAlert.id);
    }

    if (data.settings.lowStock) {
      const newLowStockProducts = data.lowStock.products.filter(
        (product) => !knownLowStockIdsRef.current.has(product.id)
      );

      if (newLowStockProducts.length > 0) {
        const productNames = newLowStockProducts.slice(0, 3).map((product) => product.name).join(", ");
        const extraCount = newLowStockProducts.length > 3 ? ` +${newLowStockProducts.length - 3} produk` : "";
        const stockAlert: AdminAlert = {
          id: `stock-${newLowStockProducts.map((product) => product.id).sort().join("-")}`,
          title: "Peringatan stok menipis",
          message: `Produk menipis: ${productNames}${extraCount}.`,
          createdAt: new Date().toISOString(),
        };
        appendAlert(stockAlert);
        emitBrowserNotification(stockAlert.title, stockAlert.message, stockAlert.id);
      }
    }

    lastOrderIdRef.current = latestOrderId;
    lastOpenOrderCountRef.current = openOrderCount;
    knownLowStockIdsRef.current = currentLowStockIds;
  }, [appendAlert, emitBrowserNotification]);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setInterval> | null = null;

    const run = async () => {
      try {
        await pollNotifications();
      } catch {
        // Keep silent to avoid noisy UI in header.
      } finally {
        if (active) setLoading(false);
      }
    };

    void run();
    timer = setInterval(() => {
      void run();
    }, POLLING_INTERVAL_MS);

    return () => {
      active = false;
      if (timer) clearInterval(timer);
    };
  }, [pollNotifications]);

  useEffect(() => {
    if (!isOpen) return;

    updatePanelPosition();

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, true);
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition, true);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, updatePanelPosition]);

  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    try {
      setPermissionBusy(true);
      const result = await Notification.requestPermission();
      setPermission(result);
    } finally {
      setPermissionBusy(false);
    }
  };

  const unreadCount = snapshot?.orderSummary.openCount ?? alerts.length;

  return (
    <div className="relative">
      <Button
        ref={triggerRef}
        variant="outline"
        size="icon"
        className="relative rounded-full border-border/80 bg-card/70 shadow-sm"
        onClick={() => {
          setIsOpen((prev) => !prev);
          updatePanelPosition();
        }}
        aria-label="Buka notifikasi admin"
      >
        {unreadCount > 0 ? <BellDot className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {Math.min(99, unreadCount)}
          </span>
        )}
      </Button>

      {isMounted &&
        isOpen &&
        panelPosition &&
        createPortal(
          <>
            <button
              type="button"
              aria-label="Tutup panel notifikasi"
              className="fixed inset-0 z-[180] bg-transparent"
              onClick={() => setIsOpen(false)}
            />
            <div
              className="surface-panel fixed z-[190] max-h-[calc(100vh-92px)] overflow-auto rounded-2xl border p-3 shadow-2xl"
              style={{
                top: panelPosition.top,
                left: panelPosition.left,
                width: panelPosition.width,
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold">Notifikasi Admin</p>
                {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>

              {permission !== "granted" && (
                <div className="mb-3 rounded-xl border border-amber-200/70 bg-amber-50/80 p-2.5 text-xs text-amber-800">
                  <p className="mb-2">Aktifkan notifikasi browser agar alert muncul otomatis.</p>
                  <Button size="sm" variant="secondary" onClick={requestPermission} disabled={permissionBusy}>
                    {permissionBusy ? "Meminta izin..." : "Aktifkan"}
                  </Button>
                </div>
              )}

              {!snapshot ? (
                <p className="text-sm text-muted-foreground">Belum ada data notifikasi.</p>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl border border-border/70 bg-card/60 p-2.5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Status Sekarang
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground" /> Pesanan aktif
                        </span>
                        <Badge className="border-blue-200 bg-blue-100 text-blue-700 hover:bg-blue-100">
                          +{snapshot.orderSummary.openCount}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Pending: {snapshot.orderSummary.pendingCount} | Diproses: {snapshot.orderSummary.processingCount}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5">
                          <Package className="h-4 w-4 text-muted-foreground" /> Stok menipis
                        </span>
                        <Badge className="border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-100">
                          {snapshot.lowStock.count}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {snapshot.lowStock.products.length > 0 && (
                    <div className="rounded-xl border border-border/70 bg-card/60 p-2.5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Produk Stok Menipis ({"<="} {snapshot.settings.lowStockThreshold})
                      </p>
                      <div className="space-y-1.5">
                        {snapshot.lowStock.products.slice(0, 5).map((product) => (
                          <div key={product.id} className="flex items-center justify-between text-xs">
                            <span className="truncate pr-2">{product.name}</span>
                            <span className="font-semibold text-amber-700">{product.stock}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-border/70 bg-card/60 p-2.5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Alert Terbaru
                    </p>
                    {alerts.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Belum ada alert baru pada sesi ini.</p>
                    ) : (
                      <div className="space-y-2">
                        {alerts.slice(0, 5).map((alert) => (
                          <div key={alert.id} className="rounded-md border border-border/70 px-2 py-1.5">
                            <p className="text-xs font-semibold">{alert.title}</p>
                            <p className="text-xs text-muted-foreground">{alert.message}</p>
                            <p className="mt-1 text-[10px] text-muted-foreground">
                              {new Date(alert.createdAt).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
