<script setup>
// Ikon kecil yang digambar inline supaya warnanya mengikuti currentColor.
// Ikon logo dan navigasi tetap memakai berkas SVG dari folder assets/icon.
defineProps({ name: { type: String, required: true }, size: { type: Number, default: 16 } })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path v-if="name === 'mail'" d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.2L4.4 7H19.6L12 12.2Zm0 2L4 8.7V17h16V8.7l-8 5.5Z" />
    <path v-else-if="name === 'key'" d="M7 14a4 4 0 1 1 3.9-5H22v3h-2v3h-3v-3h-6.1A4 4 0 0 1 7 14Zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
    <path v-else-if="name === 'user'" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.2-8 5v3h16v-3c0-2.8-3.6-5-8-5Z" />
    <path v-else-if="name === 'search'" d="M10 2a8 8 0 1 0 4.9 14.3l5 5 1.4-1.4-5-5A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" />
    <path v-else-if="name === 'pin'" d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
    <path v-else-if="name === 'star'" d="m12 2 3 6.5 7 .9-5.2 4.8 1.4 7L12 17.8 5.8 21.2l1.4-7L2 9.4l7-.9L12 2Z" />
    <path v-else-if="name === 'plus'" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
    <path v-else-if="name === 'minus'" d="M5 11h14v2H5v-2Z" />
    <path v-else-if="name === 'trash'" d="M9 3h6l1 2h5v2H3V5h5l1-2Zm-3 6h12l-1 12H7L6 9Z" />
    <path v-else-if="name === 'chevron-right'" d="m9 5 7 7-7 7-1.4-1.4L13.2 12 7.6 6.4 9 5Z" />
  </svg>
</template>
