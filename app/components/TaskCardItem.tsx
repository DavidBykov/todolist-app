// app/components/TaskCardItem.tsx
'use client'

import { deleteTodo, toggleTodo, changeStatus } from '../actions'
import { GripVertical } from 'lucide-react' // <-- Импортируем иконку

type Todo = {
  id: number;
  task_text: string;
  is_completed: boolean;
  project: string;
  assignee: string;
  status: string;
};

type TaskCardItemProps = {
  task: Todo;
  statuses: string[];
  // ИЗМЕНЕНИЕ: Получаем слушатели D&D как пропс
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function TaskCardItem({ task, statuses, dragHandleProps }: TaskCardItemProps) {
  return (
    <div className="bg-white p-3 rounded-md shadow touch-none flex gap-2">
      {/* ИЗМЕНЕНИЕ: "Ручка" для перетаскивания */}
      <div {...dragHandleProps} className="cursor-grab touch-none flex items-center text-gray-400">
        <GripVertical size={20} />
      </div>

      {/* Основной контент карточки */}
      <div className="flex-grow">
        <p className={`font-semibold ${task.is_completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.task_text}</p>
        <div className="mt-3 text-xs space-y-1">
          <span className="block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full w-fit">{task.project}</span>
          <span className="block text-gray-600">Отв: <strong>{task.assignee}</strong></span>
        </div>
        
        <form action={changeStatus} className="mt-3">
            <input type="hidden" name="id" value={task.id} />
            <select name="status" defaultValue={task.status} onChange={(e) => e.currentTarget.form?.requestSubmit()} className="w-full p-1 border border-gray-300 rounded-md text-xs">
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </form>
        
        <div className="flex justify-end gap-2 mt-1">
          <form action={toggleTodo}><input type="hidden" name="id" value={task.id}/><input type="hidden" name="is_completed" value={String(task.is_completed)}/><button type="submit">✅</button></form>
          <form action={deleteTodo}><input type="hidden" name="id" value={task.id} /><button type="submit">🗑️</button></form>
        </div>
      </div>
    </div>
  )
}
