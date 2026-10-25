<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '../components/AppIcon.vue'
import BackBar from '../components/BackBar.vue'
import ProductRow from '../components/ProductRow.vue'
import EmptyState from '../components/EmptyState.vue'
import { kategori as daftarKategori, toko as dataToko } from '../data/products'
import { productState, muatProduk } from '../productStore'
import { asset, jarakText } from '../utils'
import SkeletonRow from '../components/SkeletonRow.vue'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (!productState.items.length) muatProduk()
})

// Interaksi 2: pencarian, kategori, urutan, dan tab Item/Toko, semuanya reaktif.

const q = ref(route.query.q ?? '')
const kategoriAktif = ref(route.query.kategori ?? '')
const urutan = ref(route.query.sort ?? '')
const tab = ref('item')
const filterTerbuka = ref(false)

watch(
  () => route.query,
  (query) => {
    q.value = query.q ?? ''
    kategoriAktif.value = query.kategori ?? ''
    urutan.value = query.sort ?? ''
  },
)

const sinkron = () =>
  router.replace({
    path: '/katalog',
    query: {
      ...(q.value.trim() && { q: q.value.trim() }),
      ...(kategoriAktif.value && { kategori: kategoriAktif.value }),
      ...(urutan.value && { sort: urutan.value }),
    },
  })

const urutOpsi = [
  { nilai: 'terdekat', label: 'Terdekat' },
  { nilai: 'rating', label: 'Rating tertinggi' },
  { nilai: 'populer', label: 'Banyak diminati' },
]

const hasil = computed(() => {
  const kata = q.value.trim().toLowerCase()
  let daftar = productState.items.filter((p) => {
    const cocokKata = !kata || [p.nama, p.toko, p.kategori].some((t) => t.toLowerCase().includes(kata))
    const cocokKategori = !kategoriAktif.value || p.kategori === kategoriAktif.value
    return cocokKata && cocokKategori
  })
  if (urutan.value === 'terdekat') daftar = [...daftar].sort((a, b) => a.jarak - b.jarak)
  if (urutan.value === 'rating') daftar = [...daftar].sort((a, b) => b.rating - a.rating)
  if (urutan.value === 'populer') daftar = [...daftar].sort((a, b) => b.populer - a.populer)
  return daftar
})

const daftarToko = computed(() => {
  const map = new Map()
  for (const p of hasil.value) {
    const t = map.get(p.toko) ?? { nama: p.toko, jarak: p.jarak, jumlah: 0 }
    t.jarak = Math.min(t.jarak, p.jarak)
    t.jumlah += 1
    map.set(p.toko, t)
  }
  return [...map.values()]
})

function pilihKategori(k) {
  kategoriAktif.value = kategoriAktif.value === k ? '' : k
  sinkron()
}
function pilihUrutan(nilai) {
  urutan.value = urutan.value === nilai ? '' : nilai
  sinkron()
}
function reset() {
  q.value = ''
  kategoriAktif.value = ''
  urutan.value = ''
  tab.value = 'item'
  filterTerbuka.value = false
  sinkron()
}
function bukaToko(nama) {
  q.value = nama
  tab.value = 'item'
  sinkron()
}

const adaFilter = computed(() => q.value.trim() || kategoriAktif.value || urutan.value)
</script>

<template>
  <div class="container">
    <BackBar to="/beranda" label="Kembali ke beranda">
      <div class="bar">
        <form class="bar__cari" role="search" @submit.prevent="sinkron">
          <div class="field">
            <AppIcon name="search" :size="18" />
            <label for="cari-menu" class="sr-only">Cari menu</label>
            <input id="cari-menu" v-model="q" type="search" name="cari-menu" placeholder="Cari menu di sini...." @input="sinkron" />
          </div>
        </form>
        <button
          type="button"
          class="bar__filter"
          :aria-expanded="filterTerbuka"
          aria-controls="panel-urutan"
          @click="filterTerbuka = !filterTerbuka"
        >
          <img :src="asset('icons/ikon-filter-tune-no-bg.svg')" alt="Buka filter" width="32" height="32" />
        </button>
      </div>
    </BackBar>

    <div v-if="filterTerbuka" id="panel-urutan" class="urutan" role="group" aria-label="Urutkan">
      <span class="text-caption muted">Urutkan:</span>
      <button
        v-for="o in urutOpsi"
        :key="o.nilai"
        type="button"
        class="chip"
        :class="{ 'chip--aktif': urutan === o.nilai }"
        :aria-pressed="urutan === o.nilai"
        @click="pilihUrutan(o.nilai)"
      >
        {{ o.label }}
      </button>
    </div>

    <nav class="chips" aria-label="Kategori">
      <button
        v-for="k in daftarKategori"
        :key="k"
        type="button"
        class="chip"
        :class="{ 'chip--aktif': kategoriAktif === k }"
        :aria-pressed="kategoriAktif === k"
        @click="pilihKategori(k)"
      >
        {{ k }}
      </button>
    </nav>

    <div class="tab" role="tablist" aria-label="Jenis pencarian">
      <button type="button" role="tab" :aria-selected="tab === 'item'" :class="{ 'tab--aktif': tab === 'item' }" @click="tab = 'item'">Item</button>
      <button type="button" role="tab" :aria-selected="tab === 'toko'" :class="{ 'tab--aktif': tab === 'toko' }" @click="tab = 'toko'">Toko</button>
    </div>

    <main>
      <template v-if="productState.loading">
        <p class="sr-only" role="status">Memuat menu...</p>
        <ul class="product-grid" aria-hidden="true">
          <li v-for="n in 6" :key="n"><SkeletonRow /></li>
        </ul>
      </template>
      <div v-else-if="productState.error" role="alert">
        <p>{{ productState.error }}</p>
        <button type="button" class="btn btn--secondary btn--sm" @click="muatProduk">Coba lagi</button>
      </div>
      <EmptyState v-else-if="!hasil.length" @reset="reset" />

      <template v-else>
        <h1 class="sr-only">Katalog Menu</h1>
        <p class="text-caption muted jumlah" aria-live="polite">{{ hasil.length }} menu ditemukan</p>

        <ul v-if="tab === 'item'" class="product-grid">
          <li v-for="p in hasil" :key="p.id"><ProductRow :product="p" /></li>
        </ul>

        <ul v-else class="product-grid">
          <li v-for="t in daftarToko" :key="t.nama">
            <button type="button" class="toko" @click="bukaToko(t.nama)">
              <span>
                <strong class="text-body-strong">{{ t.nama }}</strong>
                <span class="text-caption muted toko__alamat">{{ dataToko[t.nama]?.alamat }}</span>
              </span>
              <span class="text-caption">{{ t.jumlah }} menu, mulai {{ jarakText(t.jarak) }}</span>
            </button>
          </li>
        </ul>

        <button v-if="adaFilter" type="button" class="btn btn--secondary btn--sm reset" @click="reset">Hapus semua filter</button>
      </template>
    </main>
  </div>
</template>

<style scoped>
.bar {
  display: flex;
  align-items: center;
  gap: 8px;
}
.bar__cari {
  flex: 1;
  min-width: 0;
}
.bar__cari .field {
  min-height: 40px;
  border-radius: 999px;
}
.bar__filter {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 0;
  background: none;
}
.chips,
.urutan {
  display: flex;
  gap: 10px;
  margin-top: 8px;
  overflow-x: auto;
  padding: 2px 0 6px;
  scrollbar-width: none;
}
.urutan {
  align-items: center;
}
.chip {
  flex: none;
  min-height: 36px;
  padding: 0 14px;
  border: 2px solid var(--color-brand);
  border-radius: 999px;
  background: var(--color-bg-screen);
  color: var(--color-brand);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  transition: background 0.15s ease, color 0.15s ease;
}
.chip--aktif {
  background: var(--color-brand);
  color: var(--color-on-brand);
}
.tab {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 8px 0 16px;
  border-bottom: 4px solid rgba(14, 116, 144, 0.18);
}
.tab button {
  min-height: 44px;
  border: 0;
  border-bottom: 4px solid transparent;
  margin-bottom: -4px;
  background: none;
  font-weight: 600;
  color: var(--color-text-secondary);
}
.tab .tab--aktif {
  border-bottom-color: var(--color-brand);
  color: var(--color-brand);
}
.jumlah {
  margin-bottom: 8px;
}
.toko {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 12px;
  border: 0;
  border-radius: var(--radius-16);
  background: var(--color-bg-screen);
  box-shadow: 0 1px 4px rgba(17, 24, 39, 0.18);
  text-align: left;
}
.toko__alamat {
  display: block;
}
.reset {
  margin-top: 16px;
  max-width: 280px;
}
</style>
