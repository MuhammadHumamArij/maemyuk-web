# Log Prompt dan Perbaikan Manual, Modul 8

Catatan penggunaan asisten AI untuk bagian data dinamis, UX states, dan alur Git pada Modul 8 (MaemYuk Web). Log ini ditulis sebagai satu prompt gabungan, yaitu ringkasan dari seluruh permintaan selama sesi kerja, diikuti hasil yang didapat dan perbaikan manual sesudahnya. Log ini memuat dua bagian pekerjaan: bagian data dan UX states (Humam) serta bagian form, penyimpanan pesanan, dan toast (Nafisa), masing-masing dengan prompt, hasil, dan perbaikan manualnya sendiri. Log Modul 7 ada di [prompt-log.md](prompt-log.md).

## Bagian 1: Humam (data dinamis dan UX states)

### Prompt gabungan

Saya mengerjakan Modul 8 (Data Dinamis dan Logika Aplikasi) di atas prototipe MaemYuk dari Modul 7, yang dibangun dengan Vue 3, Vite, dan Vue Router mode hash, dengan delapan produk yang masih tertulis di `src/data/products.js`. Brief meminta data tampil dari JSON atau API, ada fitur search dan filter, form dengan validasi, kelengkapan UX states (skeleton, kosong, galat, toast), dan deploy ke link publik. Saya meminta dibimbing langkah demi langkah, dengan saran terlebih dahulu sebelum jawaban, dan meminta AI membantah kalau argumen saya menyimpang. Pekerjaan dibagi dua dengan rekan satu tim dengan aturan satu file hanya diedit satu orang.

Untuk sumber data, saya meminta perbandingan beberapa pilihan (MockAPI.io, Supabase, dan JSON statis dengan localStorage) lengkap dengan kelebihan dan risikonya terhadap rubrik, lalu memilih Supabase. Saya meminta dibuatkan skema tiga tabel (`toko`, `products`, `orders`), aturan akses Row Level Security supaya produk hanya bisa dibaca dan pesanan hanya bisa ditambah, serta data awal yang mengikuti isi repo saya, bukan data contoh. Saya juga meminta penjelasan tentang kunci yang aman dipakai di browser, cara menyimpannya di `.env.local`, dan cara memastikan berkas itu tidak ikut ter-upload.

Setelah database siap, saya meminta pemuat produk yang terpusat (`productStore.js`) dengan state memuat dan galat, serta penerjemahan nama kolom `snake_case` ke nama yang sudah dipakai komponen supaya tampilan Modul 7 tidak perlu diubah. Saya meminta penyambungan halaman Katalog, Beranda, Detail Produk, dan Keranjang ke pemuat itu, dengan perhatian khusus pada kasus yang rawan: halaman yang dibuka langsung lewat link atau di-refresh sebelum produk selesai dimuat, dan keranjang tersimpan yang tidak boleh terhapus saat aplikasi menyala. Saya juga meminta fungsi `placeOrder` di `store.js` dipecah menjadi `buildOrder` dan `commitOrder`, agar bagian pengiriman pesanan bisa dikerjakan rekan tim tanpa menyentuh berkas itu.

Untuk UX states, saya meminta komponen kerangka loading (`SkeletonRow`) dengan ukuran yang sama seperti kartu produk dan menghormati pengguna yang mematikan animasi, penanganan galat dengan tombol Coba lagi, dan pencegahan layar "Data Tidak Ditemukan" atau "Keranjang kosong" yang berkedip selama data masih dimuat. Saya juga meminta pertimbangan apakah keranjang yang awalnya berisi tiga item contoh dari desain Figma sebaiknya dikosongkan, dan memutuskan untuk mengosongkannya.

Terakhir, saya meminta pembagian tugas yang adil beserta panduan langkah demi langkah dan prompt siap pakai untuk rekan tim, pengecekan berkala isi branch di GitHub (daftar commit, kebocoran kunci, dan build di lingkungan yang bersih), perkiraan sisa pekerjaan berdasarkan bobot rubrik, serta bahan untuk README dan log ini.

### Hasil dari AI

1. Perbandingan tiga sumber data dengan rekomendasi MockAPI.io. Saya memilih Supabase, dan AI mengikuti keputusan itu dengan menyiapkan langkah pengamanannya.
2. Skema SQL untuk tiga tabel lengkap dengan RLS, batasan isi (panjang nama, daftar metode bayar, rentang diskon), dan data awal yang dihasilkan langsung dari `src/data/products.js`.
3. `productStore.js` (state memuat, galat, daftar produk, dan `getProduct`) dengan fungsi penerjemah nama kolom.
4. Panduan perubahan untuk Katalog, Beranda, Detail Produk, Keranjang, dan `store.js`, termasuk pemecahan `placeOrder`.
5. Komponen `SkeletonRow.vue` dan blok memuat, galat, serta kosong yang saling menggantikan di tiap halaman.
6. Pembagian tugas satu file satu orang, panduan untuk rekan tim, dan beberapa pemeriksaan otomatis atas repo di GitHub.

### Perbaikan manual dan temuan

1. **Data contoh AI tidak cocok dengan data proyek.** Skema pertama dari AI memakai produk contoh (Sempol Ayam Keju, Warung JOs) dengan nama kolom yang berbeda dari repo saya, yang berisi Klepon, Coro Bikang, dan toko lain. Hal ini ketahuan setelah AI membaca repo di GitHub. Skema dibuat ulang (`supabase/schema.sql`) dengan data yang dihasilkan langsung dari `products.js`, dan tabel versi pertama dihapus.
2. **Berkas `.env.local` salah letak.** Saya menaruhnya di dalam folder yang salah sehingga aplikasi menampilkan galat `supabaseUrl is required`. Berkas dipindahkan ke folder paling luar, sejajar dengan `package.json`, lalu server dinyalakan ulang karena Vite hanya membaca berkas env saat mulai.
3. **Satu pemanggilan data lama terlewat di Katalog.** Setelah impor diganti, baris `products.filter(` di dalam daftar hasil masih memakai variabel yang sudah tidak ada. Ditemukan saat AI meninjau berkas yang saya tempel, lalu diganti menjadi `productState.items.filter(`.
4. **Keranjang tersimpan bisa terhapus saat aplikasi menyala.** Penyaring item di `store.js` berjalan sebelum produk selesai dimuat sehingga semua item dianggap tidak ada. Penyaring itu dihapus karena item tanpa produk sudah disaring oleh `lines`. Setelah itu diuji dengan refresh di halaman Keranjang.
5. **Keranjang awal berisi data contoh.** Setelah halaman dihubungkan ke database, tiga item bawaan (Klepon, Coro Bikang, Lemper Ayam) tampak seperti data yang tidak pernah dipilih pembeli. Keranjang awal dikosongkan, dan layar "Keranjangmu masih kosong" menjadi tampilan awal.
6. **Skeleton Keranjang tidak lengkap meski build berhasil.** Dua dari tiga perubahan terpasang: impor `SkeletonRow` dan blok memuat di bagian atas terlewat, sehingga bagian rekomendasi kosong dan Console menampilkan peringatan `Failed to resolve component`. Ditemukan lewat pemeriksaan isi repo di GitHub dan diperbaiki dengan commit `fix: lengkapi skeleton di keranjang`. Pelajarannya, `npm run build` yang berhasil tidak menjamin komponen terpasang, sehingga Console browser juga perlu diperiksa.
7. **Platform deploy diperiksa ulang terhadap brief.** Brief menyebut Vercel, Netlify, Fly, Render, Cloudflare, hosting, atau VPS, sedangkan Modul 7 memakai GitHub Pages yang tidak ada di daftar itu. Platform deploy Modul 8 dipilih dari daftar di brief: Netify. Variabel `VITE_SUPABASE_URL` dan `VITE_SUPABASE_KEY` diisi di pengaturan platform karena berkas `.env.local` tidak ikut ke repo.

### Pelajaran

1. Meminta AI membaca repo langsung lebih akurat daripada mendeskripsikan strukturnya dengan kata-kata, karena data contoh yang dibuat AI tanpa melihat repo bisa tidak cocok.
2. Kasus tepi seperti refresh di halaman dalam dan keranjang tersimpan harus diuji sendiri, karena tidak terlihat saat mengalir dari Beranda ke halaman lain.
3. Build yang berhasil dan Console yang bersih adalah dua pemeriksaan yang berbeda. Keduanya perlu dilakukan sebelum push.
4. Aturan satu file satu orang dan pemecahan fungsi bersama (`placeOrder`) membuat kerja berdua tidak menimbulkan konflik Git.

## Bagian 2: Nafisa (form checkout, penyimpanan pesanan, toast)

Bagian ini dikerjakan di branch `nafisa/checkout-form` dan digabung lewat Pull Request #16 ke `feat/dynamic-data`. File miliknya: `CheckoutView.vue`, `App.vue`, `orderService.js`, `toast.js`, dan `AppToast.vue`.

### Prompt gabungan

Saya mengerjakan halaman Checkout MaemYuk (Vue 3, Vite, Vue Router, Supabase lewat `@supabase/supabase-js`) dengan batas file yang jelas: hanya lima file di atas yang boleh diubah, gaya kode memakai `<script setup>`, teks tampilan berbahasa Indonesia, dan warna diambil dari CSS variables di `src/styles/tokens.css`. Saya meminta AI menjelaskan tiap perubahan dengan bahasa sederhana sebelum saya commit.

Pertama, saya meminta komponen toast tanpa library tambahan: state reaktif berisi daftar toast, fungsi `showToast(pesan, jenis)` dengan jenis sukses atau gagal, komponen penampil yang hilang sendiri setelah sekitar 3 sampai 4 detik dan bisa ditutup manual, terbaca pembaca layar (`role="status"`, `aria-live="polite"`), dan tidak menutupi tombol Bayar di lebar 360 px. Kedua, saya meminta pemeriksaan isian pada form: nama penerima wajib, spasi di tepi dibuang dan spasi ganda dirapikan, maksimal 80 karakter, nama berisi spasi saja dianggap kosong, cara bayar wajib dipilih, pesan galat tepat di bawah kolom yang salah dan muncul setelah kolom ditinggalkan atau saat Bayar ditekan, tanpa `v-html`.

Ketiga, saya meminta `kirimPesanan` di `orderService.js` yang menyimpan pesanan ke tabel `orders` dengan pemetaan `nama` ke `nama_penerima`, tanpa `.select()` setelah `insert` karena tabel itu hanya boleh ditambah, serta alur tombol Bayar: validasi, kunci tombol dengan teks "Mengirim...", `buildOrder`, kirim, lalu `commitOrder` dan toast sukses jika berhasil atau toast gagal dengan keranjang tetap utuh jika gagal. Keempat, saya meminta perbaikan halaman Checkout yang melempar pembeli ke Keranjang saat di-refresh, dengan memuat produk lebih dulu dan baru memeriksa keranjang setelah proses memuat selesai. Terakhir, saya meminta peninjauan akhir terhadap kasus tepi (nama kosong, nama 81 karakter, klik ganda, internet mati, refresh).

### Hasil dari AI

1. Toast: `toast.js`, `AppToast.vue`, dan pemasangannya di `App.vue`, dengan durasi 3500 ms dan tombol tutup.
2. Validasi form di `CheckoutView.vue` dengan pesan galat per kolom dan atribut `aria-invalid`.
3. `orderService.js` dengan fungsi `kirimPesanan` yang melempar galat jika `insert` ditolak.
4. Alur `bayar()` lengkap (validasi, kunci tombol, kirim, toast, pindah ke Konfirmasi) dan penjaga refresh memakai `watch` setelah produk selesai dimuat.

### Perbaikan manual dan temuan

1. **Temuan dari peninjauan: kegagalan memuat produk tidak tertangkap di Checkout.** `muatProduk` menangkap galatnya sendiri dan menyimpannya di `productState.error`, sehingga blok `try/catch` di Checkout tidak pernah terpicu untuk kegagalan itu. Dampaknya kecil karena Checkout tetap menampilkan keadaan kosong, tetapi pesan galat khusus belum ada. Dicatat sebagai batas yang diketahui.
2. Batas panjang nama. Saya menambahkan validasi agar nama penerima tidak melebihi 80 karakter. Saya mencoba memasukkan nama lebih dari 80 karakter untuk memeriksa apakah validasi berjalan.
3. Validasi metode pembayaran. Form checkout perlu memastikan pengguna memilih metode pembayaran sebelum pesanan dikirim. Saya memastikan metode pembayaran menjadi salah satu syarat validasi form.
4. Pesan kesalahan pada form. Saya menambahkan pesan kesalahan pada kolom yang tidak valid agar pengguna mengetahui bagian yang harus diperbaiki, bukan hanya gagal mengirim pesanan tanpa penjelasan.
5. Penyimpanan pesanan dan notifikasi. Saya memisahkan proses penyimpanan pesanan ke orderService.js dan menambahkan notifikasi berhasil maupun gagal. Jika penyimpanan ke Supabase gagal, pengguna seharusnya menerima notifikasi gagal dan tetap berada di halaman checkout.
6. Navigasi setelah pesanan berhasil. Pada pengujian awal, notifikasi berhasil sempat muncul tetapi halaman belum berpindah ke Konfirmasi. Saya memeriksa kembali alur checkout dan kondisi pengalihan halaman agar tidak mengganggu navigasi setelah pesanan berhasil disimpan. Setelah diperbaiki, halaman berhasil berpindah ke Konfirmasi sesuai alur yang diharapkan.
### Pelajaran

1. Validasi form perlu mencakup berbagai kondisi, seperti nama kosong, nama yang hanya berisi spasi, panjang nama melebihi batas, dan metode pembayaran yang belum dipilih. Pengujian langsung membantu memastikan validasi berjalan sesuai kebutuhan.
2. Notifikasi berhasil tidak selalu berarti seluruh alur checkout sudah berjalan benar. Navigasi ke halaman Konfirmasi perlu diuji secara langsung setelah pesanan berhasil disimpan.
3. Build yang berhasil belum menjamin seluruh fitur berjalan sesuai harapan. Pengujian di browser tetap diperlukan untuk memeriksa validasi form, proses penyimpanan pesanan, notifikasi, dan perpindahan halaman sebelum melakukan push.
