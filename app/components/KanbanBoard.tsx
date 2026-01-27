// app/components/KanbanBoard.tsx
'use client'

import { useState } from 'react'
// ИЗМЕНЕНИЕ 1: Импортируем DragOverlay
import { DndContext, closestCenter, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core'
import { updateTaskStatus } from '../actions'
import { DroppableColumn } from './DroppableColumn'
import { TaskCardItem } from './TaskCardItem' // Импортируем "глупый" компонент для оверлея

type Todo = {
  id: number;
  status: string;
  task_text: string;
  is_completed: boolean;
  project: string;
  assignee: string;
};

type KanbanBoardProps = {
  initialTodos: Todo[];
  statuses: string[];
}

export function KanbanBoard({ initialTodos, statuses }: KanbanBoardProps) {
  const [todos, setTodos] = useState(initialTodos)
  // ИЗМЕНЕНИЕ 2: Создаем состояние для хранения активной (перетаскиваемой) задачи
  const [activeTask, setActiveTask] = useState<Todo | null>(null)

  const groupedTodos = statuses.reduce((acc, status) => {
    acc[status] = todos.filter(todo => todo.status === status)
    return acc
  }, {} as Record<string, Todo[]>)

  // ИЗМЕНЕНИЕ 3: Добавляем обработчик НАЧАЛА перетаскивания
  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const task = todos.find(t => String(t.id) === active.id)
    if (task) {
      setActiveTask(task)
    }
  }
  
  function handleDragEnd(event: DragEndEvent) {
    // ИЗМЕНЕНИЕ 4: Сбрасываем активную задачу в конце
    setActiveTask(null)

    const { active, over } = event
    if (over && active.id !== over.id) {
      const activeId = String(active.id)
      const overId = String(over.id)
      const task = todos.find(t => String(t.id) === activeId)
      const newStatus = overId
      if (task && task.status !== newStatus) {
        setTodos(prev => prev.map(t => String(t.id) === activeId ? { ...t, status: newStatus } : t))
        updateTaskStatus(Number(activeId), newStatus)
      }
    }
  }

  return (
    // ИЗМЕНЕНИЕ 5: Добавляем onDragStart
    <DndContext 
      collisionDetection={closestCenter} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
        {statuses.map(status => (
          <DroppableColumn key={status} id={status} title={status} tasks={groupedTodos[status]} statuses={statuses} />
        ))}
      </main>

      {/* ИЗМЕНЕНИЕ 6: Добавляем сам оверлей */}
      <DragOverlay>
        {activeTask ? (
          <TaskCardItem task={activeTask} statuses={statuses} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
