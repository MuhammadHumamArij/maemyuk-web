<script setup>
// Layar "Data Tidak Ditemukan". Dipakai sebagai kondisi di Katalog, bukan halaman terpisah.
import { asset } from '../utils'
defineEmits(['reset'])
</script>

<template>
  <section class="empty" role="status">
    <img :src="asset('icons/ikon-triangle-danger.svg')" alt="" width="172" height="154" />
    <h1 class="text-heading2">Data Tidak Ditemukan</h1>
    <p>Coba ubah filter atau cari di area yang berbeda</p>
    <p class="muted">Tidak ada produk yang sesuai dengan pencarianmu saat ini</p>

    <div class="empty__tips">
      <h2 class="text-body-strong">Coba juga:</h2>
      <ul>
        <li>Perluas jangkauan lokasi</li>
        <li>Hapus filter harga</li>
      </ul>
    </div>

    <div class="empty__actions">
      <button type="button" class="btn btn--primary" @click="$emit('reset')">Reset Pencarian</button>
      <RouterLink to="/beranda" class="btn btn--secondary">Kembali ke Beranda</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 0 16px;
  text-align: center;
}
.empty__tips {
  margin-top: 16px;
}
.empty__tips ul {
  margin-top: 4px;
}
.empty__actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 320px;
  margin-top: 16px;
}
</style>
