// app/components/DroppableColumn.tsx
'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DraggableTaskCard } from './DraggableTaskCard'

type Todo = {
  id: number;
  task_text: string;
  is_completed: boolean;
  project: string;
  assignee: string;
  status: string;
  // Добавляем остальные поля, чтобы тип был полным
  description: string | null;
  due_date: string | null;
  asset_url: string | null;
};

type DroppableColumnProps = {
  id: string;
  title: string;
  tasks: Todo[];
  statuses: string[];
  onCardClick: (task: Todo) => void;
}

export function DroppableColumn({ id, title, tasks = [], statuses, onCardClick }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div ref={setNodeRef} className="bg-gray-200 rounded-lg p-4 min-h-[150px]">
      <h2 className="font-bold text-lg mb-4 text-gray-700">{title}</h2>
      
      <SortableContext items={tasks.map(t => String(t.id))} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {tasks.map(task => (
            <DraggableTaskCard 
              key={task.id} 
              task={task} 
              statuses={statuses} 
              onCardClick={onCardClick} // <-- ВОТ ЭТА СТРОКА БЫЛА ПРОПУЩЕНА
            />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
