
<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '../components/AppIcon.vue'
import { asset } from '../utils'

const router = useRouter()
const email = ref('')
const password = ref('')
const gagal = ref(false)

// Referensi untuk autofokus kolom email
const emailInput = ref(null)

// Interaksi 1: tombol Masuk nonaktif sampai kedua field terisi.
const bisaMasuk = computed(() => email.value.trim() !== '' && password.value !== '')

const emailValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

// Aturan prototipe: email berformat benar dan password minimal 6 karakter dianggap valid.
// Selain itu tampil layar "Login Gagal" dari Figma sebagai kondisi di halaman yang sama.
function masuk() {
  if (!bisaMasuk.value) return
  if (emailValid(email.value.trim()) && password.value.length >= 6) {
    gagal.value = false
    router.push('/beranda')
  } else {
    gagal.value = true
  }
}

// Animasi pembuka: lingkaran membesar, logo muncul, lalu halaman login naik.
// Hanya sekali per sesi dan dilewati bila pengguna meminta gerak dikurangi.
const intro = ref(false)

onMounted(() => {
  let sudah = false

  try {
    sudah = sessionStorage.getItem('maemyuk.intro') === '1'
    sessionStorage.setItem('maemyuk.intro', '1')
  } catch {
    /* tanpa storage, animasi tetap boleh jalan */
  }

  const kurangiGerak = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)'
  ).matches

  // Jika animasi dilewati, langsung fokus ke email
  if (sudah || kurangiGerak) {
    nextTick(() => emailInput.value?.focus())
    return
  }

  intro.value = true

  // Fokus ke email setelah animasi pembuka selesai
  setTimeout(() => {
    intro.value = false
    nextTick(() => emailInput.value?.focus())
  }, 2300)
})
</script>

<template>
  <div class="login">
    <div v-if="intro" class="intro" aria-hidden="true">
      <span class="intro__dot"></span>
      <img class="intro__logo" :src="asset('icon/white-logo-maemyuk.svg')" alt="" />
    </div>

    <header class="login__hero">
      <RouterLink to="/beranda" class="login__logo">
        <img :src="asset('icons/white-logo-maemyuk.svg')" alt="MaemYuk, ke beranda" width="134" height="133" />
      </RouterLink>
      <p class="text-heading1">Selamat datang di<br />MaemYuk</p>
      <p class="text-body login__tagline">
        Temukan makanan lezat dari UMKM sekitar dengan harga lebih hemat, dan bantu kurangi makanan terbuang
      </p>
    </header>

    <main class="login__card">
      <h1 class="text-heading2">Masuk</h1>

      <p v-if="gagal" id="pesan-galat" class="login__alert" role="alert">
        <img :src="asset('icons/ikon-triangle-danger-error.svg')" alt="" width="21" height="21" />
        Email atau password tidak valid
      </p>

      <form class="stack" novalidate @submit.prevent="masuk">
        <div class="field" :class="{ 'field--error': gagal }">
          <AppIcon name="mail" :size="18" />
          <label for="email" class="sr-only">Email</label>
          <input
            id="email"
            ref="emailInput"
            v-model="email"
            type="email"
            name="email"
            placeholder="Masukkan email di sini...."
            autocomplete="email"
            :aria-invalid="gagal"
            :aria-describedby="gagal ? 'pesan-galat' : undefined"
          />
        </div>

        <div class="field" :class="{ 'field--error': gagal }">
          <AppIcon name="key" :size="18" />
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            name="password"
            placeholder="Masukkan password di sini...."
            autocomplete="current-password"
            :aria-invalid="gagal"
            :aria-describedby="gagal ? 'pesan-galat' : undefined"
          />
        </div>

        <button type="submit" class="btn btn--primary" :disabled="!bisaMasuk">Masuk</button>
      </form>

      <p class="login__or"><span>Atau</span></p>

      <div class="login__social">
        <button type="button"><img :src="asset('icons/logo-google.svg')" alt="Masuk dengan Google" width="32" height="32" /></button>
        <button type="button"><img :src="asset('icons/logo-facebook.svg')" alt="Masuk dengan Facebook" width="32" height="32" /></button>
      </div>

      <p class="login__daftar">
        Belum punya akun?
        <RouterLink to="/daftar"><strong>Daftar Sekarang</strong></RouterLink>
      </p>
    </main>
  </div>
</template>

<style scoped>
.login {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-brand);
  color: var(--color-on-brand);
}
.login__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: var(--space-screen-top) 40px 24px;
  text-align: center;
  animation: naik 0.6s ease both;
}
.login__logo img {
  width: 134px;
  height: auto;
}
.login__tagline {
  max-width: 320px;
}
.login__card {
  flex: 1;
  width: 100%;
  max-width: 560px;
  margin: auto auto 0;
  padding: var(--space-field-padding);
  border-radius: var(--radius-16) var(--radius-16) 0 0;
  background: var(--color-bg-screen);
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
  gap: var(--space-field-padding);
  animation: naik 0.7s 0.1s ease both;
}
.login__card h1 {
  text-align: center;
}
.login__alert {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--color-border-error);
  font-size: 14px;
  line-height: 20px;
}
.login__or {
  position: relative;
  text-align: center;
  font-size: 12px;
  line-height: 16px;
}
.login__or::before {
  content: '';
  position: absolute;
  inset: 50% 0 auto;
  height: 2px;
  border-radius: 999px;
  background: var(--color-text-placeholder);
}
.login__or span {
  position: relative;
  padding: 0 8px;
  background: var(--color-bg-screen);
}
.login__social {
  display: flex;
  justify-content: center;
  gap: 16px;
}
.login__social button {
  border: 0;
  padding: 0;
  background: none;
  border-radius: var(--radius-16);
}
.login__daftar {
  text-align: center;
  font-size: 12px;
  line-height: 16px;
  padding-bottom: 16px;
}

/* Layar lebar: panel merek di kiri, formulir di kanan */
@media (min-width: 900px) {
  .login {
    flex-direction: row;
    align-items: stretch;
  }
  .login__hero {
    flex: 1;
    justify-content: center;
    padding: 48px;
  }
  .login__logo img {
    width: 220px;
  }
  .login__card {
    flex: 0 0 480px;
    max-width: none;
    margin: 0;
    justify-content: center;
    padding: 48px;
    border-radius: var(--radius-16) 0 0 var(--radius-16);
  }
}

/* Animasi pembuka */
.intro {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: var(--color-bg-screen);
  animation: intro-keluar 0.4s 1.9s ease forwards;
}
.intro__dot {
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-brand);
  animation: dot-membesar 1s 0.2s cubic-bezier(0.6, 0, 0.2, 1) forwards;
}
.intro__logo {
  position: relative;
  width: 165px;
  opacity: 0;
  animation: logo-muncul 0.5s 1.1s ease forwards;
}
@keyframes dot-membesar {
  to {
    transform: scale(120);
  }
}
@keyframes logo-muncul {
  to {
    opacity: 1;
  }
}
@keyframes intro-keluar {
  to {
    opacity: 0;
    visibility: hidden;
  }
}
@keyframes naik {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
