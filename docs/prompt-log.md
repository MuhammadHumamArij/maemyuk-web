# Log Prompt dan Perbaikan

Catatan penggunaan asisten AI selama Modul 7 (MaemYuk Web). Setiap entri memuat prompt yang dipakai, hasil yang didapat, dan **perbaikan manual** yang dilakukan anggota tim sesudahnya.


## Cara tim memakai AI

1. **Humam** memakai asisten untuk merancang struktur proyek Vue, alur Git, dan kerangka halaman. Asisten membaca desain lewat konektor Figma, bukan menebak dari gambar.
2. **Nafisa** menjalankan prompt yang sama di asisten AI miliknya untuk halaman bagiannya, memakai berkas token dan komponen bersama sebagai acuan.
3. Hasil AI tidak langsung dipakai. Setiap halaman dijalankan di `npm run dev`, dibandingkan dengan frame Figma, diuji di lebar 360, 768, dan 1280 px, lalu diperbaiki sebelum di-commit.

## Entri

| # | Prompt (ringkasan) | Hasil | Perbaikan manual |
| --- | --- | --- | --- |
| 1 | Minta struktur proyek Vue 3 dengan Vite, router mode hash, dan token desain dari Figma, mengacu 11 berkas HTML Modul 6 dan link Figma | Kerangka proyek, `tokens.css`, `base.css`, komponen dasar, store keranjang, dan sembilan halaman awal | Menyalin ulang aset ikon dan gambar Modul 6 ke `public/assets`, menghapus berkas contoh template Vite (`favicon.svg`, `icons.svg`) |
| 2 | Minta halaman Masuk lengkap dengan validasi, kondisi galat, dan animasi pembuka | Halaman Login dengan tombol nonaktif dan pesan galat | Menyamakan nama berkas ikon Google dan Facebook dengan isi folder aset, memeriksa tampilan terhadap frame Figma |
| 3 | Minta halaman Katalog dengan pencarian, chip kategori, urutan, dan tab Item/Toko | Halaman Katalog dengan filter yang tersimpan di URL dan layar kosong | Mengganti ikon filter menjadi versi tanpa latar (`ikon-filter-tune-no-bg.svg`), memperbaiki path foto produk di `products.js` yang tidak tampil, menyesuaikan ukuran ikon di `BackBar` dan `EmptyState` dengan Figma |
| 4 | Minta halaman Detail Produk dengan stepper jumlah, tombol Masukkan Keranjang, dan Beli Sekarang | Halaman Detail dua kolom di layar lebar |
| 5 | Minta halaman Keranjang dan Checkout dengan total dinamis dan pilihan pembayaran | Dua halaman dengan hitung total otomatis | Memperbaiki nama berkas ikon metode pembayaran di `CheckoutView.vue` (awalnya hanya satu dari empat ikon yang tampil), karena nama di array tidak sama dengan nama berkas |
| 6 | Minta bantuan Git: membuat branch, menyelesaikan "divergent branches", dan konflik `ikon-filter-tune.svg` | Urutan perintah dan penjelasan penyebab | Menjalankan perbaikan lewat branch terpisah, memilih versi ikon yang benar saat menyelesaikan konflik, dan menjalankan `npm run build` sebelum push |


## Temuan AI yang diperbaiki secara manual

Kasus berikut menunjukkan hasil AI yang tidak langsung benar dan perlu diperiksa oleh manusia.

1. **Ikon metode pembayaran hanya satu yang tampil.** Nama berkas di array `metodeOpsi` tidak sama persis dengan nama berkas di folder. Ditemukan dengan membandingkan isi array dengan isi folder `icons`, lalu nama diperbaiki.
2. **Foto produk Katalog tidak muncul.** Path foto di `products.js` tidak cocok dengan nama berkas di `public/assets/images`. Path diperbaiki satu per satu.
3. **Angka total tidak konsisten di Figma.** Total Rp 20.500 dan hemat 15% tidak cocok dengan rincian Rp 19.500. Kode memakai hasil hitung, dan Figma dikoreksi.
4. **Persen diskon Dimsum salah di Figma.** Tertulis 25%, padahal harga Rp 10.000 dari Rp 18.000 setara sekitar 44%.
5. **Nama folder aset tidak seragam** (`icon` dan `icons`) antara dokumentasi dan repo. Tim menyepakati `icons`, dan README disamakan.
6. **Beranda belum responsif.** Tombol dan kartu memakai lebar tetap sehingga tidak menyesuaikan lebar layar. Temuan ini dicatat saat review PR.

## Pelajaran

1. Meminta AI membaca desain langsung dari Figma lebih akurat daripada mendeskripsikannya dengan kata-kata.
2. Hasil AI harus dibandingkan dengan Figma per halaman, terutama angka dan nama berkas.
3. `npm run build` perlu dijalankan sebelum push, karena `npm run dev` lebih toleran terhadap kesalahan kecil.
4. Branch per halaman dan Pull Request dengan reviewer membuat riwayat kontribusi tiap anggota mudah dibuktikan.