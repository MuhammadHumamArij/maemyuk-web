-- Migrasi autentikasi: tabel profiles, kepemilikan pesanan, dan RLS berbasis akun.
--
-- URUTAN PENERAPAN (penting):
-- 1. Di dashboard Supabase, matikan "Confirm email" (Authentication > Sign In / Providers > Email).
-- 2. Deploy kode baru (branch feat/auth) lebih dulu.
-- 3. Baru jalankan file ini di SQL Editor. Aturan insert anon di orders dicabut di sini,
--    jadi checkout versi lama berhenti bisa menyimpan pesanan begitu file ini dijalankan.

-- 1. Tabel profiles: satu baris per akun, berisi username dan peran.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null check (length(trim(username)) between 1 and 40),
  peran text not null default 'pembeli' check (peran in ('pembeli', 'penjual')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profil dibaca pemiliknya" on public.profiles
  for select to authenticated
  using (id = auth.uid());

create policy "profil diubah pemiliknya" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Pengguna hanya boleh mengubah username. Peran tidak bisa diganti lewat API.
revoke update on public.profiles from authenticated;
grant update (username) on public.profiles to authenticated;

-- 2. Profil dibuat otomatis saat akun baru terdaftar, dari data yang dikirim form Daftar.
create or replace function public.buat_profil_baru()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, peran)
  values (
    new.id,
    left(
      coalesce(nullif(trim(new.raw_user_meta_data ->> 'username'), ''), split_part(new.email, '@', 1)),
      40
    ),
    case when new.raw_user_meta_data ->> 'peran' = 'penjual' then 'penjual' else 'pembeli' end
  );
  return new;
end;
$$;

-- Fungsi trigger tidak boleh dipanggil langsung lewat API.
revoke execute on function public.buat_profil_baru() from public, anon, authenticated;

drop trigger if exists saat_user_baru on auth.users;
create trigger saat_user_baru
  after insert on auth.users
  for each row execute function public.buat_profil_baru();

-- 3. Pesanan dikaitkan ke pemilik dan punya status.
alter table public.orders
  add column if not exists user_id uuid references auth.users (id) on delete set null default auth.uid(),
  add column if not exists status text not null default 'menunggu'
    check (status in ('menunggu', 'selesai', 'dibatalkan'));

create index if not exists orders_user_id_idx on public.orders (user_id, created_at desc);

-- 4. RLS pesanan: hanya akun yang login yang bisa membuat dan membaca pesanannya sendiri.
drop policy if exists "orders boleh dibuat publik" on public.orders;

create policy "pembeli membuat pesanan sendiri" on public.orders
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and status = 'menunggu'
    and case when jsonb_typeof(toko) = 'array'
             then jsonb_array_length(toko) between 1 and 50
             else false end
    and total between 0 and 100000000
  );

create policy "pembeli membaca pesanan sendiri" on public.orders
  for select to authenticated
  using (user_id = auth.uid());

-- Catatan: pesanan lama (user_id kosong) tidak lagi terbaca lewat API.
-- Aturan untuk penjual (membaca dan mengubah status pesanan tokonya) ditambahkan
-- pada tahap sisi penjual, setelah tabel toko punya kolom pemilik.
