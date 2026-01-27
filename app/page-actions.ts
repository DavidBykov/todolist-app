// app/page-actions.ts
'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addTodo(formData: FormData) {
  const supabase = createServerSupabaseClient()
  const newTodo = {
    task_text: formData.get('task') as string,
    project: formData.get('project') as string,
    assignee: formData.get('assignee') as string,
    status: '📥 Бэклог Идей'
  }
  if (!newTodo.task_text) return
  await supabase.from('todos').insert([newTodo])
  revalidatePath('/') // <-- Эта строка КРИТИЧЕСКИ ВАЖНА
}
