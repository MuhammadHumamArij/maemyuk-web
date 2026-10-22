import { reactive, computed, watch } from 'vue'
import { toko } from './data/products'
import { getProduct } from './productStore'

const CART_KEY = 'maemyuk.cart.v1'
const ORDER_KEY = 'maemyuk.order.v1'
const BIAYA_APLIKASI = 2000
const POTONGAN_VOUCHER = 5000

// Browser storage bisa kosong atau melempar galat (jendela privat, data situs diblokir),
// jadi semua akses dibungkus try/catch dan aplikasi tetap jalan tanpa storage.
const getStorage = (name) => {
  try {
    return window[name]
  } catch {
    return null
  }
}
const read = (storage, key) => {
  try {
    const raw = storage && storage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
const write = (storage, key, value) => {
  try {
    if (!storage) return
    if (value === null) storage.removeItem(key)
    else storage.setItem(key, JSON.stringify(value))
  } catch {
    /* abaikan */
  }
}

const local = getStorage('localStorage')
const session = getStorage('sessionStorage')

// Keranjang kosong tanpa item default
const defaultItems = () => []

const saved = read(local, CART_KEY)
export const cart = reactive({
    items: Array.isArray(saved?.items) ? saved.items : defaultItems(),
  voucher: saved?.voucher ?? true,
})
export const order = reactive({ data: read(session, ORDER_KEY) })

watch(
  () => JSON.stringify(cart),
  () => write(local, CART_KEY, { items: cart.items, voucher: cart.voucher }),
)
watch(
  () => JSON.stringify(order.data),
  () => write(session, ORDER_KEY, order.data),
)

export const lines = computed(() =>
  cart.items.map((i) => ({ ...i, product: getProduct(i.id) })).filter((l) => l.product),
)
export const cartCount = computed(() => cart.items.reduce((s, i) => s + i.qty, 0))
export const selectedLines = computed(() => lines.value.filter((l) => l.selected))

export const summary = computed(() => {
  const sel = selectedLines.value
  const subtotal = sel.reduce((s, l) => s + l.product.harga * l.qty, 0)
  const normal = sel.reduce((s, l) => s + l.product.hargaAsli * l.qty, 0)
  const fee = sel.length ? BIAYA_APLIKASI : 0
  const voucher = cart.voucher && sel.length ? Math.min(POTONGAN_VOUCHER, subtotal + fee) : 0
  const total = subtotal + fee - voucher
  const hemat = normal > 0 ? Math.max(0, Math.round(((normal - total) / normal) * 100)) : 0
  return { subtotal, normal, fee, voucher, total, hemat }
})

const find = (id) => cart.items.find((i) => i.id === id)

export function addToCart(id, qty = 1) {
  const item = find(id)
  if (item) {
    item.qty = Math.min(99, item.qty + qty)
    item.selected = true
  } else {
    cart.items.push({ id, qty, selected: true })
  }
}

export function setQty(id, qty) {
  const item = find(id)
  if (!item) return
  if (qty <= 0) removeItem(id)
  else item.qty = Math.min(99, qty)
}

export function removeItem(id) {
  cart.items = cart.items.filter((i) => i.id !== id)
}

export function toggleSelected(id) {
  const item = find(id)
  if (item) item.selected = !item.selected
}

export function buyNow(id, qty) {
  const item = find(id)
  if (item) item.qty = qty
  else cart.items.push({ id, qty, selected: true })
  cart.items.forEach((i) => (i.selected = i.id === id))
}

const kodeToko = (nama) => {
  let h = 0
  for (const c of nama) h = (h * 31 + c.charCodeAt(0)) % 900
  return `F${100 + h}-TPK-2022`
}

// Menyusun data pesanan tanpa efek samping: keranjang belum dikosongkan.
export function buildOrder({ nama, metode }) {
  const sel = selectedLines.value
  if (!sel.length) return null
  const total = summary.value
  const perToko = new Map()
  for (const l of sel) {
    const t = l.product.toko
    if (!perToko.has(t)) {
      perToko.set(t, {
        nama: t,
        alamat: toko[t]?.alamat ?? '',
        tutup: toko[t]?.tutup ?? '22:00',
        kode: kodeToko(t),
        items: [],
      })
    }
    perToko.get(t).items.push({ nama: l.product.nama, qty: l.qty })
  }
  return { nama, metode, total: total.total, hemat: total.hemat, toko: [...perToko.values()] }
}

// Dipanggil setelah pesanan berhasil terkirim: simpan untuk halaman Konfirmasi, kosongkan keranjang.
export function commitOrder(data) {
  order.data = data
  cart.items = cart.items.filter((i) => !i.selected)
}

// Pembungkus lama, dipertahankan sampai CheckoutView beralih ke buildOrder dan commitOrder.
export function placeOrder(args) {
  const data = buildOrder(args)
  if (!data) return null
  commitOrder(data)
  return data
}