import { reactive } from 'vue'
import { supabase } from './lib/supabase'

// Status akun yang dipakai seluruh aplikasi.
export const auth = reactive({ user: null, username: '', peran: null })

async function muatProfil(user) {
  if (!user) {
    auth.username = ''
    auth.peran = null
    return
  }
  const { data } = await supabase
    .from('profiles')
    .select('username, peran')
    .eq('id', user.id)
    .maybeSingle()
  auth.username = data?.username ?? user.user_metadata?.username ?? ''
  auth.peran = data?.peran ?? 'pembeli'
}

async function mulaiAuth() {
  try {
    const { data } = await supabase.auth.getSession()
    auth.user = data.session?.user ?? null
    await muatProfil(auth.user)
  } catch {
    auth.user = null
  }
  supabase.auth.onAuthStateChange((_event, session) => {
    auth.user = session?.user ?? null
    // Ditunda agar tidak memanggil Supabase di dalam callback-nya sendiri.
    setTimeout(() => muatProfil(auth.user), 0)
  })
}

// Router menunggu promise ini supaya status login sudah diketahui sebelum halaman dibuka.
export const siapAuth = mulaiAuth()

export async function daftarAkun({ username, email, password, peran }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username, peran } },
  })
  if (error) throw error
  return data
}

export async function masukAkun(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function keluarAkun() {
  await supabase.auth.signOut()
}
