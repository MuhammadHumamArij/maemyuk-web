import { reactive } from 'vue'

// State reaktif: daftar toast yang sedang tampil
export const toasts = reactive([])

const DURASI_MS = 3500 // di antara 3 dan 4 detik
const timers = new Map() // id -> timeout, disimpan di luar state agar state tetap bersih
let idBerikutnya = 1

export function tutupToast(id) {
  clearTimeout(timers.get(id))
  timers.delete(id)
  const i = toasts.findIndex((t) => t.id === id)
  if (i !== -1) toasts.splice(i, 1)
}

export function showToast(pesan, jenis = 'sukses') {
  const id = idBerikutnya++
  toasts.push({
    id,
    pesan,
    jenis: jenis === 'gagal' ? 'gagal' : 'sukses',
  })
  timers.set(id, setTimeout(() => tutupToast(id), DURASI_MS))
  return id
}