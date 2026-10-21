drop table if exists public.orders;
drop table if exists public.products;
drop table if exists public.toko;

-- 1. Tabel toko
create table public.toko (
  nama text primary key,
  alamat text not null,
  tutup text not null default '22:00'
);

-- 2. Tabel produk 
create table public.products (
  id text primary key,
  nama text not null,
  toko text not null references public.toko(nama),
  kategori text not null,
  harga integer not null check (harga >= 0),          -- 0 berarti Gratis
  harga_asli integer not null check (harga_asli > 0),
  jarak integer not null check (jarak >= 0),          -- meter
  rating numeric(2,1) not null check (rating between 0 and 5),
  populer integer not null default 0,
  gambar text not null,
  alt text not null,
  singkat text not null,
  deskripsi text not null,
  ulasan jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 3. Tabel pesanan 
create table public.orders (
  id bigint generated always as identity primary key,
  nama_penerima text not null check (length(trim(nama_penerima)) between 1 and 80),
  metode text not null check (metode in ('bayar-di-tempat','kartu-debit','qris','dana')),
  total integer not null check (total >= 0),
  hemat integer not null default 0 check (hemat between 0 and 100),
  toko jsonb not null,                                 -- [{nama, alamat, tutup, kode, items:[{nama, qty}]}]
  created_at timestamptz not null default now()
);

-- 4. Row Level Security
alter table public.toko enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

create policy "toko boleh dibaca publik" on public.toko for select to anon using (true);
create policy "products boleh dibaca publik" on public.products for select to anon using (true);
create policy "orders boleh dibuat publik" on public.orders for insert to anon with check (true);

-- 5. Data awal 
insert into public.toko (nama, alamat, tutup) values
  ('Warung Pak Slamet', 'Jl. Diponegoro nomor 10', '22:00'),
  ('Dapur Mbok Siti', 'Jl. Ampel nomor 7', '22:00'),
  ('Berkah Jajanan Pasar', 'Jl. Pasar Lama nomor 3', '22:00'),
  ('Dapur Rasa Nusantara', 'Jl. Melati nomor 12', '22:00'),
  ('Warung AbangGo', 'Jl. Merdeka nomor 21', '22:00'),
  ('Njajankuy', 'Jl. Kenanga nomor 5', '22:00');

insert into public.products
  (id, nama, toko, kategori, harga, harga_asli, jarak, rating, populer, gambar, alt, singkat, deskripsi, ulasan)
values
  ('klepon', 'Klepon Lumer Gula Merah', 'Warung Pak Slamet', 'Makanan Tradisional', 0, 10000, 500, 4.9, 90, 'klepon.png', 'Klepon hijau bertabur kelapa parut dengan isian gula merah', 'Kue otentik dengan isian gula merah', 'Nikmati kelezatan otentik dari kue tradisional legendaris dalam setiap gigitan Klepon Lumer Gula Merah. Terbuat dari adonan tepung ketan pilihan yang kenyal dan harum daun pandan alami, dibalut dengan taburan kelapa parut gurih yang segar. Saat digigit, kejutan sensasi lelehan gula merah cair yang manis dan hangat akan langsung meletup sempurna di mulut. Disajikan segar setiap hari, memberikan kombinasi rasa manis, gurih, dan kenyal yang memanjakan lidah di setiap butirnya.', '[{"nama":"User123","rating":4.9,"komentar":"Enak"},{"nama":"User322","rating":4.9,"komentar":"Kue nya lembut, manis lumer dimulut"}]'::jsonb),
  ('coro', 'Coro Bikang Mawar Mekar', 'Dapur Mbok Siti', 'Makanan Tradisional', 6000, 12000, 1200, 4.5, 70, 'coro.png', 'Kue coro bikang berwarna merah muda dan hijau', 'Kue tradisional bertekstur lembut', 'Nikmati kelezatan otentik kue tradisional Coro Bikang Mawar Mekar yang legendaris. Terbuat dari tepung beras dan santan kelapa murni, dipanggang hingga merekah cantik layaknya bunga mawar. Memiliki tekstur serat yang empuk dan lembut di bagian dalam, serta renyah gurih di bagian bawahnya. Dipadukan dengan manis dan gurihnya santan yang legit, cocok banget disajikan hangat untuk teman minum teh atau kopi.', '[{"nama":"Ari Wih Sahroni","rating":4,"komentar":"Rasanya enak banget pas masih hangat! Berserat, empuk, dan santannya berasa gurih manis. Kalau udah dingin teksturnya agak mengeras, jadi mending dihangatkan sebentar."}]'::jsonb),
  ('lemper-ayam', 'Lemper Ayam', 'Dapur Mbok Siti', 'Makanan Tradisional', 3500, 5000, 1200, 4.2, 60, 'lemper-ayam.png', 'Lemper ayam dibungkus daun pisang', 'Ketan pulen berisi ayam suwir', 'Lemper Ayam dibuat segar setiap hari dan tersisa di penghujung jam jual. Ambil langsung di lokasi toko dengan harga lebih hemat, sekaligus ikut mengurangi makanan yang terbuang.', '[{"nama":"User204","rating":4.2,"komentar":"Ketannya pulen, isian ayamnya banyak"}]'::jsonb),
  ('kue-lapis', 'Kue Lapis', 'Berkah Jajanan Pasar', 'Makanan Tradisional', 2800, 4000, 800, 4.7, 65, 'kue-lapis.png', 'Kue lapis berlapis warna-warni di piring putih', 'Kue berlapis manis dan kenyal', 'Kue Lapis dibuat segar setiap hari dan tersisa di penghujung jam jual. Ambil langsung di lokasi toko dengan harga lebih hemat, sekaligus ikut mengurangi makanan yang terbuang.', '[{"nama":"User518","rating":4.7,"komentar":"Manisnya pas, enak buat sore hari"}]'::jsonb),
  ('pastel-isi', 'Pastel Sayur Renyah', 'Dapur Rasa Nusantara', 'Makanan Tradisional', 3000, 5000, 700, 4.8, 80, 'pastel-Isi.png', 'Pastel goreng isi sayur yang renyah', 'Pastel goreng isi sayur', 'Pastel Sayur Renyah dibuat segar setiap hari dan tersisa di penghujung jam jual. Ambil langsung di lokasi toko dengan harga lebih hemat, sekaligus ikut mengurangi makanan yang terbuang.', '[{"nama":"User771","rating":4.8,"komentar":"Kulitnya renyah, isiannya penuh"}]'::jsonb),
  ('ayam-goreng', 'Ayam Goreng', 'Warung AbangGo', 'Menu Ayam', 15000, 20000, 300, 4.6, 85, 'ayam-goreng.png', 'Ayam goreng dengan lalapan', 'Ayam goreng dengan lalapan', 'Ayam Goreng dibuat segar setiap hari dan tersisa di penghujung jam jual. Ambil langsung di lokasi toko dengan harga lebih hemat, sekaligus ikut mengurangi makanan yang terbuang.', '[{"nama":"User342","rating":4.6,"komentar":"Bumbunya meresap, porsinya pas"}]'::jsonb),
  ('risol', 'Risol Mayo', 'Njajankuy', 'Makanan Tradisional', 8000, 16000, 200, 4.3, 50, 'risol.png', 'Risol mayo yang dibelah', 'Risol isi mayo dan telur', 'Risol Mayo dibuat segar setiap hari dan tersisa di penghujung jam jual. Ambil langsung di lokasi toko dengan harga lebih hemat, sekaligus ikut mengurangi makanan yang terbuang.', '[{"nama":"User906","rating":4.3,"komentar":"Mayonya melimpah, kulitnya renyah"}]'::jsonb),
  ('dimsum', 'Dimsum Ayam', 'Njajankuy', 'Menu Ayam', 10000, 18000, 300, 4.4, 55, 'dimsum.png', 'Dimsum ayam di piring', 'Dimsum ayam kukus', 'Dimsum Ayam dibuat segar setiap hari dan tersisa di penghujung jam jual. Ambil langsung di lokasi toko dengan harga lebih hemat, sekaligus ikut mengurangi makanan yang terbuang.', '[{"nama":"User615","rating":4.4,"komentar":"Lembut dan gurih, cocok dengan saus"}]'::jsonb);