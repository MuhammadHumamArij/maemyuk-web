<script setup>
import { toasts, tutupToast } from '../toast.js'
</script>

<template>
  <!-- Wadah ini selalu ada di DOM agar pembaca layar mengumumkan toast yang masuk -->
  <div class="toast-region" role="status" aria-live="polite" aria-atomic="false">
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast"
        :class="`toast--${t.jenis}`"
      >
        <span class="toast__pesan">{{ t.pesan }}</span>
        <button
          type="button"
          class="toast__tutup"
          aria-label="Tutup notifikasi"
          @click="tutupToast(t.id)"
        >
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-region {
  position: fixed;
  top: 0.75rem; /* di atas, supaya tidak menutupi tombol Bayar di bagian bawah */
  left: 50%;
  transform: translateX(-50%);
  width: min(28rem, calc(100% - 1.5rem)); /* di 360px: sisa 12px kiri-kanan */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1000;
  pointer-events: none; /* area kosong tidak menghalangi klik */
}

.toast {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.2);
  font-size: 0.9375rem;
  line-height: 1.4;
}

.toast--sukses {
  background: var(--color-success-bg, #1b7f3b);
  color: var(--color-success-text, #fff);
}

.toast--gagal {
  background: var(--color-danger-bg, #b3261e);
  color: var(--color-danger-text, #fff);
}

.toast__pesan {
  overflow-wrap: anywhere;
}

.toast__tutup {
  flex: none;
  min-width: 2rem;
  min-height: 2rem;
  background: transparent;
  border: 0;
  color: inherit;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
}

.toast__tutup:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active {
    transition: none;
  }
}
</style>