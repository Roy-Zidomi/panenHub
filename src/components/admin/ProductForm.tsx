"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Loader2, Save, X } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(1, "Nama produk wajib diisi"),
    description: z.string().optional(),
    price: z.number().min(0, "Harga tidak boleh negatif"),
    stock: z.number().min(0, "Stok tidak boleh negatif"),
    categoryId: z.string().min(1, "Kategori wajib dipilih"),
    image: z.string().optional(),
    quality: z.string(),
    isFeatured: z.boolean(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialData?: any;
    categories: any[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            price: 0,
            stock: 0,
            categoryId: "",
            image: "",
            quality: "Standard",
            isFeatured: false,
        },
    });

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            const url = initialData
                ? `/api/admin/products/${initialData.id}`
                : `/api/admin/products`;

            const response = await fetch(url, {
                method: initialData ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Gagal menyimpan produk");
            }

            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }: { field: any }) => (
                        <FormItem>
                            <FormLabel>Foto Produk</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value || ""}
                                    disabled={loading}
                                    onChange={(url) => field.onChange(url)}
                                    onRemove={() => field.onChange("")}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>Nama Produk</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Contoh: Sayur Bayam Organik" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>Kategori</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>Harga (Rp)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        disabled={loading}
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>Stok</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        disabled={loading}
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="quality"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>Kualitas</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder="Pilih kualitas" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Standard">Standard</SelectItem>
                                        <SelectItem value="Premium">Premium</SelectItem>
                                        <SelectItem value="Export Quality">Export Quality</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }: { field: any }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm h-[80px]">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Produk Unggulan</FormLabel>
                                    <FormDescription>
                                        Produk ini akan muncul di bagian "Produk Terlaris/Terpilih" di halaman utama.
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }: { field: any }) => (
                        <FormItem>
                            <FormLabel>Deskripsi</FormLabel>
                            <FormControl>
                                <textarea
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    disabled={loading}
                                    placeholder="Ceritakan tentang kesegaran produk ini..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center gap-4">
                    <Button disabled={loading} type="submit" className="gap-2">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {initialData ? "Simpan Perubahan" : "Simpan Produk"}
                    </Button>
                    <Button disabled={loading} variant="outline" type="button" onClick={() => router.push("/admin/products")}>
                        <X className="h-4 w-4 mr-2" /> Batal
                    </Button>
                </div>
            </form>
        </Form>
    );
}
