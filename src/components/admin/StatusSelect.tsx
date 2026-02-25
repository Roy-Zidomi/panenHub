"use client";

import { useState } from "react";
import { OrderStatus } from "@prisma/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface StatusSelectProps {
    orderId: string;
    initialStatus: OrderStatus;
}

export function StatusSelect({ orderId, initialStatus }: StatusSelectProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onStatusChange = async (newStatus: string) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error("Gagal memperbarui status");
            }

            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <Select
                disabled={loading}
                defaultValue={initialStatus}
                onValueChange={onStatusChange}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="PENDING">Menunggu</SelectItem>
                    <SelectItem value="PROCESSING">Diproses</SelectItem>
                    <SelectItem value="COMPLETED">Selesai</SelectItem>
                    <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
