import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from './views/LoginView.vue'
import DaftarView from './views/DaftarView.vue'
import BerandaView from './views/BerandaView.vue'
import RiwayatView from './views/RiwayatView.vue'
import KatalogView from './views/KatalogView.vue'
import DetailView from './views/DetailView.vue'
import KeranjangView from './views/KeranjangView.vue'
import CheckoutView from './views/CheckoutView.vue'
import KonfirmasiView from './views/KonfirmasiView.vue'

// Mode hash supaya refresh di GitHub Pages tidak menghasilkan 404.
export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/masuk' },
    { path: '/masuk', name: 'masuk', component: LoginView, meta: { title: 'Masuk' } },
    { path: '/daftar', name: 'daftar', component: DaftarView, meta: { title: 'Buat Akun' } },
    { path: '/beranda', name: 'beranda', component: BerandaView, meta: { title: 'Beranda' } },
    { path: '/riwayat', name: 'riwayat', component: RiwayatView, meta: { title: 'Riwayat Pencarian' } },
    { path: '/katalog', name: 'katalog', component: KatalogView, meta: { title: 'Katalog Menu' } },
    { path: '/produk/:id', name: 'produk', component: DetailView, meta: { title: 'Detail Produk' } },
    { path: '/keranjang', name: 'keranjang', component: KeranjangView, meta: { title: 'Keranjang' } },
    { path: '/checkout', name: 'checkout', component: CheckoutView, meta: { title: 'Checkout' } },
    { path: '/konfirmasi', name: 'konfirmasi', component: KonfirmasiView, meta: { title: 'Transaksi Berhasil' } },
    { path: '/:pathMatch(.*)*', redirect: '/masuk' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
