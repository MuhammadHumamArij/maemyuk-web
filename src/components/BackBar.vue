<script setup>
// Bilah atas dengan tombol kembali. Slot default dipakai untuk kolom cari atau judul halaman.
import { asset } from '../utils'
defineProps({ to: { type: String, required: true }, label: { type: String, default: 'Kembali' } })
</script>

<template>
  <header class="back-bar">
    <RouterLink :to="to" class="back-bar__back">
      <img :src="asset('icon/ikon-chevron-left.svg')" :alt="label" width="15" height="26" />
    </RouterLink>
    <div class="back-bar__body"><slot /></div>
  </header>
</template>

<style scoped>
.back-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 43px;
}
.back-bar__back {
  display: grid;
  place-items: center;
  width: 32px;
  min-height: 44px;
}
.back-bar__body {
  flex: 1;
  min-width: 0;
}
</style>
