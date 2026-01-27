// app/components/TaskCard.tsx

'use client' // <-- САМАЯ ВАЖНАЯ СТРОЧКА! Объявляем это Клиентским Компонентом.

import { changeStatus, deleteTodo, toggleTodo } from '@/app/actions'

// Определяем, какие данные (props) ожидает наша карточка
type TaskCardProps = {
  todo: {
    id: number;
    task_text: string;
    is_completed: boolean;
    project: string;
    assignee: string;
    status: string;
  };
  statuses: string[];
}

export function TaskCard({ todo, statuses }: TaskCardProps) {
  return (
    <div className="bg-white p-3 rounded-md shadow">
      <p className={`font-semibold ${todo.is_completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{todo.task_text}</p>
      <div className="mt-3 text-xs space-y-1">
        <span className="block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full w-fit">{todo.project}</span>
        <span className="block text-gray-600">Отв: <strong>{todo.assignee}</strong></span>
      </div>

      {/* Форма для смены статуса (теперь она работает, т.к. находится в клиентском компоненте) */}
      <form action={changeStatus} className="mt-3">
        <input type="hidden" name="id" value={todo.id} />
        <select
          name="status"
          defaultValue={todo.status}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className="w-full p-1 border border-gray-300 rounded-md text-xs"
        >
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </form>
      
      <div className="flex justify-end gap-2 mt-3">
        <form action={toggleTodo}><input type="hidden" name="id" value={todo.id}/><input type="hidden" name="is_completed" value={String(todo.is_completed)}/><button type="submit">✅</button></form>
        <form action={deleteTodo}><input type="hidden" name="id" value={todo.id} /><button type="submit">🗑️</button></form>
      </div>
    </div>
  )
}
