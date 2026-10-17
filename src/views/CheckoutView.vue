<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BackBar from '../components/BackBar.vue'
import { selectedLines, summary, cart, placeOrder } from '../store'
import { asset, rupiah } from '../utils'

const router = useRouter()
if (!selectedLines.value.length) router.replace('/keranjang')

const metode = ref('')
const nama = ref('')
const metodeOpsi = [
  { nilai: 'bayar-di-tempat', label: 'Bayar di Tempat', ikon: 'ikon-COD.svg' },
  { nilai: 'kartu-debit', label: 'Kartu Debit', ikon: 'ikon-debit-card.svg' },
  { nilai: 'qris', label: 'Qris', ikon: 'logo-qris.svg' },
  { nilai: 'dana', label: 'Dana', ikon: 'logo-dana.svg' },
]

const siap = computed(() => metode.value !== '' && nama.value.trim() !== '' && selectedLines.value.length > 0)

// Interaksi 4: pembayaran membuat pesanan dari item yang dipilih, lalu pindah ke Konfirmasi.
function bayar() {
  if (!siap.value) return
  placeOrder({ nama: nama.value.trim(), metode: metode.value })
  router.push('/konfirmasi')
}
</script>

<template>
  <div class="container container--wide">
    <BackBar to="/keranjang" label="Kembali ke keranjang">
      <h1 class="text-heading2 judul">Checkout</h1>
    </BackBar>

    <form class="isi" novalidate @submit.prevent="bayar">
      <div class="kolom">
        <section aria-labelledby="h-item">
          <h2 id="h-item" class="text-heading3">List Item</h2>
          <ul class="stack item-list">
            <li v-for="l in selectedLines" :key="l.id" class="item">
              <img :src="asset(`images/${l.product.gambar}`)" :alt="l.product.alt" width="60" height="60" />
              <div>
                <h3 class="item__nama">{{ l.product.nama }}</h3>
                <p class="item__desk">{{ l.product.singkat }}</p>
                <p class="item__desk">{{ l.qty }}x</p>
              </div>
              <span class="item__harga">{{ rupiah(l.product.harga * l.qty) }}</span>
            </li>
          </ul>
        </section>

        <section aria-labelledby="h-voucher">
          <h2 id="h-voucher" class="text-heading3">Voucher Promo</h2>
          <div class="divider"></div>
          <button type="button" class="voucher" :aria-pressed="cart.voucher" @click="cart.voucher = !cart.voucher">
            <img :src="asset('icons/ikon-voucher.svg')" alt="" width="22" height="29" />
            <span v-if="cart.voucher">Potongan -Rp 5.000 terpasang</span>
            <span v-else>Pakai voucher potongan Rp 5.000</span>
          </button>
        </section>
      </div>

      <div class="kolom">
        <fieldset class="bayar">
          <legend class="text-heading3">Metode Pembayaran</legend>
          <div class="divider"></div>
          <label v-for="m in metodeOpsi" :key="m.nilai" class="metode">
            <img :src="asset(`icons/${m.ikon}`)" alt="" width="28" height="24" />
            <span>{{ m.label }}</span>
            <input v-model="metode" class="check check--radio" type="radio" name="metode-pembayaran" :value="m.nilai" />
          </label>
        </fieldset>

        <section aria-labelledby="h-ringkasan">
          <h2 id="h-ringkasan" class="text-heading3">Ringkasan Transaksi</h2>
          <div class="divider"></div>
          <table class="ringkasan">
            <caption class="sr-only">Ringkasan Transaksi</caption>
            <thead class="sr-only"><tr><th scope="col">Item</th><th scope="col">Harga</th></tr></thead>
            <tbody>
              <tr v-for="l in selectedLines" :key="l.id">
                <th scope="row">{{ l.product.nama }} ({{ l.qty }}x)</th>
                <td>{{ rupiah(l.product.harga * l.qty) }}</td>
              </tr>
              <tr>
                <th scope="row">Biaya Jasa Aplikasi</th>
                <td>{{ rupiah(summary.fee) }}</td>
              </tr>
              <tr v-if="summary.voucher">
                <th scope="row">Voucher Promo</th>
                <td>-{{ rupiah(summary.voucher) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Total Harga</th>
                <td>{{ rupiah(summary.total) }}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        <section aria-labelledby="h-nama">
          <h2 id="h-nama" class="text-heading3">Nama Penerima</h2>
          <label for="nama-penerima" class="sr-only">Nama penerima</label>
          <div class="field nama">
            <input id="nama-penerima" v-model="nama" type="text" name="nama-penerima" placeholder="Tulis nama..." autocomplete="name" />
          </div>
        </section>

        <div class="footer">
          <div class="footer__total" aria-live="polite">
            <span class="text-heading3">Total Harga</span>
            <span>
              <strong class="text-heading3">{{ rupiah(summary.total) }}</strong>
              <span class="text-caption hemat">Hemat {{ summary.hemat }}%</span>
            </span>
          </div>
          <button type="submit" class="btn btn--primary" :disabled="!siap">
            <img :src="asset('icons/ikon-pay.svg')" alt="" width="18" height="17" />Bayar
          </button>
          <p v-if="!siap" class="text-caption muted">Pilih metode pembayaran dan isi nama penerima untuk melanjutkan.</p>
        </div>
      </div>
    </form>
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
.kolom {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
section > h2,
.bayar legend {
  padding: 8px 0;
}
.item-list {
  gap: 10px;
  margin-top: 8px;
}
.item {
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
.item__harga {
  align-self: end;
  font-size: 12px;
  font-weight: 600;
}
.voucher {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 44px;
  margin-top: 8px;
  padding: 0;
  border: 0;
  background: none;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
}
.voucher[aria-pressed='false'] {
  color: var(--color-text-secondary);
}
.bayar {
  border: 0;
  margin: 0;
  padding: 0;
}
.metode {
  display: grid;
  grid-template-columns: 32px 1fr 24px;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  cursor: pointer;
}
.ringkasan {
  width: 100%;
  margin-top: 8px;
  border-collapse: collapse;
  font-size: 12px;
  line-height: 16px;
}
.ringkasan th {
  font-weight: 400;
  text-align: left;
  padding: 5px 8px;
}
.ringkasan td {
  text-align: right;
  padding: 5px 8px;
}
.ringkasan tfoot th,
.ringkasan tfoot td {
  border-top: 2px solid var(--color-text-placeholder);
  font-weight: 600;
  padding-top: 8px;
}
.nama {
  margin-top: 4px;
  min-height: 40px;
}
.footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.footer__total {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.footer__total > span:last-child {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.hemat {
  color: var(--color-text-discount);
  font-weight: 600;
}
@media (min-width: 900px) {
  .isi {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 40px;
    align-items: start;
  }
}
</style>
