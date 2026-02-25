"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteProductButtonProps {
    id: string;
    name: string;
}

export function DeleteProductButton({ id, name }: DeleteProductButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onDelete = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/products/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Gagal menghapus produk");
            }

            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Produk <strong>{name}</strong> akan dihapus secara permanen dari database.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onDelete}
                        disabled={loading}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Hapus Produk"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
