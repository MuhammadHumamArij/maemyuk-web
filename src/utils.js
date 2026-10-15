// Alamat aset relatif terhadap base Vite, jadi aman di GitHub Pages.
export const asset = (path) => `${import.meta.env.BASE_URL}assets/${path}`

export const rupiah = (n) => (n === 0 ? 'Gratis' : `Rp ${n.toLocaleString('id-ID')}`)

export const jarakText = (m) =>
  m >= 1000 ? `${(m / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} km` : `${m} m`

export const diskon = (p) => Math.round((1 - p.harga / p.hargaAsli) * 100)

export const groupByToko = (lines) => {
  const map = new Map()
  for (const line of lines) {
    const nama = line.product.toko
    if (!map.has(nama)) map.set(nama, [])
    map.get(nama).push(line)
  }
  return [...map].map(([nama, items]) => ({ nama, items }))
}
