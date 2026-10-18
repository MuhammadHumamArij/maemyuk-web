# MaemYuk Web

Prototipe web interaktif **MaemYuk**, platform yang mempertemukan UMKM kuliner dengan pembeli di sekitar untuk menjual makanan surplus di penghujung hari dengan harga lebih hemat, sekaligus membantu mengurangi food waste.

Proyek ini adalah **Modul 7: Transformasi Desain Figma ke Prototipe Web Interaktif** dari program magang Vinix Batch 5, dikerjakan oleh **Kelompok 3 Peluru UT**. Desain bersumber dari hi-fi Modul 5, dan konversi HTML semantik Modul 6 dipakai sebagai kerangka konten.

| Informasi | Tautan |
| --- | --- |
| Desain Figma | https://www.figma.com/design/8AKKdpCaWkA5L2PwUPxbRe/UI-Startup-MaemYuk?node-id=155-104 |
| Repositori | https://github.com/MuhammadHumamArij/maemyuk-web.git|
| Demo (GitHub Pages) | _isi setelah deploy_ |
| PRD (PDF) | _isi tautan atau nama berkas PRD_ |

## Anggota tim

| Anggota | Peran |
| --- | --- |
| Muhammad Humam Arij | Pengembang antarmuka dan alur belanja (Masuk, Katalog, Detail Produk, Keranjang, Checkout) |
| Nafisa | Pengembang antarmuka halaman pendukung (Daftar, Riwayat, Beranda, Konfirmasi), perapian data Figma, dan PRD |

Rincian kontribusi lengkap ada di bagian [Kontribusi anggota](#kontribusi-anggota).

## Teknologi

| Bagian | Pilihan | Alasan singkat |
| --- | --- | --- |
| Framework | Vue 3 (Composition API, `<script setup>`) | Navbar, kartu produk, dan tombol dipakai di banyak layar, jadi cukup ditulis sekali sebagai komponen. State keranjang dibaca beberapa halaman sekaligus. |
| Build tool | Vite | Cepat dan sederhana. |
| Routing | Vue Router, mode hash | Refresh halaman di GitHub Pages tidak menghasilkan 404. |
| Gaya | CSS biasa dengan variabel dari token Figma | Tidak memakai library UI, supaya hasil mengikuti Figma. |
| State | `reactive` sederhana di `src/store.js`, disimpan ke `localStorage` | Skala proyek kecil, Pinia belum diperlukan. |

## Cara menjalankan di lokal

Syarat: Node.js 18 ke atas dan Git.

```bash
git clone <url-repo-ini>
cd maemyuk-web
npm install
npm run dev
```

Buka alamat yang tampil di terminal (biasanya `http://localhost:5173`). Untuk membuat versi produksi dan mencobanya:

```bash
npm run build
npm run preview
```

Jika muncul pesan `Missing script: dev`, terminal belum berada di folder proyek. Jalankan `cd maemyuk-web` terlebih dahulu. Peringatan `npm audit` setelah `npm install` dapat diabaikan untuk keperluan prototipe ini.

### Aset gambar dan ikon

Seluruh aset sudah ikut di repositori, jadi tidak perlu disalin manual.

- `public/assets/icons/` berisi ikon dan logo (misalnya `white-logo-maemyuk.svg`, `ikon-cart.svg`, `ikon-filter-tune-no-bg.svg`, `ikon-qris.svg`).
- `public/assets/images/` berisi foto produk (misalnya `klepon.png`, `ayam-goreng.png`, `dimsum.png`).

Berkas di folder `public` dipanggil lewat helper `asset()` di `src/utils.js` dan nama berkasnya dipertahankan sama seperti aslinya. Di GitHub Pages (Linux) nama berkas membedakan huruf besar dan kecil, jadi penulisan nama di kode harus sama persis dengan nama berkas.

## Alur dan fitur interaktif

Alur utama: Masuk, Beranda, Katalog, Detail Produk, Keranjang, Checkout, Konfirmasi.

| # | Interaksi | Letak | Perilaku |
| --- | --- | --- | --- |
| 1 | Validasi login | Masuk | Tombol Masuk nonaktif sampai email dan password terisi. Email berformat benar dan password minimal 6 karakter dianggap valid. Selain itu muncul kondisi "Email atau password tidak valid" sesuai desain Login Gagal. |
| 2 | Filter katalog | Katalog | Pencarian, chip kategori, urutan (terdekat, rating, diminati), dan tab Item/Toko saling bekerja. Hasil kosong menampilkan layar "Data Tidak Ditemukan". Filter ikut tersimpan di URL. |
| 3 | Keranjang dinamis | Detail Produk, Keranjang | Jumlah bisa ditambah atau dikurangi, item bisa dipilih atau dihapus, dan total berubah langsung. Isi keranjang bertahan setelah refresh. |
| 4 | Checkout dan pesanan | Checkout, Konfirmasi | Total, hemat, dan voucher dihitung dari item terpilih. Tombol Bayar aktif setelah metode pembayaran dan nama penerima terisi, lalu pesanan dibuat. |
| 5 | Kode pengambilan | Konfirmasi | Kode per toko baru tampil saat area kode diketuk, dengan ikon centang beranimasi. |
| 6 | Lainnya | Beranda, Riwayat, Masuk | Animasi pembuka login (sekali per sesi), hapus riwayat pencarian satu per satu, validasi form Daftar. |

Data awal keranjang sengaja sama dengan desain Figma (1x Klepon, 2x Coro, 3x Lemper) supaya tampilannya bisa dibandingkan langsung. Hasil hitung awal: subtotal Rp 22.500, biaya Rp 2.000, voucher Rp 5.000, total Rp 19.500.

## Responsif

Dirancang mobile-first dari lebar 360 px (acuan frame Figma), lalu menyesuaikan:

| Layar | Perilaku |
| --- | --- |
| Daftar produk | 1 kolom di ponsel, 2 kolom mulai 640 px, 3 kolom mulai 1024 px |
| Masuk | Panel merek di kiri dan formulir di kanan mulai 900 px |
| Detail Produk | Foto dan informasi berdampingan mulai 768 px |
| Keranjang dan Checkout | Dua kolom dengan ringkasan menempel mulai 900 px |

Pengujian visual dilakukan pada lebar 360, 768, dan 1280 px.

## Struktur proyek

```
src/
  components/   AppIcon, BackBar, ProductRow, EmptyState
  views/        Login, Daftar, Beranda, Riwayat, Katalog, Detail, Keranjang, Checkout, Konfirmasi
  data/         products.js (sumber tunggal data produk dan toko)
  styles/       tokens.css (token Figma), base.css (tombol, input, grid)
  utils.js      asset(), rupiah(), diskon(), dan fungsi bantu lain
  store.js      state keranjang dan pesanan
  router.js     daftar rute (mode hash)
public/
  assets/       icons/ dan images/
docs/
  prompt-log.md log prompt dan perbaikan manual
```

## Token desain dari Figma

Warna, jarak, radius, dan Text Styles diambil dari variabel file Figma ke `src/styles/tokens.css`. Warna utama `#0e7490`, font Roboto (judul), Roboto Condensed (teks), dan Lobster (label diskon). Karena Figma paket gratis tidak memiliki Variables lengkap, sebagian token dicatat manual dari Dev Mode dan konektor Figma.

## Alur kerja Git

Tim memakai satu branch per halaman, dan tidak ada halaman yang di-push langsung ke `main`.

1. Mulai dari `main` terbaru: `git checkout main` lalu `git pull`.
2. Buat branch baru, misalnya `humam/katalog` atau `nafisa/beranda`.
3. Commit kecil dan deskriptif dengan awalan `feat`, `fix`, `style`, `chore`, atau `docs`.
4. `npm run build` harus berhasil sebelum push.
5. Push branch, buka Pull Request, dan minta rekan satu tim sebagai reviewer.
6. Setelah disetujui, PR di-merge ke `main`, lalu `git pull` di lokal.

Contoh pesan commit: `feat: tambah filter kategori di halaman Katalog`, `fix: perbaiki path foto produk di halaman Katalog`, `style: sesuaikan ukuran ikon BackBar dengan Figma`.

## Keputusan dan temuan selama konversi

1. Persen diskon dihitung dari harga, tidak ditulis tangan. Ini menemukan Dimsum Ayam di Figma bertuliskan "Disc 25%" padahal Rp 10.000 dari Rp 18.000 adalah sekitar 44%.
2. Total di layar Checkout dan Konfirmasi Figma tertulis Rp 20.500 dan Hemat 15%, padahal rincian di layar yang sama berjumlah Rp 19.500. Prototipe memakai hasil hitung (Rp 19.500, hemat 60%) dan desain Figma perlu diperbaiki.
3. Layar "Login Gagal" dan "Data Tidak Ditemukan" diwujudkan sebagai kondisi di halaman Masuk dan Katalog, bukan halaman terpisah.
4. Nama berkas ikon Google dan Facebook di HTML Modul 6 tidak konsisten (`logo-` dan `ikon-`). Prototipe memakai `ikon-`.
5. Kolom cari di Beranda hanya pembuka, mengetuknya membuka halaman Riwayat Pencarian, sesuai maksud desain.
6. Nama platform di wireframe lama masih tertulis MaemSek. Seluruh dokumen dan kode memakai nama MaemYuk.
7. Sebagian alamat toko dan ulasan adalah data contoh karena Figma tidak memuat data lengkap.

## Kontribusi anggota

> Isi tabel ini dari riwayat commit yang nyata. Perintah bantu: `git shortlog -sn` untuk jumlah commit per orang, dan `git log --author="Nama" --oneline` untuk daftar commit tiap anggota.

| Anggota | Tugas | Bukti (branch, PR, atau commit) |
| --- | --- | --- |
| Muhammad Humam Arij | Penyiapan repo, kerangka proyek Vue, token desain, store keranjang, dan halaman Masuk, Katalog, Detail Produk, Keranjang, Checkout. Perbaikan aset dan ikon. Review PR milik Nafisa. | _isi tautan PR atau hash commit_ |
| Nafisa | Halaman Daftar, Riwayat, Beranda, dan Konfirmasi. Koreksi data Figma (total Checkout Rp 19.500, label diskon Dimsum 44%). Penyusunan PRD. Review PR milik Humam. | _isi tautan PR atau hash commit_ |

Ringkasan jumlah commit (isi dari `git shortlog -sn`): _isi_

## Log prompt dan perbaikan

Seluruh prompt yang dipakai bersama asisten AI, hasilnya, dan perbaikan manual yang dilakukan sesudahnya dicatat di [docs/prompt-log.md](docs/prompt-log.md).

## Pengujian

| Pengujian | Hasil |
| --- | --- |
| `npm run build` | Berhasil tanpa error |
| Alur Masuk sampai Konfirmasi | Berjalan tanpa crash |
| Login dengan data salah | Menampilkan pesan galat, tidak crash |
| Pencarian katalog tanpa hasil | Menampilkan layar data tidak ditemukan |
| Responsif 360, 768, 1280 px | Tata letak menyesuaikan |

Selain uji manual di browser, versi awal kerangka proyek diuji dengan skrip Playwright (57 pemeriksaan lolos) sebelum perubahan lanjutan dari tiap anggota.

## Deploy ke GitHub Pages

`vite.config.js` memakai `base: './'` dan router mode hash, jadi hasil build bisa dipublikasikan dari folder `dist` tanpa pengaturan nama repo.

1. Jalankan `npm run build`.
2. Publikasikan isi folder `dist` (misalnya lewat GitHub Actions atau cabang `gh-pages`).
3. Di pengaturan repo, aktifkan GitHub Pages dan salin tautannya ke bagian atas README ini.

## Keterbatasan

1. Data produk, toko, dan ulasan bersifat statis (`src/data/products.js`), belum terhubung ke server.
2. Pembayaran dan login hanya simulasi di sisi klien.
3. Pesanan disimpan di peramban (localStorage), sehingga hilang jika data situs dihapus.
4. Sebagian detail Figma yang tidak konsisten diperbaiki di kode, sedangkan berkas Figma masih perlu disamakan.