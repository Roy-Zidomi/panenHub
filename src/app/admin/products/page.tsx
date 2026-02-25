export const dynamic = 'force-dynamic';

import { getProducts } from "@/services/product.service";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Pencil,
    Trash2,
    ExternalLink,
    Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
    const products = await getProducts();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manajemen Produk</h1>
                    <p className="text-muted-foreground">
                        Kelola inventaris produk marketplace Anda.
                    </p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Tambah Produk
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Foto</TableHead>
                            <TableHead>Nama Produk</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Harga</TableHead>
                            <TableHead>Stok</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    Belum ada produk. Silakan tambah produk baru.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product: any) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                                            {product.image ? (
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{product.name}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase">{product.quality}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{product.category.name}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        Rp {product.price.toLocaleString("id-ID")}
                                    </TableCell>
                                    <TableCell>
                                        <span className={product.stock <= 5 ? "text-red-500 font-bold" : ""}>
                                            {product.stock}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {product.isFeatured ? (
                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                                                Unggulan
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">Reguler</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/products/${product.id}`} target="_blank">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <DeleteProductButton id={product.id} name={product.name} />
                                        </div>
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
