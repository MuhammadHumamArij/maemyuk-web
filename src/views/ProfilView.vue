<script setup>

import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { asset } from '../utils'
import { auth, keluarAkun } from '../auth'

const router = useRouter()
const PROFILE_STORAGE_KEY = 'maemyuk-profile'

// Nama dan email berasal dari akun yang sedang login. Alamat masih disimpan di browser.
const defaultProfile = () => ({
  name: auth.username || 'Pengguna',
  email: auth.user?.email ?? '',
  address: 'Tegal, Jawa Tengah',
})

function loadProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY)
    const akun = defaultProfile()

    // Email selalu mengikuti akun yang login, bukan data tersimpan.
    return saved
      ? { ...akun, ...JSON.parse(saved), email: akun.email }
      : akun
  } catch (error) {
    console.error('Gagal membaca profil:', error)
    return defaultProfile()
  }
}

const isEditing = ref(false)
const activeMenu = ref('')
const profile = reactive(loadProfile())
const editForm = reactive({ ...profile })

function openEdit() {
  Object.assign(editForm, profile)
  isEditing.value = true
}

function saveProfile() {
  Object.assign(profile, editForm)

  try {
    localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify(profile)
    )
    isEditing.value = false
  } catch (error) {
    console.error('Gagal menyimpan profil:', error)
    alert('Data profil gagal disimpan.')
  }
}

function toggleMenu(menu) {
  activeMenu.value = activeMenu.value === menu ? '' : menu
}

async function logout() {
  await keluarAkun()
  try {
    // Data profil lokal milik akun ini dihapus agar tidak terbaca akun berikutnya di browser yang sama.
    localStorage.removeItem(PROFILE_STORAGE_KEY)
  } catch {
    /* abaikan */
  }
  router.push('/masuk')
}

</script>

<template>
  <main class="profile-page">
    <section class="profile-card">
      <header class="profile-header">
        <button class="icon-btn back-btn" @click="$router.back()" aria-label="Kembali">
          <img
            :src="asset('icons/ikon-chevron-left.svg')"
            alt=""
            width="22"
            height="22"
          />
        </button>

        <h1>Profil</h1>

        <button class="icon-btn settings-btn" aria-label="Pengaturan">
          <svg viewBox="0 0 24 24" fill="none" stroke="#111111"
            stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9.6 2.8h4.8l.6 2.5a7.4 7.4 0 0 1 1.7 1l2.4-.8 2.4 4.1-1.8 1.8a7.8 7.8 0 0 1 0 2l1.8 1.8-2.4 4.1-2.4-.8a7.4 7.4 0 0 1-1.7 1l-.6 2.5H9.6L9 19.5a7.4 7.4 0 0 1-1.7-1l-2.4.8-2.4-4.1 1.8-1.8a7.8 7.8 0 0 1 0-2l-1.8-1.8 2.4-4.1 2.4.8a7.4 7.4 0 0 1 1.7-1l.6-2.5Z" />
            <circle cx="12" cy="12.4" r="3.2" />
          </svg>
        </button>

        <div class="food-decoration food-left">🍜</div>
        <div class="food-decoration food-right">🍲</div>
      </header>

      <div class="avatar-wrapper">
        <div class="avatar" aria-label="Foto profil pengguna">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
          </svg>
        </div>
      </div>

      <section class="profile-info" aria-label="Informasi profil">
        <div class="field">
          <label>Nama</label>
          <div class="field-content">{{ profile.name }}</div>
        </div>

        <div class="field">
          <label>Email</label>
          <div class="field-content">{{ profile.email }}</div>
        </div>

        <div class="field">
          <label>Password</label>
          <div class="field-content password-value">● ● ● ● ● ● ● ●</div>
        </div>

        <div class="field">
          <label>Alamat</label>
          <div class="field-content">{{ profile.address }}</div>
        </div>
      </section>

      <section class="account-menu" aria-label="Menu akun">
        <button class="menu-item" @click="toggleMenu('payment')">
          <span>Detail Pembayaran</span>
          <span class="menu-arrow">{{ activeMenu === 'payment' ? '⌄' : '›' }}</span>
        </button>
        <div v-if="activeMenu === 'payment'" class="menu-detail">
          Belum ada metode pembayaran yang tersimpan.
        </div>

        <button class="menu-item" @click="toggleMenu('orders')">
          <span>Riwayat Order</span>
          <span class="menu-arrow">{{ activeMenu === 'orders' ? '⌄' : '›' }}</span>
        </button>
        <div v-if="activeMenu === 'orders'" class="menu-detail">
          Riwayat pesanan akan ditampilkan di sini.
        </div>
      </section>

      <footer class="profile-actions">
        <button class="edit-btn" @click="openEdit">
          Edit Profil
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m16 4 4 4L9 19H5v-4L16 4Z" />
            <path d="m14 6 4 4" />
          </svg>
        </button>

        <button class="logout-btn" @click="logout">
          Keluar
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round">
            <path d="M10 17l5-5-5-5M15 12H3" />
            <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" />
          </svg>
        </button>
      </footer>

      <div v-if="isEditing" class="modal-overlay" @click.self="isEditing = false">
        <form class="edit-modal" @submit.prevent="saveProfile">
          <h2>Edit Profil</h2>

          <label for="profile-name">Nama</label>
          <input id="profile-name" v-model.trim="editForm.name" type="text" required />

          <label for="profile-email">Email</label>
          <input id="profile-email" :value="profile.email" type="email" disabled />
          <p class="input-note">Email akun dikelola melalui autentikasi.</p>

          <label for="profile-address">Alamat</label>
          <textarea id="profile-address" v-model.trim="editForm.address" rows="2" />

          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="isEditing = false">
              Batal
            </button>
            <button type="submit" class="save-btn">Simpan</button>
          </div>
        </form>
      </div>
    </section>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.profile-page {
  min-height: 100vh;
  padding: 32px 16px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #f5f7f8;
  color: #292929;
  font-family: inherit;
}

.profile-card {
  position: relative;
  width: 100%;
  max-width: 430px;
  min-height: 650px;
  padding: 0 16px 20px;
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 3px 15px rgba(0, 0, 0, .08);
}

.profile-header {
  height: 140px;
  margin: 0 -16px;
  padding: 12px 16px;
  position: relative;
  display: grid;
  grid-template-columns: 36px 1fr 36px;
  align-items: start;
  background: #147d91;
  color: white;
  border-radius: 0 0 28px 28px;
  overflow: hidden;
}

.profile-header h1 {
  position: relative;
  justify-self: center;
  margin: 0;
  padding-top: 0;
  font-size: 16px;
  font-weight: 600;
}

.icon-btn {
  position: relative;
  z-index: 2;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  justify-self: center;
  border: 0;
  color: white;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.icon-btn svg,
.icon-btn img {
  display: block;
  width: 23px;
  height: 23px;
  object-fit: contain;
}

.back-btn img {
  filter: brightness(0) invert(1);
}

.settings-btn {
  justify-self: end;
  margin-right: 2px;
}

.food-decoration {
  position: absolute;
  top: 43px;
  width: 100px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  opacity: .3;
}

.food-left {
  left: -27px;
  transform: rotate(-18deg);
}

.food-right {
  right: -27px;
  transform: rotate(18deg);
}

.avatar-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  margin-top: -54px;
  margin-bottom: 22px;
}

.avatar {
  width: 76px;
  height: 76px;
  display: grid;
  place-items: center;
  background: #e8f4f5;
  border: 4px solid white;
  border-radius: 17px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, .15);
  color: #147d91;
}

.avatar svg {
  width: 43px;
  height: 43px;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 17px;
}

.field {
  position: relative;
  border: 1px solid #bdbdbd;
  border-radius: 12px;
  min-height: 47px;
  padding: 13px 11px 8px;
}

.field label {
  position: absolute;
  top: -8px;
  left: 10px;
  padding: 0 5px;
  background: white;
  color: #999;
  font-size: 11px;
}

.field-content {
  font-size: 12px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.password-value {
  letter-spacing: 1px;
}

.account-menu {
  margin: 23px 4px 15px;
  padding-top: 10px;
  border-top: 1px solid #ddd;
}

.menu-item {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 8px 7px;
  border: 0;
  background: transparent;
  font-size: 12px;
  color: #444;
  cursor: pointer;
  text-align: left;
}

.menu-arrow {
  color: #147d91;
  font-size: 18px;
  line-height: 1;
}

.menu-detail {
  padding: 9px;
  margin: 0 6px 5px;
  border-radius: 8px;
  background: #e8f4f5;
  color: #52666a;
  font-size: 11px;
}

.profile-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
}

.profile-actions button {
  min-height: 42px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.profile-actions svg {
  width: 17px;
  height: 17px;
}

.edit-btn {
  border: 1px solid #147d91;
  background: #147d91;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
}

.logout-btn {
  border: 1px solid #147d91;
  background: white;
  color: #147d91;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .5);
}

.edit-modal {
  width: 100%;
  max-width: 350px;
  padding: 22px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 10px 35px rgba(0, 0, 0, .18);
}

.edit-modal h2 {
  margin: 0 0 18px;
  color: #147d91;
  font-size: 20px;
}

.edit-modal label {
  display: block;
  margin: 12px 0 5px;
  font-size: 12px;
  color: #666;
}

.edit-modal input,
.edit-modal textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font: inherit;
  font-size: 13px;
}

.edit-modal input:disabled {
  background: #f2f4f5;
  color: #888;
}

.input-note {
  margin: 5px 0 0;
  color: #888;
  font-size: 10px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.modal-actions button {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.cancel-btn {
  border: 1px solid #ccc;
  background: white;
  color: #555;
}

.save-btn {
  border: 1px solid #147d91;
  background: #147d91;
  color: white;
}

@media (min-width: 600px) {
  .profile-page {
    padding-top: 50px;
  }
}

@media (max-width: 380px) {
  .profile-page {
    padding: 16px 10px;
  }

  .profile-card {
    padding-right: 13px;
    padding-left: 13px;
  }

  .profile-header {
    margin-right: -13px;
    margin-left: -13px;
  }
}
</style>
