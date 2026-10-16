<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '../components/AppIcon.vue'
import ProductRow from '../components/ProductRow.vue'
import { products } from '../data/products'
import { cartCount } from '../store'
import { asset } from '../utils'

const router = useRouter()
const rekomendasi = computed(() => products.filter((p) => ['ayam-goreng', 'risol', 'dimsum'].includes(p.id)))

const preferensi = [
  { label: 'Lokasi terdekat', ikons: 'ikons-lokasi-terdekat.svg', sort: 'terdekat' },
  { label: 'Rating tertinggi', ikon: 'ikon-rating-tertinggi.svg', sort: 'rating' },
  { label: 'Banyak diminati', ikon: 'ikon-banyak-diminati.svg', sort: 'populer' },
]
const aneka = [
  { label: 'Roti', gambar: 'roti.png', kategori: 'Roti' },
  { label: 'Mie Ayam', gambar: 'mie-ayam.png', kategori: 'Menu Ayam' },
  { label: 'Bakso', gambar: 'bakso.png', kategori: 'Menu Ayam' },
  { label: 'Jus', gambar: 'jus-mangga.png', kategori: 'Jus Buah' },
]
</script>

<template>
  <div class="container">
    <header class="top">
      <RouterLink to="/beranda">
        <img :src="asset('icon/horizontal-logo-maemyuk.svg')" alt="MaemYuk, ke beranda" width="96" height="35" />
      </RouterLink>
      <nav aria-label="Navigasi utama">
        <ul class="top__nav">
          <li>
            <RouterLink to="/keranjang" class="top__cart">
              <img :src="asset('icon/ikon-cart.svg')" alt="Keranjang" width="19" height="19" />
              <span v-if="cartCount" class="top__badge" aria-label="isi keranjang">{{ cartCount }}</span>
            </RouterLink>
          </li>
          <li>
            <a href="#/beranda" @click.prevent><img :src="asset('icon/ikon-location.svg')" alt="Lokasi" width="15" height="22" /></a>
          </li>
          <li>
            <RouterLink to="/masuk"><img :src="asset('icon/ikon-user.svg')" alt="Akun" width="23" height="23" /></RouterLink>
          </li>
        </ul>
      </nav>
    </header>

    <main>
      <h1 class="sr-only">Temukan makanan lezat dari UMKM sekitar dengan harga lebih hemat</h1>

      <!-- Kolom cari hanya pembuka: mengetuknya membuka halaman Riwayat Pencarian -->
      <button type="button" class="field cari" @click="router.push('/riwayat')">
        <AppIcon name="search" :size="18" />
        <span>Cari menu di sini....</span>
      </button>

      <section class="section" aria-labelledby="h-preferensi">
        <h2 id="h-preferensi" class="text-heading3">Belum menemukan preferensi?</h2>
        <ul class="pref">
          <li v-for="p in preferensi" :key="p.sort">
            <RouterLink :to="{ path: '/katalog', query: { sort: p.sort } }" class="kartu">
              <img :src="asset(`icon/${p.ikon}`)" alt="" width="69" height="69" />
              <span>{{ p.label }}</span>
            </RouterLink>
          </li>
        </ul>
      </section>

      <section class="section" aria-labelledby="h-aneka">
        <h2 id="h-aneka" class="text-heading3">Aneka kuliner surplus kita</h2>
        <ul class="aneka">
          <li v-for="a in aneka" :key="a.label">
            <RouterLink :to="{ path: '/katalog', query: { kategori: a.kategori } }" class="kartu">
              <img :src="asset(`images/${a.gambar}`)" alt="" width="65" height="64" />
              <span>{{ a.label }}</span>
            </RouterLink>
          </li>
        </ul>
        <RouterLink to="/katalog" class="btn btn--primary btn--sm tombol-lebar">Cari kuliner lainnya</RouterLink>
      </section>

      <section class="section" aria-labelledby="h-rek">
        <h2 id="h-rek" class="text-heading3">Rekomendasi makanan hari ini</h2>
        <p class="muted rek__sub">Nikmati makanan berkualitas dengan harga lebih hemat dan bantu kurangi limbah makanan</p>
        <ul class="product-grid">
          <li v-for="p in rekomendasi" :key="p.id"><ProductRow :product="p" /></li>
        </ul>
        <RouterLink to="/katalog" class="btn btn--secondary btn--sm tombol-lebar">Cari rekomendasi menu hari ini</RouterLink>
      </section>

      <section class="section tentang" aria-labelledby="h-tentang">
        <div class="divider"></div>
        <h2 id="h-tentang" class="text-heading3">Tentang kami</h2>
        <p>
          Kami percaya makanan berlebih bukan berarti tidak berharga. MaemYuk dibangun untuk mempertemukan penjual kuliner
          dengan sisa stok di penghujung hari dan pembeli yang ingin menikmati makanan enak dengan harga lebih hemat,
          sekaligus ikut berkontribusi mengurangi food waste di lingkungan sekitar.
        </p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 43px;
  padding: 0 11px;
}
.top__nav {
  display: flex;
  align-items: center;
  gap: 24px;
}
.top__nav a {
  display: grid;
  place-items: center;
  min-width: 32px;
  min-height: 44px;
}
.top__cart {
  position: relative;
}
.top__badge {
  position: absolute;
  top: 2px;
  right: -6px;
  min-width: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--color-text-discount);
  color: #fff;
  font-size: 11px;
  line-height: 18px;
  text-align: center;
}
.cari {
  width: 100%;
  margin-top: 16px;
  cursor: text;
  text-align: left;
  font-size: 14px;
  min-height: 44px;
  border-radius: 999px;
}
.pref,
.aneka {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}
.pref {
  grid-template-columns: repeat(3, 1fr);
}
.aneka {
  grid-template-columns: repeat(4, 1fr);
}
.kartu {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 4px;
  border-radius: var(--radius-16);
  text-align: center;
  font-size: 12px;
  line-height: 16px;
  box-shadow: 0 1px 4px rgba(17, 24, 39, 0.18);
  transition: transform 0.15s ease;
}
.kartu:hover {
  transform: translateY(-2px);
}
.kartu img {
  width: 100%;
  max-width: 83px;
  height: auto;
  border-radius: var(--radius-16);
  object-fit: cover;
}
.tombol-lebar {
  margin-top: 16px;
}
.rek__sub {
  margin: 4px 0 12px;
  font-size: 14px;
  line-height: 20px;
}
.tentang {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 24px;
}
@media (min-width: 640px) {
  .pref {
    max-width: 480px;
  }
  .aneka {
    max-width: 560px;
  }
  .tombol-lebar {
    max-width: 360px;
  }
}
</style>
