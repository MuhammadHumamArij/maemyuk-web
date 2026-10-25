
import { supabase } from './lib/supabase'

export async function kirimPesanan(order) {
  const { error } = await supabase
    .from('orders')
    .insert({
      nama_penerima: order.nama,
      metode: order.metode,
      total: order.total,
      hemat: order.hemat,
      toko: order.toko,
    })

  if (error) {
    throw error
  }
}
