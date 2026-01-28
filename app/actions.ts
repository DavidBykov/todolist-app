// app/actions.ts
'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// --- ЭКШЕНЫ, КОТОРЫЕ ОБНОВЛЯЮТ ВСЮ ДОСКУ ---

// Вызывается формой добавления на главной странице
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
  revalidatePath('/')
}

// Вызывается из Drag-and-Drop
export async function updateTaskStatus(id: number, status: string) {
  const supabase = createServerSupabaseClient()
  if (!id || !status) return
  await supabase.from('todos').update({ status }).match({ id })
  revalidatePath('/')
}

// Вызывается кнопкой удаления на карточке
export async function deleteTodo(formData: FormData) {
  const supabase = createServerSupabaseClient()
  const id = Number(formData.get('id'))
  if (!id) return
  await supabase.from('todos').delete().match({ id })
  revalidatePath('/')
}

// Вызывается кнопкой "галочки" на карточке
export async function toggleTodo(formData: FormData) {
  const supabase = createServerSupabaseClient()
  const id = Number(formData.get('id'))
  const is_completed = formData.get('is_completed') === 'true'
  if (!id) return
  await supabase.from('todos').update({ is_completed: !is_completed }).match({ id })
  revalidatePath('/')
}

// *** ВОЗВРАЩЕННАЯ ФУНКЦИЯ ***
// Вызывается выпадающим списком статуса на карточке
export async function changeStatus(formData: FormData) {
  const supabase = createServerSupabaseClient()
  const id = Number(formData.get('id'))
  const status = formData.get('status') as string
  if (!id || !status) return
  await supabase.from('todos').update({ status }).match({ id })
  revalidatePath('/')
}


// --- ЭКШЕНЫ, КОТОРЫЕ ВОЗВРАЩАЮТ ДАННЫЕ ДЛЯ МОДАЛЬНОГО ОКНА ---

export async function updateTaskDetails(formData: FormData) {
  const supabase = createServerSupabaseClient()
  const id = Number(formData.get('id'))
  const description = formData.get('description') as string
  const dueDateValue = formData.get('due_date') as string
  const due_date = dueDateValue || null
  if (!id) return { error: 'No ID provided' }
  const { data, error } = await supabase.from('todos').update({ description, due_date }).match({ id }).select().single()
  return { data, error: error?.message }
}

export async function updateTaskAsset(formData: FormData) {
  const supabase = createServerSupabaseClient()
  const id = Number(formData.get('id'))
  const asset_url = formData.get('asset_url') as string
  if (!id) return { error: 'No ID provided' };
  const { data, error } = await supabase.from('todos').update({ asset_url }).match({ id }).select('asset_url').single();
  return { data, error: error?.message };
}

export async function addSubTask(formData: FormData) {
  const supabase = createServerSupabaseClient()
  const todo_id = Number(formData.get('todo_id'))
  const text = formData.get('text') as string
  if (!todo_id || !text) return { error: 'Missing data' }
  const { data, error } = await supabase.from('sub_tasks').insert([{ todo_id, text }]).select().single()
  return { data, error: error?.message }
}

export async function toggleSubTask(formData: FormData) {
  const supabase = createServerSupabaseClient()
  const id = Number(formData.get('id'))
  const is_completed = formData.get('is_completed') === 'true'
  if (!id) return { error: 'No ID provided' }
  const { data, error } = await supabase.from('sub_tasks').update({ is_completed: !is_completed }).match({ id }).select().single()
  return { data, error: error?.message }
}

export async function deleteSubTask(formData: FormData) {
  const supabase = createServerSupabaseClient()
  const id = Number(formData.get('id'))
  if (!id) return { error: 'No ID provided' }
  const { error } = await supabase.from('sub_tasks').delete().match({ id })
  return { deletedId: id, error: error?.message }
}

export async function addComment(formData: FormData) {
  const supabase = createServerSupabaseClient()
  const todo_id = Number(formData.get('todo_id'))
  const text = formData.get('text') as string
  const author = formData.get('author') as string
  if (!todo_id || !text || !author) return { error: 'Missing data' }
  const { data, error } = await supabase.from('comments').insert([{ todo_id, text, author }]).select().single()
  return { data, error: error?.message }
}
