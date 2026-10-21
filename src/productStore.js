import { reactive } from 'vue'
import { supabase } from './lib/supabase'

// Catatan 
export const productState = reactive({ items: [], loading: false, error: null })

const ubah = (r) => ({
  id: r.id,
  nama: r.nama,
  toko: r.toko,
  kategori: r.kategori,
  harga: r.harga,
  hargaAsli: r.harga_asli,
  jarak: r.jarak,
  rating: Number(r.rating),
  populer: r.populer,
  gambar: r.gambar,
  alt: r.alt,
  singkat: r.singkat,
  deskripsi: r.deskripsi,
  ulasan: r.ulasan,
})

export async function muatProduk() {
  if (productState.loading) return
  productState.loading = true
  productState.error = null
  try {
    const { data, error } = await supabase.from('products').select('*')
    if (error) throw error
    productState.items = data.map(ubah)
  } catch {
    productState.error = 'Gagal memuat produk. Coba lagi.'
  } finally {
    productState.loading = false
  }
}

export const getProduct = (id) => productState.items.find((p) => p.id === id)