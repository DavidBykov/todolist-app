// app/page.tsx

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { addTodo } from './page-actions'
import { ClientKanbanWrapper } from './components/ClientKanbanWrapper'

export const revalidate = 0

// ИЗМЕНЕНИЕ 1: Меняем имя друга
const ASSIGNEES = ['Давид', 'Илья', 'Оба']
const PROJECTS = ['🎬 Производство Контента', '📣 Маркетинг и Продвижение', '🧠 Стратегия и Аналитика', '🛠️ Техническое Обслуживание']
const STATUSES = ['📥 Бэклог Идей', '🎯 К Планированию', '📝 В Работе', '✅ На Утверждение', '🗓️ Запланировано', '🚀 Опубликовано', '📈 Анализ']


export default async function Home() {
  const supabase = createServerSupabaseClient()
  // Возвращаем select('*'), так как эти данные нужны для initialTodos
  const { data: todos } = await supabase.from('todos').select('*').order('created_at', { ascending: true })

  // ИЗМЕНЕНИЕ 2: Создаем уникальный ключ на основе ID всех задач
  const todosKey = todos?.map(t => t.id).join('-') || ''

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        {/* ... остальной код без изменений ... */}
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-center text-gray-800">Фабрика Контента</h1>
        </header>
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
            <form action={addTodo} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="lg:col-span-2">
                    <label htmlFor="task" className="block text-sm font-medium text-gray-700">Новая идея / задача</label>
                    <input type="text" name="task" id="task" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="project" className="block text-sm font-medium text-gray-700">Проект</label>
                    <select name="project" id="project" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                        {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">Ответственный</label>
                    <select name="assignee" id="assignee" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                        {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-blue-700">Добавить в Бэклог</button>
            </form>
        </div>
        <ClientKanbanWrapper 
            key={todosKey} 
            initialTodos={todos || []} 
            statuses={STATUSES}
        />
    </div>
  )
}
