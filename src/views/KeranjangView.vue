<script setup>
import { computed, onMounted } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import BackBar from '../components/BackBar.vue'
import ProductRow from '../components/ProductRow.vue'
import { lines, selectedLines, summary, setQty, removeItem, toggleSelected, cart } from '../store'
import { productState, muatProduk } from '../productStore'
import { asset, groupByToko, rupiah } from '../utils'

onMounted(() => {
  if (!productState.items.length) muatProduk()
})

// Interaksi 3: jumlah, pilihan, dan total berubah langsung (state reaktif di store).
const grup = computed(() => groupByToko(lines.value))
const rekomendasi = computed(() => productState.items.filter((p) => !cart.items.some((i) => i.id === p.id)).slice(0, 4))
const jumlahTerpilih = computed(() => selectedLines.value.reduce((s, l) => s + l.qty, 0))
</script>

<template>
  <div class="container container--wide">
    <BackBar to="/katalog" label="Kembali ke katalog">
      <h1 class="text-heading2 judul">Keranjang</h1>
    </BackBar>

    <main class="isi">
      <section v-if="grup.length" class="daftar" aria-label="Isi keranjang">
        <div v-for="g in grup" :key="g.nama" class="toko">
          <h2 class="text-heading3">{{ g.nama }}</h2>
          <ul class="stack item-list">
            <li v-for="l in g.items" :key="l.id" class="item">
              <img :src="asset(`images/${l.product.gambar}`)" :alt="l.product.alt" width="60" height="60" />
              <div class="item__info">
                <h3 class="item__nama">{{ l.product.nama }}</h3>
                <p class="item__desk">{{ l.product.singkat }}</p>
                <div class="item__baris">
                  <div class="stepper" role="group" :aria-label="`Jumlah ${l.product.nama}`">
                    <button type="button" :aria-label="`Kurangi ${l.product.nama}`" @click="setQty(l.id, l.qty - 1)">
                      <AppIcon :name="l.qty === 1 ? 'trash' : 'minus'" :size="13" />
                    </button>
                    <output>{{ l.qty }}x</output>
                    <button type="button" :aria-label="`Tambah ${l.product.nama}`" @click="setQty(l.id, l.qty + 1)">
                      <AppIcon name="plus" :size="13" />
                    </button>
                  </div>
                  <span class="item__harga">{{ rupiah(l.product.harga * l.qty) }}</span>
                </div>
              </div>
              <button type="button" class="item__hapus" :aria-label="`Hapus ${l.product.nama}`" @click="removeItem(l.id)">
                <AppIcon name="trash" :size="16" />
              </button>
              <input
                :id="`pilih-${l.id}`"
                class="check item__pilih"
                type="checkbox"
                :checked="l.selected"
                @change="toggleSelected(l.id)"
              />
              <label :for="`pilih-${l.id}`" class="sr-only">Pilih {{ l.product.nama }}</label>
            </li>
          </ul>
        </div>
      </section>

      <p v-else-if="productState.loading" class="muted" role="status">Memuat keranjang...</p>
      <section v-else-if="!productState.loading" class="kosong" role="status">
        <h2 class="text-heading3">Keranjangmu masih kosong</h2>
        <p class="muted">Yuk cari makanan surplus yang masih layak dan lebih hemat.</p>
        <RouterLink to="/katalog" class="btn btn--primary">Lihat Katalog</RouterLink>
      </section>

      <aside class="ringkas">
        <div v-if="grup.length" class="ringkas__total" aria-live="polite">
          <span>Total ({{ jumlahTerpilih }} item dipilih)</span>
          <strong class="text-heading3">{{ rupiah(summary.subtotal) }}</strong>
        </div>
        <RouterLink
          v-if="selectedLines.length"
          to="/checkout"
          class="btn btn--primary"
        >Checkout</RouterLink>
        <button v-else type="button" class="btn btn--primary" disabled>Checkout</button>
      </aside>

      <section class="rek" aria-labelledby="h-rek">
        <div class="divider"></div>
        <h2 id="h-rek" class="text-heading3">Rekomendasi Menu Lain</h2>
        <ul class="product-grid">
          <li v-for="p in rekomendasi" :key="p.id"><ProductRow :product="p" /></li>
        </ul>
      </section>
    </main>
  </div>
</template>

<style scoped>
.judul {
  text-align: center;
  margin-right: 32px;
}
.isi {
  display: grid;
  gap: 24px;
  margin-top: 16px;
}
.toko h2 {
  padding: 10px 0;
}
.item-list {
  gap: 10px;
}
.item {
  position: relative;
  display: grid;
  grid-template-columns: 60px minmax(0, 1fr) auto;
  gap: 10px;
  padding: 8px;
  border-radius: var(--radius-16);
  box-shadow: 0 1px 4px rgba(17, 24, 39, 0.18);
}
.item img {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-8);
  object-fit: cover;
}
.item__nama {
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 16px;
  font-weight: 600;
}
.item__desk {
  margin-top: 4px;
  font-size: 12px;
  line-height: 16px;
  color: var(--color-text-secondary);
}
.item__baris {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;
}
.item__harga {
  font-size: 12px;
  font-weight: 600;
}
.item__hapus {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 0;
  background: none;
  color: var(--color-text-placeholder);
  justify-self: end;
}
.item__pilih {
  position: absolute;
  right: 12px;
  bottom: 12px;
}
.stepper {
  display: inline-flex;
  align-items: center;
  border: 2px solid var(--color-brand);
  border-radius: 999px;
}
.stepper button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 50%;
  background: none;
  color: var(--color-brand);
}
.stepper output {
  min-width: 26px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
}
.kosong {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 0;
  text-align: center;
}
.kosong .btn {
  max-width: 280px;
}
.ringkas {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ringkas__total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}
.rek {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
@media (min-width: 900px) {
  .isi {
    grid-template-columns: minmax(0, 1fr) 340px;
    align-items: start;
  }
  .daftar {
    grid-column: 1;
    grid-row: 1;
  }
  .ringkas {
    grid-column: 2;
    grid-row: 1;
    position: sticky;
    top: 16px;
    padding: 16px;
    border-radius: var(--radius-16);
    box-shadow: 0 1px 6px rgba(17, 24, 39, 0.2);
  }
  .rek {
    grid-column: 1 / -1;
  }
}
</style>
