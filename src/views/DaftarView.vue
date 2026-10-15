<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '../components/AppIcon.vue'
import { asset } from '../utils'

const router = useRouter()
const form = reactive({ username: '', email: '', password: '', konfirmasi: '', peran: '' })
const dicoba = ref(false)

const galat = computed(() => ({
  username: form.username.trim() === '' ? 'Username wajib diisi' : '',
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? '' : 'Format email belum benar',
  password: form.password.length >= 6 ? '' : 'Password minimal 6 karakter',
  konfirmasi: form.konfirmasi === form.password && form.konfirmasi !== '' ? '' : 'Konfirmasi password tidak sama',
  peran: form.peran ? '' : 'Pilih salah satu',
}))
const valid = computed(() => Object.values(galat.value).every((g) => g === ''))

function daftar() {
  dicoba.value = true
  if (valid.value) router.push('/beranda')
}
</script>

<template>
  <div class="daftar">
    <header class="daftar__hero">
      <RouterLink to="/masuk" class="daftar__back">
        <img :src="asset('icon/ikon-chevron-left.svg')" alt="Kembali ke halaman masuk" width="15" height="26" />
      </RouterLink>
      <RouterLink to="/beranda">
        <img :src="asset('icon/white-logo-maemyuk.svg')" alt="MaemYuk, ke beranda" width="134" height="133" class="daftar__logo" />
      </RouterLink>
      <p class="text-heading1">Selamat datang di MaemYuk</p>
    </header>

    <main class="daftar__card">
      <h1 class="text-heading2">Buat Akun</h1>
      <p class="muted daftar__sub">Daftar untuk menemukan makanan hemat di sekitarmu</p>

      <form class="stack" novalidate @submit.prevent="daftar">
        <div>
          <label for="username" class="label">Username:</label>
          <div class="field" :class="{ 'field--error': dicoba && galat.username }">
            <AppIcon name="user" :size="18" />
            <input id="username" v-model="form.username" type="text" name="username" placeholder="Username" autocomplete="username" />
          </div>
          <p v-if="dicoba && galat.username" class="error-text" role="alert">{{ galat.username }}</p>
        </div>

        <div>
          <label for="email" class="label">Email:</label>
          <div class="field" :class="{ 'field--error': dicoba && galat.email }">
            <AppIcon name="mail" :size="18" />
            <input id="email" v-model="form.email" type="email" name="email" placeholder="Email" autocomplete="email" />
          </div>
          <p v-if="dicoba && galat.email" class="error-text" role="alert">{{ galat.email }}</p>
        </div>

        <div>
          <label for="password" class="label">Password:</label>
          <div class="field" :class="{ 'field--error': dicoba && galat.password }">
            <AppIcon name="key" :size="18" />
            <input id="password" v-model="form.password" type="password" name="password" placeholder="Password" autocomplete="new-password" />
          </div>
          <p v-if="dicoba && galat.password" class="error-text" role="alert">{{ galat.password }}</p>
        </div>

        <div>
          <label for="konfirmasi" class="label">Konfirmasi password:</label>
          <div class="field" :class="{ 'field--error': dicoba && galat.konfirmasi }">
            <AppIcon name="key" :size="18" />
            <input id="konfirmasi" v-model="form.konfirmasi" type="password" name="konfirmasi" placeholder="Konfirmasi password" autocomplete="new-password" />
          </div>
          <p v-if="dicoba && galat.konfirmasi" class="error-text" role="alert">{{ galat.konfirmasi }}</p>
        </div>

        <fieldset class="daftar__peran">
          <legend class="label">Daftar sebagai:</legend>
          <div class="daftar__pilihan">
            <label class="pilihan" :class="{ 'pilihan--aktif': form.peran === 'pembeli' }">
              <input v-model="form.peran" class="check check--radio" type="radio" name="peran" value="pembeli" />
              Pembeli
            </label>
            <label class="pilihan" :class="{ 'pilihan--aktif': form.peran === 'penjual' }">
              <input v-model="form.peran" class="check check--radio" type="radio" name="peran" value="penjual" />
              Penjual
            </label>
          </div>
          <p v-if="dicoba && galat.peran" class="error-text" role="alert">{{ galat.peran }}</p>
        </fieldset>

        <button type="submit" class="btn btn--primary">Daftar</button>
      </form>

      <p class="daftar__atau"><span>Atau</span></p>
      <div class="daftar__social">
        <button type="button"><img :src="asset('icon/ikon-google.svg')" alt="Daftar dengan Google" width="32" height="32" /></button>
        <button type="button"><img :src="asset('icon/ikon-facebook.svg')" alt="Daftar dengan Facebook" width="32" height="32" /></button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.daftar {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-brand);
  color: var(--color-on-brand);
}
.daftar__hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px 40px 32px;
  text-align: center;
}
.daftar__back {
  position: absolute;
  left: 24px;
  top: 24px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 44px;
  filter: brightness(0) invert(1);
}
.daftar__logo {
  width: 134px;
  height: auto;
}
.daftar__card {
  flex: 1;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  padding: var(--space-field-padding);
  border-radius: var(--radius-16) var(--radius-16) 0 0;
  background: var(--color-bg-screen);
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
  gap: var(--space-field-padding);
}
.daftar__card h1,
.daftar__sub {
  text-align: center;
}
.stack {
  gap: 12px;
}
.daftar__peran {
  border: 0;
  margin: 0;
  padding: 0;
}
.daftar__pilihan {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.pilihan {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 65px;
  border: 2px solid var(--color-border-input);
  border-radius: var(--radius-16);
  cursor: pointer;
  font-weight: 600;
}
.pilihan--aktif {
  border-color: var(--color-brand);
  color: var(--color-brand);
}
.daftar__atau {
  position: relative;
  text-align: center;
  font-size: 12px;
}
.daftar__atau::before {
  content: '';
  position: absolute;
  inset: 50% 0 auto;
  height: 2px;
  border-radius: 999px;
  background: var(--color-text-placeholder);
}
.daftar__atau span {
  position: relative;
  padding: 0 8px;
  background: var(--color-bg-screen);
}
.daftar__social {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-bottom: 16px;
}
.daftar__social button {
  border: 0;
  padding: 0;
  background: none;
}
</style>
