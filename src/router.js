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
import ProfilView from './views/ProfilView.vue'

import { auth, siapAuth } from './auth'

// Halaman yang hanya bisa dibuka setelah login.
const WAJIB_LOGIN = ['checkout', 'konfirmasi', 'profil']

// Mode hash supaya refresh di GitHub Pages tidak menghasilkan 404.
const router = createRouter({
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
    { path: '/profil', name: 'profil', component: ProfilView, meta: { title: 'Profil Saya' } },
    { path: '/:pathMatch(.*)*', redirect: '/masuk' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  await siapAuth
  const sudahMasuk = Boolean(auth.user)
  if (WAJIB_LOGIN.includes(to.name) && !sudahMasuk) {
    return { name: 'masuk', query: { next: to.fullPath } }
  }
  if ((to.name === 'masuk' || to.name === 'daftar') && sudahMasuk) {
    return { name: 'beranda' }
  }
})

export default router
