<script setup>
import AppIcon from './AppIcon.vue'
import { asset, diskon, jarakText, rupiah } from '../utils.js'
defineProps({ product: { type: Object, required: true } })
</script>

<template>
  <RouterLink :to="`/produk/${product.id}`" class="row">
    <img
      class="row__img"
      :src="asset(`images/${product.gambar}`)"
      :alt="product.alt"
      width="60"
      height="60"
      loading="lazy"
    />
    <div class="row__info">
      <h3 class="row__name">{{ product.nama }}</h3>
      <p class="row__toko">{{ product.toko }}</p>
      <p class="row__price">
        <span>{{ rupiah(product.harga) }}</span>
        <s>{{ rupiah(product.hargaAsli) }}</s>
      </p>
    </div>
    <div class="row__meta">
      <span class="row__chip"><AppIcon name="pin" :size="12" />{{ jarakText(product.jarak) }}</span>
      <span class="row__chip"><AppIcon name="star" :size="12" />{{ product.rating }}/5</span>
      <span class="text-diskon">Disc {{ diskon(product) }}%</span>
    </div>
  </RouterLink>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 60px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: start;
  padding: 8px;
  border-radius: var(--radius-16);
  background: var(--color-bg-screen);
  box-shadow: 0 1px 4px rgba(17, 24, 39, 0.18);
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.row:hover {
  box-shadow: 0 3px 10px rgba(17, 24, 39, 0.22);
  transform: translateY(-1px);
}
.row__img {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-8);
  object-fit: cover;
}
.row__name {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
}
.row__toko {
  margin-top: 4px;
  font-size: 12px;
  line-height: 16px;
  color: var(--color-text-secondary);
}
.row__price {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
}
.row__price s {
  font-weight: 400;
  color: var(--color-text-placeholder);
}
.row__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
}
.row__chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-secondary);
}
.text-diskon {
  line-height: 20px;
}
</style>
