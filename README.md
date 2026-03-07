# PanenHub App

Marketplace UMKM dengan dua area utama:
- Storefront untuk pengunjung (tanpa login).
- Admin panel untuk pengelolaan data produk dan pesanan.

## Akses Login

- User/pengunjung: tidak perlu login.
- Admin: login hanya melalui URL `/admin/login`.
- Setelah login admin, fitur tambah/edit/hapus data tersedia di area admin.

## Menjalankan Project

```bash
npm install
npm run dev
```

Buka aplikasi di:
- `http://localhost:3000` untuk storefront.
- `http://localhost:3000/admin/login` untuk admin login.

## Tutorial Upload Gambar Produk (Admin)

### Cara paling mudah (tanpa Cloudinary)

1. Login admin di `http://localhost:3000/admin/login`.
2. Buka menu tambah/edit produk.
3. Klik tombol **Upload dari Komputer**.
4. Pilih file gambar dari laptop/PC (jpg/png/webp, maksimal 5MB).
5. Tunggu proses upload selesai, preview gambar akan muncul.
6. Klik **Simpan Produk**.

Catatan:
- Jika gambar berhasil dipilih tapi preview tidak muncul, cek pesan error merah di bawah tombol upload.
- Gambar lokal disimpan di folder `public/uploads`.

### Opsi Cloudinary (opsional)

Jika ingin pakai Cloudinary, isi env valid di `umkm-market/.env`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=nama_cloud_anda
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=nama_unsigned_preset_anda
CLOUDINARY_API_KEY=api_key_anda
CLOUDINARY_API_SECRET=api_secret_anda
```

Lalu restart server `npm run dev`. Setelah itu tombol **Upload via Cloudinary** akan aktif.

## Catatan Admin (opsional untuk local dev)

Jika akun admin belum ada, buat akun lewat endpoint seed:

```bash
curl -X POST http://localhost:3000/api/seed/admin \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin PanenHub\",\"email\":\"admin@panenhub.com\",\"password\":\"password123\"}"
```
