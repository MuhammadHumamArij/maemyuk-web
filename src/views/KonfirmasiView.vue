<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { order } from '../store'
import { rupiah } from '../utils'

const router = useRouter()
if (!order.data) router.replace('/beranda')

// Interaksi 5: kode pengambilan baru tampil setelah area kode diketuk.
const terbuka = reactive({})
const tampilkan = (nama) => (terbuka[nama] = !terbuka[nama])

const jamAmbil = () => (order.data?.toko ?? []).map((t) => t.tutup).sort().at(-1) ?? '22:00'
</script>

<template>
  <div v-if="order.data" class="container container--narrow">
    <main class="konfirmasi">
      <header class="sukses">
        <svg class="sukses__ikon" viewBox="0 0 120 120" width="160" height="160" aria-hidden="true" focusable="false">
          <circle class="sukses__lingkar" cx="60" cy="60" r="54" fill="none" stroke-width="8" />
          <path class="sukses__centang" d="M34 62 L53 81 L88 42" fill="none" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <h1 class="text-heading2">Transaksi Berhasil</h1>
      </header>

      <section class="kode" aria-labelledby="h-kode">
        <h2 id="h-kode" class="sr-only">Kode pengambilan</h2>
        <ul class="stack">
          <li v-for="t in order.data.toko" :key="t.nama">
            <p class="text-body-strong">Toko: {{ t.nama }}</p>
            <button
              type="button"
              class="kode__tombol"
              :class="{ 'kode__tombol--buka': terbuka[t.nama] }"
              :aria-expanded="!!terbuka[t.nama]"
              @click="tampilkan(t.nama)"
            >
              <strong v-if="terbuka[t.nama]" class="kode__isi">{{ t.kode }}</strong>
              <span v-else>Ketuk untuk menampilkan kode</span>
            </button>
          </li>
        </ul>
        <p class="kode__info">Tunjukkan kode ini saat berada di lokasi</p>
        <p class="kode__info muted">Kode ini berlaku hingga jam {{ jamAmbil() }} WIB</p>
      </section>

      <section class="rincian" aria-labelledby="h-rincian">
        <h2 id="h-rincian" class="text-heading2">Rincian Pesanan</h2>
        <dl>
          <dt>Pesanan</dt>
          <dd>
            <template v-for="t in order.data.toko" :key="t.nama">
              <span v-for="i in t.items" :key="i.nama" class="baris">{{ i.qty }}x {{ i.nama }}</span>
            </template>
          </dd>
          <dt>Atas nama</dt>
          <dd>{{ order.data.nama }}</dd>
          <dt>Lokasi</dt>
          <dd>
            <span v-for="t in order.data.toko" :key="t.nama" class="baris">{{ t.alamat }}</span>
          </dd>
          <dt>Jam Ambil</dt>
          <dd>{{ jamAmbil() }} WIB</dd>
          <dt>Total Bayar</dt>
          <dd>{{ rupiah(order.data.total) }}</dd>
        </dl>
        <RouterLink to="/beranda" class="btn btn--primary">Kembali ke Beranda</RouterLink>
      </section>
    </main>
  </div>
</template>

<style scoped>
.konfirmasi {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 16px;
}
.sukses {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.sukses__lingkar {
  stroke: var(--color-brand);
  stroke-dasharray: 340;
  stroke-dashoffset: 340;
  animation: gambar 0.7s ease forwards;
}
.sukses__centang {
  stroke: var(--color-brand);
  stroke-dasharray: 90;
  stroke-dashoffset: 90;
  animation: gambar 0.5s 0.6s ease forwards;
}
@keyframes gambar {
  to {
    stroke-dashoffset: 0;
  }
}
.kode ul {
  gap: 12px;
}
.kode__tombol {
  width: 100%;
  min-height: 64px;
  margin-top: 4px;
  border: 2px dashed var(--color-brand);
  border-radius: var(--radius-16);
  background: rgba(14, 116, 144, 0.06);
  color: var(--color-brand);
  font-weight: 600;
}
.kode__tombol--buka {
  border-style: solid;
  background: var(--color-bg-screen);
}
.kode__isi {
  font-family: var(--font-heading);
  font-size: 24px;
  letter-spacing: 2px;
  animation: muncul 0.3s ease;
}
@keyframes muncul {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
}
.kode__info {
  margin-top: 12px;
  text-align: center;
  font-weight: 600;
}
.kode__info + .kode__info {
  margin-top: 4px;
  font-weight: 400;
}
.rincian {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.rincian dl {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px 16px;
}
.rincian dt {
  font-weight: 600;
}
.baris {
  display: block;
  margin-bottom: 4px;
}
</style>