// app/actions.ts
'use server' // <-- ДИРЕКТИВА НА ВЕСЬ ФАЙЛ

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Экшены, которые будут вызываться из клиентских компонентов
export async function deleteTodo(formData: FormData) {
  const supabase = createServerSupabaseClient()
  const id = formData.get('id') as string
  if (!id) return
  await supabase.from('todos').delete().match({ id })
  revalidatePath('/')
}

export async function toggleTodo(formData: FormData) {
  const supabase = createServerSupabaseClient()
  const id = formData.get('id') as string
  const is_completed = formData.get('is_completed') === 'true'
  if (!id) return
  await supabase.from('todos').update({ is_completed: !is_completed }).match({ id })
  revalidatePath('/')
}

export async function changeStatus(formData: FormData) {
    const supabase = createServerSupabaseClient()
    const id = formData.get('id') as string
    const status = formData.get('status') as string
    if (!id || !status) return
    await supabase.from('todos').update({ status }).match({ id })
    revalidatePath('/')
}

export async function updateTaskStatus(id: number, status: string) {
    const supabase = createServerSupabaseClient()
    if (!id || !status) return
    await supabase.from('todos').update({ status }).match({ id })
   // revalidatePath('/') // <-- Возвращаем revalidatePath, чтобы D&D тоже обновлял данные для всех
}
