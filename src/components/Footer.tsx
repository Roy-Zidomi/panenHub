import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t bg-muted/20">
            <div className="container mx-auto px-4 sm:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-primary">PanenHub</h3>
                        <p className="text-sm text-muted-foreground w-3/4">
                            Marketplace makanan UMKM terpercaya, menghubungkan penjual lokal dengan pembeli di seluruh Indonesia.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Tautan</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors">Beranda</Link></li>
                            <li><Link href="/products" className="hover:text-primary transition-colors">Produk</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">Tentang Kami</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Kategori</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/products?category=sayuran" className="hover:text-primary transition-colors">Sayuran</Link></li>
                            <li><Link href="/products?category=buah" className="hover:text-primary transition-colors">Buah-buahan</Link></li>
                            <li><Link href="/products?category=daging" className="hover:text-primary transition-colors">Daging & Ayam</Link></li>
                            <li><Link href="/products?category=telur" className="hover:text-primary transition-colors">Telur</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Kontak</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Email: hello@panenhub.com</li>
                            <li>WhatsApp: +62 812 3456 7890</li>
                            <li>Alamat: Jakarta, Indonesia</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} PanenHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
