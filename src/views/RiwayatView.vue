<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '../components/AppIcon.vue'
import BackBar from '../components/BackBar.vue'
import { asset } from '../utils'

const router = useRouter()
const kata = ref('')

const riwayat = ref([
  { teks: 'Makanan Tradisional', query: { kategori: 'Makanan Tradisional' } },
  { teks: 'Menu Ayam', query: { kategori: 'Menu Ayam' } },
  { teks: 'Jus Buah', query: { kategori: 'Jus Buah' } },
])

const hapus = (teks) => (riwayat.value = riwayat.value.filter((r) => r.teks !== teks))
const cari = () => router.push({ path: '/katalog', query: kata.value.trim() ? { q: kata.value.trim() } : {} })
</script>

<template>
  <div class="container container--narrow">
    <!-- Mengembalikan form ke dalam BackBar, atau menggunakan wrapper flexbox khusus jika BackBar mendukung slot -->
    <BackBar to="/beranda" label="Kembali ke beranda">
      <form role="search" @submit.prevent="cari" class="search-form-inline">
        <div class="field">
          <AppIcon name="search" :size="18" />
          <label for="cari-menu" class="sr-only">Cari menu</label>
          <input id="cari-menu" v-model="kata" type="search" name="cari-menu" placeholder="Cari menu di sini...." autofocus />
        </div>
      </form>
    </BackBar>

    <main class="section">
      <h1 class="text-heading2">Riwayat Pencarian</h1>
      <ul v-if="riwayat.length" class="riwayat">
        <li v-for="r in riwayat" :key="r.teks">
          <RouterLink :to="{ path: '/katalog', query: r.query }">{{ r.teks }}</RouterLink>
          <button type="button" @click="hapus(r.teks)">
            <img :src="asset('icons/ikon-cancel.svg')" :alt="`Hapus riwayat ${r.teks}`" width="16" height="16" />
          </button>
        </li>
      </ul>
      <p v-else class="muted kosong">Belum ada riwayat pencarian.</p>
    </main>
  </div>
</template>

<style scoped>
/* Pastikan form menyesuaikan area slot di sebelah tombol kembali */
.search-form-inline {
  width: 100%;
}
.riwayat {
  margin-top: 16px;
}
.riwayat li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
}
.riwayat a {
  flex: 1;
  padding: 14px 0;
}
.riwayat button {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 0;
  background: none;
}
.kosong {
  margin-top: 16px;
}
</style>