# MaemYuk Web

Prototipe web interaktif **MaemYuk**, platform yang mempertemukan UMKM kuliner dengan pembeli di sekitar untuk menjual makanan surplus di penghujung hari dengan harga lebih hemat, sekaligus membantu mengurangi food waste.

Proyek ini adalah **Modul 8: Data Dinamis dan Logika Aplikasi** dari program magang Vinix Batch 5, dikerjakan oleh **Kelompok 3 Peluru UT**. Modul ini melanjutkan prototipe Modul 7 (Transformasi Desain Figma ke Prototipe Web Interaktif): data produk kini diambil dari database Supabase, ada pencarian dan filter, form pesanan dengan validasi, serta kondisi tampilan untuk memuat, kosong, dan galat.

| Informasi | Tautan |
| --- | --- |
| Link live web | https://maemyuk.netlify.app/ |
| Repositori | https://github.com/MuhammadHumamArij/maemyuk-web.git |
| Desain Figma | https://www.figma.com/design/8AKKdpCaWkA5L2PwUPxbRe/UI-Startup-MaemYuk?node-id=155-104 |
| PRD | PRD.md |
| Log prompt Modul 8 | [docs/prompt-log-modul8.md](docs/prompt-log-modul8.md) |
| Log prompt Modul 7 | [docs/prompt-log.md](docs/prompt-log.md) |

## Anggota tim

| Anggota | Peran di Modul 8 |
| --- | --- |
| Muhammad Humam Arij | Data dinamis (Supabase, skema, pemuat produk), penyambungan halaman Katalog, Beranda, Detail Produk, dan Keranjang, skeleton dan penanganan galat, deploy, serta dokumentasi. |
| Nafisa | Form Checkout (validasi dan sanitasi nama), pengiriman pesanan ke database, komponen toast, dan perbaikan refresh di halaman Checkout. Pull Request #16 sudah digabung. |

Pembagian kerja memakai aturan satu berkas hanya diedit satu orang, sehingga tidak ada konflik di Git. Rincian ada di bagian [Kontribusi anggota](#kontribusi-anggota).

## Sumber data dan layanan

Data disimpan di **Supabase** (database PostgreSQL yang diakses lewat library `@supabase/supabase-js`). Supabase dipilih dibanding MockAPI.io karena memberi database sungguhan dengan aturan akses per tabel, dan pesanan yang dikirim form benar-benar tersimpan. Skema lengkap beserta data awal ada di [supabase/schema.sql](supabase/schema.sql).

| Tabel | Isi | Aturan akses (Row Level Security) |
| --- | --- | --- |
| `toko` | Nama, alamat, dan jam tutup toko (6 baris) | Hanya bisa dibaca |
| `products` | Produk lengkap dengan harga, harga asli, jarak, rating, ulasan, dan gambar (8 baris) | Hanya bisa dibaca |
| `orders` | Pesanan: nama penerima, metode pembayaran, total, hemat, dan rincian per toko | Hanya bisa ditambah, tidak bisa dibaca publik |

Alur data: halaman memanggil `muatProduk()` di `src/productStore.js`, yang mengambil tabel `products` dan menerjemahkan nama kolom `snake_case` (misalnya `harga_asli`) ke nama yang dipakai komponen (`hargaAsli`). Komponen membaca `productState` (daftar produk, status memuat, dan galat), sehingga tampilan otomatis berganti saat data datang.

Beberapa isian database juga dijaga oleh batasan di sisi database sebagai lapisan kedua di luar validasi di browser: nama penerima 1 sampai 80 karakter, metode pembayaran hanya `bayar-di-tempat`, `kartu-debit`, `qris`, atau `dana`, diskon antara 0 dan 100.

## Teknologi

| Bagian | Pilihan | Alasan singkat |
| --- | --- | --- |
| Framework | Vue 3 (Composition API, `<script setup>`) | Navbar, kartu produk, dan tombol dipakai di banyak layar, jadi cukup ditulis sekali sebagai komponen. |
| Build tool | Vite | Cepat dan sederhana. |
| Routing | Vue Router, mode hash | Refresh halaman di hosting statis tidak menghasilkan 404. |
| Database | Supabase (PostgreSQL) | Data produk dan pesanan tersimpan sungguhan, dengan aturan akses per tabel. |
| Gaya | CSS biasa dengan variabel dari token Figma | Tidak memakai library UI, supaya hasil mengikuti Figma. |
| State | `reactive` di `src/productStore.js` (produk) dan `src/store.js` (keranjang, disimpan ke `localStorage`) | Skala proyek kecil, Pinia belum diperlukan. |

## Cara menjalankan di lokal

Syarat: Node.js 18 ke atas, Git, dan akses ke project Supabase (URL dan key diminta dari tim).

```bash
git clone https://github.com/MuhammadHumamArij/maemyuk-web.git
cd maemyuk-web
npm install
```

Lalu siapkan variabel lingkungan:

1. Salin `.env.example` menjadi `.env.local` di folder paling luar proyek, sejajar dengan `package.json`.
2. Isi dua variabel: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_KEY`. Nilainya ada di dashboard Supabase, menu Project Settings, bagian API (pakai key publik, bukan key `service_role`).
3. Jalankan `npm run dev`, lalu buka alamat yang tampil di terminal (biasanya `http://localhost:5173`).

Vite hanya membaca berkas env saat server dinyalakan, jadi jika nilainya diubah, matikan server lalu jalankan lagi. Untuk membuat versi produksi dan mencobanya:

```bash
npm run build
npm run preview
```

Jika muncul galat `supabaseUrl is required`, berarti `.env.local` belum terbaca. Periksa letak berkas, nama persis berkasnya, dan nama kedua variabel.

## Panduan untuk mentor: halaman dan fitur yang bisa dicoba

Link live web: [ISI: link]. Alur utama: Masuk, Beranda, Katalog, Detail Produk, Keranjang, Checkout, Konfirmasi. Login hanya simulasi, jadi isi email berformat benar dan password minimal 6 karakter.

1. **Katalog (data dinamis, search, filter).** Ketik "ayam" di kolom cari, hasilnya 3 produk. Coba chip kategori, buka panel filter untuk mengurutkan (terdekat, rating, diminati), dan pindah ke tab Toko. Ketik kata yang tidak ada, misalnya "xyz", untuk melihat layar "Data Tidak Ditemukan" dan tombol Reset Pencarian.
2. **Beranda.** Bagian "Rekomendasi makanan hari ini" diambil dari database.
3. **Detail Produk.** Atur jumlah dengan tombol tambah dan kurang, lalu tekan Masukkan Keranjang atau Beli Sekarang. Membuka alamat produk yang tidak ada mengarahkan kembali ke Katalog.
4. **Keranjang.** Awalnya kosong. Setelah produk ditambahkan, jumlah, pilihan, dan total berubah langsung dan bertahan setelah refresh.
5. **Checkout (form).** Tekan Bayar dengan form kosong untuk melihat pesan "Nama penerima wajib diisi." dan "Silakan pilih metode pembayaran." tepat di bawah kolomnya. Nama dirapikan spasinya dan dibatasi 80 karakter. Saat form benar dan Bayar ditekan, tombol berubah menjadi "Mengirim..." dan terkunci supaya tidak terkirim dua kali. Jika berhasil, toast "Pesanan berhasil dibuat!" muncul, keranjang dikosongkan, dan halaman pindah ke Konfirmasi. Pesanan tersimpan di tabel `orders`. Jika gagal, toast "Pesanan gagal disimpan. Silakan coba lagi." muncul dan isi keranjang tetap utuh.
6. **Melihat kondisi loading dan galat.** Di DevTools, tab Network, pilih throttling "Slow 4G" lalu refresh Katalog, Beranda, atau Keranjang untuk melihat kerangka loading. Centang "Offline" lalu refresh untuk melihat pesan galat dengan tombol Coba lagi.

## Kondisi tampilan (UX states)

| Kondisi | Di mana | Perilaku |
| --- | --- | --- |
| Skeleton loading | Katalog (6 kartu), Beranda (3 kartu), Keranjang (2 kartu dan rekomendasi) | Kerangka kartu berkilau pelan, berukuran sama dengan kartu produk, berhenti beranimasi jika pengguna mematikan animasi di perangkat |
| Kosong | Katalog, Keranjang | Layar "Data Tidak Ditemukan" dengan tombol reset, dan layar "Keranjangmu masih kosong" dengan tautan ke Katalog |
| Galat | Katalog, Beranda, Detail Produk | Pesan "Gagal memuat produk" dengan tombol Coba lagi |
| Toast | Checkout | Notifikasi sukses dan gagal kirim pesanan, hilang sendiri setelah 3,5 detik, bisa ditutup dengan tombol, dan diumumkan pembaca layar (`role="status"`, `aria-live="polite"`) |

Selama data dimuat, layar kosong atau galat sengaja tidak ditampilkan lebih dulu, supaya pengguna tidak melihat "Data Tidak Ditemukan" sesaat sebelum produk muncul.

## Keamanan

1. Berkas `.env.local` tidak ikut ke repositori. Aturan `*.local` di `.gitignore` mencegahnya, dan repositori hanya memuat `.env.example` berisi nama variabel tanpa nilai.
2. Aplikasi memakai key publik Supabase, yang memang tampil di browser. Perlindungan data ada di aturan akses tabel: produk dan toko hanya bisa dibaca, pesanan hanya bisa ditambah. Key `service_role` tidak dipakai.
3. Input pengguna ditampilkan dengan interpolasi Vue yang otomatis di-escape, tanpa `v-html`.
4. Saat deploy, variabel env diisi di pengaturan platform hosting, bukan di kode.

## Fitur interaktif

| # | Interaksi | Letak | Perilaku |
| --- | --- | --- | --- |
| 1 | Validasi login | Masuk | Tombol Masuk nonaktif sampai email dan password terisi. Email berformat benar dan password minimal 6 karakter dianggap valid. Selain itu muncul kondisi "Email atau password tidak valid". |
| 2 | Data, pencarian, dan filter | Katalog, Beranda | Produk dimuat dari Supabase. Pencarian, chip kategori, urutan, dan tab Item/Toko saling bekerja, dan filter ikut tersimpan di URL. |
| 3 | Keranjang dinamis | Detail Produk, Keranjang | Jumlah bisa ditambah atau dikurangi, item bisa dipilih atau dihapus, dan total berubah langsung. Isi keranjang bertahan setelah refresh. |
| 4 | Checkout dan pesanan | Checkout, Konfirmasi | Validasi nama dan metode pembayaran dengan pesan di bawah kolom, tombol terkunci dan berubah menjadi "Mengirim..." saat pesanan dikirim, penyimpanan ke tabel `orders`, lalu toast dan pindah ke Konfirmasi. Keranjang baru dikosongkan setelah database berhasil menyimpan. |
| 5 | Kode pengambilan | Konfirmasi | Kode per toko tampil saat area kode diketuk, dengan ikon centang beranimasi. |
| 6 | Lainnya | Beranda, Riwayat, Masuk | Animasi pembuka login (sekali per sesi), hapus riwayat pencarian satu per satu, validasi form Daftar. |

## Responsif

Dirancang mobile-first dari lebar 360 px (acuan frame Figma), lalu menyesuaikan:

| Layar | Perilaku |
| --- | --- |
| Daftar produk | 1 kolom di ponsel, 2 kolom mulai 640 px, 3 kolom mulai 1024 px |
| Masuk | Panel merek di kiri dan formulir di kanan mulai 900 px |
| Detail Produk | Foto dan informasi berdampingan mulai 768 px |
| Keranjang dan Checkout | Dua kolom dengan ringkasan menempel mulai 900 px |

## Struktur proyek

```
src/
  components/   AppIcon, BackBar, ProductRow, SkeletonRow, EmptyState, AppToast
  views/        Login, Daftar, Beranda, Riwayat, Katalog, Detail, Keranjang, Checkout, Konfirmasi
  lib/          supabase.js (klien Supabase)
  data/         products.js (daftar kategori dan alamat toko)
  styles/       tokens.css (token Figma), base.css (tombol, input, grid)
  productStore.js  pemuat produk dari Supabase (memuat, galat, getProduct)
  store.js      state keranjang dan pesanan (buildOrder, commitOrder)
  orderService.js  pengiriman pesanan ke tabel orders
  toast.js      state dan fungsi notifikasi (showToast)
  utils.js      asset(), rupiah(), diskon(), dan fungsi bantu lain
  router.js     daftar rute (mode hash)
supabase/
  schema.sql    tabel, aturan akses, dan data awal
public/
  assets/       icons/ dan images/
docs/
  prompt-log.md, prompt-log-modul8.md
.env.example    nama variabel lingkungan (tanpa nilai)
```

## Alur kerja Git

Tim memakai satu branch per pekerjaan, dan tidak ada yang di-push langsung ke `main`.

1. Mulai dari branch terbaru, buat branch baru, misalnya `feat/dynamic-data` atau `nafisa/checkout-form`.
2. Commit kecil dan deskriptif dengan awalan `feat`, `fix`, `refactor`, `docs`, atau `chore`.
3. `npm run build` harus berhasil sebelum push, dan Console browser diperiksa tanpa peringatan.
4. Push branch, buka Pull Request, dan minta rekan satu tim sebagai reviewer.
5. Setelah disetujui, Pull Request digabung. Penggabungan ke `main` dilakukan setelah variabel lingkungan di platform hosting terpasang.

Aturan tambahan Modul 8: satu berkas hanya diedit satu orang. Fungsi `placeOrder` di `store.js` dipecah menjadi `buildOrder` dan `commitOrder` supaya bagian form bisa dikerjakan tanpa menyentuh `store.js`.

Contoh pesan commit: `feat: katalog memuat produk dari supabase`, `refactor: keranjang tidak lagi berisi data contoh`, `fix: lengkapi skeleton di keranjang`.

## Keputusan dan temuan Modul 8

1. Supabase dipilih dibanding MockAPI.io dan JSON statis, karena aturan akses per tabel dan pesanan yang benar-benar tersimpan.
2. Skema database dibuat dari `products.js` Modul 7, sehingga nama dan data produk sama persis dengan desain.
3. Keranjang awal dikosongkan. Sebelumnya berisi tiga item contoh dari desain Figma, yang setelah data dinamis tampak seperti barang yang tidak pernah dipilih pembeli.
4. Penyaring item di `store.js` yang berjalan sebelum produk dimuat dihapus, karena membuat keranjang tersimpan terhapus saat aplikasi menyala.
5. Halaman Detail dan Keranjang memuat produk sendiri saat dibuka, supaya refresh langsung di halaman itu tetap berfungsi.
6. Tabel `orders` sengaja tidak bisa dibaca publik, sehingga saat menyimpan pesanan tidak boleh meminta data kembali dari database.
7. `kategori` dan alamat toko masih dari `src/data/products.js`, belum dipindahkan ke database.

## Kontribusi anggota

| Anggota | Tugas | Bukti (branch, PR, atau commit) |
| --- | --- | --- |
| Muhammad Humam Arij | Skema dan data awal Supabase, pemuat produk, penyambungan Katalog, Beranda, Detail, dan Keranjang, pemecahan `placeOrder`, skeleton dan galat, deploy, dokumentasi. Review dan merge Pull Request Nafisa. | `feat/dynamic-data`, Pull Request #16 |
| Nafisa | Validasi dan sanitasi form Checkout, pengiriman pesanan ke Supabase (`orderService.js`), komponen toast, perbaikan refresh di Checkout, dan log prompt. | `nafisa/checkout-form`, Pull Request #16, commit `9b9c4ad` |


## Pengujian

| Pengujian | Hasil |
| --- | --- |
| `npm run build` | Berhasil tanpa galat |
| Pencarian "ayam" di Katalog | 3 produk tampil |
| Pencarian tanpa hasil | Layar "Data Tidak Ditemukan" tampil |
| Refresh di halaman Keranjang dan Detail | Isi keranjang dan produk tetap tampil, tidak terlempar |
| Alamat produk tidak ada (`#/produk/ngawur`) | Diarahkan ke Katalog |
| Jaringan "Slow 4G" | Kerangka loading tampil di Katalog, Beranda, dan Keranjang |
| Mode "Offline" | Pesan galat dan tombol Coba lagi tampil, data muncul setelah jaringan kembali |
| Form Checkout | Nama kosong dan metode belum dipilih menampilkan pesan, nama 81 karakter ditolak, klik ganda hanya menyimpan satu pesanan, internet mati menampilkan toast gagal dan keranjang utuh, pesanan sukses muncul di tabel `orders` |
| Link live web | [ISI: filter dan submit form berjalan tanpa galat] |

## Deploy

Deploy memakai Netify. `vite.config.js` memakai `base: './'` dan router mode hash, jadi hasil build bisa dibuka tanpa pengaturan rute tambahan.

1. Impor repositori ke platform, pilih branch `main`.
2. Perintah build `npm run build`, folder keluaran `dist`.
3. Isi dua variabel lingkungan di pengaturan platform: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_KEY`.
4. Setelah tayang, uji link publik: filter di Katalog dan pengiriman form harus berjalan tanpa galat.

## Keterbatasan

1. `kategori` dan alamat toko masih dari berkas lokal, sedangkan produk dan ulasan dari database.
2. Login hanya simulasi di sisi klien, belum memakai autentikasi sungguhan.
3. Siapa pun yang memegang key publik bisa menambah pesanan, karena belum ada autentikasi atau pembatasan jumlah permintaan. Pembacaan pesanan tetap ditutup.
4. Stok produk belum berkurang saat pesanan dibuat.
5. Sebagian alamat toko dan ulasan adalah data contoh.