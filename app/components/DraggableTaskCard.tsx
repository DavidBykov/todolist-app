// app/components/DraggableTaskCard.tsx
'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TaskCardItem } from './TaskCardItem' // Импортируем наш новый "глупый" компонент

type Todo = {
  id: number;
  task_text: string;
  is_completed: boolean;
  project: string;
  assignee: string;
  status: string;
};

type DraggableTaskCardProps = {
  task: Todo;
  statuses: string[];
}

export function DraggableTaskCard({ task, statuses }: DraggableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(task.id) })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1, // По-прежнему делаем оригинал невидимым
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/* Рендерим наш визуальный компонент */}
      <TaskCardItem task={task} statuses={statuses} />
    </div>
  )
}
