// app/components/DraggableTaskCard.tsx
'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TaskCardItem } from './TaskCardItem'

// ... (тип Todo остается таким же)
type Todo = {
  id: number;
  task_text: string;
  is_completed: boolean;
  project: string;
  assignee: string;
  status: string;
  description: string | null;
  due_date: string | null;
  asset_url: string | null;
};


type DraggableTaskCardProps = {
  task: Todo;
  statuses: string[];
  onCardClick: (task: Todo) => void;
}

export function DraggableTaskCard({ task, statuses, onCardClick }: DraggableTaskCardProps) {
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
    opacity: isDragging ? 0.5 : 1, // Возвращаем полупрозрачность, это выглядит лучше
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      // УБИРАЕМ слушатели отсюда
    >
      {/* 
        Оборачиваем в div для клика. Этот div НЕ имеет слушателей D&D.
        Клик по нему будет работать всегда.
      */}
      <div onClick={() => onCardClick(task)}>
        {/* 
          Передаем слушатели D&D ({...attributes, ...listeners})
          внутрь TaskCardItem, где они будут повешены только на "ручку".
        */}
        <TaskCardItem task={task} statuses={statuses} dragHandleProps={{...attributes, ...listeners}}/>
      </div>
    </div>
  )
}
