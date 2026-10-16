<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '../components/AppIcon.vue'
import BackBar from '../components/BackBar.vue'
import { getProduct, toko } from '../data/products'
import { addToCart, buyNow } from '../store'
import { asset, diskon, rupiah } from '../utils'

const route = useRoute()
const router = useRouter()

const product = computed(() => getProduct(route.params.id))
if (!product.value) router.replace('/katalog')

const jumlah = ref(1)
const ubah = (d) => (jumlah.value = Math.min(99, Math.max(1, jumlah.value + d)))

function masukKeranjang() {
  addToCart(product.value.id, jumlah.value)
  router.push('/keranjang')
}
function beliSekarang() {
  buyNow(product.value.id, jumlah.value)
  router.push('/checkout')
}
</script>

<template>
  <div v-if="product" class="container">
    <BackBar to="/katalog" label="Kembali ke katalog">
      <form class="cari" role="search" @submit.prevent="router.push({ path: '/katalog', query: { q: $event.target.elements.q.value } })">
        <div class="field">
          <AppIcon name="search" :size="18" />
          <label for="cari-menu" class="sr-only">Cari menu</label>
          <input id="cari-menu" name="q" type="search" :value="product.kategori" />
        </div>
      </form>
    </BackBar>

    <main class="detail">
      <div class="detail__foto">
        <img :src="asset(`images/${product.gambar}`)" :alt="product.alt" width="328" height="183" />
      </div>

      <div class="detail__isi">
        <h1 class="text-heading2">{{ product.nama }}</h1>
        <p class="detail__harga">
          <span class="text-heading3">{{ rupiah(product.harga) }}</span>
          <s class="muted">{{ rupiah(product.hargaAsli) }}</s>
          <span class="text-diskon">Disc {{ diskon(product) }}%</span>
          <span class="detail__rating"><AppIcon name="star" :size="18" />{{ product.rating }}/5</span>
        </p>

        <p class="detail__deskripsi">{{ product.deskripsi }}</p>

        <section class="penjual" aria-labelledby="h-penjual">
          <h2 id="h-penjual" class="sr-only">Penjual</h2>
          <div class="penjual__baris">
            <span class="penjual__nama">
              <span class="penjual__avatar" aria-hidden="true">{{ product.toko[0] }}</span>
              {{ product.toko }}
            </span>
            <RouterLink :to="{ path: '/katalog', query: { q: product.toko } }" class="penjual__masuk">
              Masuk ke toko <AppIcon name="chevron-right" :size="14" />
            </RouterLink>
          </div>
          <p class="penjual__ambil text-caption">
            <span>Ambil jam : 18.00 - {{ toko[product.toko]?.tutup.replace(':', '.') ?? '22.00' }}</span>
            <span>Hari Ini</span>
          </p>
        </section>

        <!-- Interaksi: ubah jumlah, lalu masukkan keranjang atau beli sekarang -->
        <div class="atur">
          <label class="text-caption" for="jumlah">Jumlah</label>
          <div class="stepper" role="group" aria-label="Atur jumlah">
            <button type="button" aria-label="Kurangi jumlah" :disabled="jumlah <= 1" @click="ubah(-1)"><AppIcon name="minus" :size="14" /></button>
            <output id="jumlah" aria-live="polite">{{ jumlah }}</output>
            <button type="button" aria-label="Tambah jumlah" @click="ubah(1)"><AppIcon name="plus" :size="14" /></button>
          </div>
        </div>

        <div class="aksi">
          <button type="button" class="btn btn--secondary" @click="masukKeranjang">Masukkan Keranjang</button>
          <button type="button" class="btn btn--primary" @click="beliSekarang">Beli Sekarang</button>
        </div>

        <section class="ulasan" aria-labelledby="h-ulasan">
          <h2 id="h-ulasan" class="text-heading3">Ulasan Pembeli</h2>
          <div class="divider"></div>
          <ul>
            <li v-for="u in product.ulasan" :key="u.nama">
              <span class="ulasan__avatar" aria-hidden="true">{{ u.nama[0] }}</span>
              <div>
                <p class="text-body-strong">{{ u.nama }}</p>
                <p class="text-caption muted"><AppIcon name="star" :size="12" /> {{ u.rating }}/5</p>
              </div>
              <p class="ulasan__komentar">{{ u.komentar }}</p>
            </li>
          </ul>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.cari .field {
  min-height: 40px;
  border-radius: 999px;
}
.detail {
  display: grid;
  gap: 16px;
  margin-top: 16px;
}
.detail__foto img {
  width: 100%;
  height: auto;
  aspect-ratio: 328 / 183;
  border-radius: var(--radius-16);
  object-fit: cover;
}
.detail__isi {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.detail__harga {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.detail__rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  font-weight: 600;
}
.detail__deskripsi {
  font-size: 14px;
  line-height: 20px;
  color: var(--color-text-secondary);
}
.penjual {
  padding: 8px;
  border-radius: var(--radius-16);
  box-shadow: 0 1px 4px rgba(17, 24, 39, 0.18);
}
.penjual__baris {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.penjual__nama {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 14px;
}
.penjual__avatar,
.ulasan__avatar {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-brand);
  color: var(--color-on-brand);
  font-size: 12px;
  font-weight: 600;
}
.penjual__masuk {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 32px;
  padding: 0 8px;
  border-radius: var(--radius-8);
  color: var(--color-brand);
  font-size: 12px;
  font-weight: 600;
}
.penjual__ambil {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}
.atur {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stepper {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 2px solid var(--color-brand);
  border-radius: 999px;
  padding: 2px;
}
.stepper button {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--color-brand);
}
.stepper button:disabled {
  color: #9ca3af;
  cursor: not-allowed;
}
.stepper output {
  min-width: 28px;
  text-align: center;
  font-weight: 600;
}
.aksi {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.aksi .btn {
  min-height: 40px;
  font-size: 14px;
}
.ulasan ul {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}
.ulasan li {
  display: grid;
  grid-template-columns: 28px auto 1fr;
  gap: 10px;
  align-items: start;
}
.ulasan__komentar {
  font-size: 12px;
  line-height: 16px;
}
.ulasan__avatar {
  background: #9ca3af;
}
@media (min-width: 768px) {
  .detail {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 32px;
    align-items: start;
  }
  .detail__foto {
    position: sticky;
    top: 16px;
  }
}
</style>
