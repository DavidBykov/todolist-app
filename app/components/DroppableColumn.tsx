// app/components/DroppableColumn.tsx
'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DraggableTaskCard } from './DraggableTaskCard'

// ПРАВИЛЬНОЕ ОПРЕДЕЛЕНИЕ ТИПА
type Todo = {
  id: number;
  task_text: string;
  is_completed: boolean;
  project: string;
  assignee: string;
  status: string;
};

type DroppableColumnProps = {
  id: string;
  title: string;
  tasks: Todo[];
  statuses: string[];
}

export function DroppableColumn({ id, title, tasks, statuses }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div ref={setNodeRef} className="bg-gray-200 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-4 text-gray-700">{title}</h2>
      <SortableContext items={tasks.map(t => String(t.id))} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {tasks.map(task => (
            <DraggableTaskCard key={task.id} task={task} statuses={statuses} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
