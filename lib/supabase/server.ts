import { createClient } from '@supabase/supabase-js'

// Этот клиент предназначен ТОЛЬКО для операций на сервере.
// Он напрямую читает "секретные" переменные.
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
