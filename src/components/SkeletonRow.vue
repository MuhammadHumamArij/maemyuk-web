<script setup>

</script>

<template>
  <div class="skel" aria-hidden="true">
    <div class="skel__img"></div>
    <div class="skel__info">
      <span class="skel__bar skel__bar--judul"></span>
      <span class="skel__bar skel__bar--toko"></span>
      <span class="skel__bar skel__bar--harga"></span>
    </div>
    <div class="skel__meta">
      <span class="skel__bar skel__bar--meta"></span>
      <span class="skel__bar skel__bar--meta"></span>
    </div>
  </div>
</template>

<style scoped>
.skel {
  display: grid;
  grid-template-columns: 60px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: start;
  padding: 8px;
  border-radius: var(--radius-16);
  background: var(--color-bg-screen);
  box-shadow: 0 1px 4px rgba(17, 24, 39, 0.18);
}
.skel__img,
.skel__bar {
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: skel-kilau 1.4s ease-in-out infinite;
}
.skel__img {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-8);
}
.skel__info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 2px;
}
.skel__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  padding-top: 2px;
}
.skel__bar {
  display: block;
  height: 12px;
  border-radius: var(--radius-999);
}
.skel__bar--judul { width: 70%; }
.skel__bar--toko { width: 45%; }
.skel__bar--harga { width: 35%; }
.skel__bar--meta { width: 48px; }

@keyframes skel-kilau {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

/* Hormati pengguna yang mematikan animasi di perangkatnya */
@media (prefers-reduced-motion: reduce) {
  .skel__img,
  .skel__bar {
    animation: none;
  }
}
</style>