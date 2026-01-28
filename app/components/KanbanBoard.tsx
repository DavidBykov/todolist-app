// app/components/KanbanBoard.tsx
'use client'

import { useState } from 'react'
import { DndContext, closestCenter, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core'
import { DroppableColumn } from './DroppableColumn'
import { TaskCardItem } from './TaskCardItem'
import { TaskModal } from './TaskModal'

// Тип Todo остается прежним
type Todo = {
  id: number; status: string; task_text: string; is_completed: boolean; project: string; assignee: string; description: string | null; due_date: string | null; asset_url: string | null;
};

// ИЗМЕНЕНИЕ 1: Пропсы теперь включают onDragEnd и новый 'todos'
type KanbanBoardProps = {
  todos: Todo[]; // <-- Теперь это не initialTodos, а просто todos
  statuses: string[];
  onDragEnd: (event: DragEndEvent) => void; // <-- Получаем обработчик от родителя
}

export function KanbanBoard({ todos, statuses, onDragEnd }: KanbanBoardProps) {
  // ИЗМЕНЕНИЕ 2: Внутреннее состояние 'todos' и 'setTodos' ПОЛНОСТЬЮ УДАЛЕНО
  
  const [activeTask, setActiveTask] = useState<Todo | null>(null)
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null)

  // ИЗМЕНЕНИЕ 3: Группировка теперь использует 'todos' из пропсов
  const groupedTodos = statuses.reduce((acc, status) => {
    acc[status] = todos.filter(todo => todo.status === status) // <-- Используем пропс
    return acc
  }, {} as Record<string, Todo[]>)

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const task = todos.find(t => String(t.id) === active.id) // <-- Ищем в пропсах
    if (task) {
      setActiveTask(task)
    }
  }
  
  // ИЗМЕНЕНИЕ 4: handleDragEnd ПОЛНОСТЬЮ УДАЛЕН. Мы используем тот, что пришел в пропсах.

  const openModal = (task: Todo) => { setSelectedTask(task) }
  const closeModal = () => { setSelectedTask(null) }

  return (
    <>
      {/* ИЗМЕНЕНИЕ 5: onDragEnd теперь берется из пропсов */}
      <DndContext 
        collisionDetection={closestCenter} 
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd} // <-- Используем обработчик от родителя
      >
        <main className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
          {statuses.map(status => (
            <DroppableColumn 
              key={status} 
              id={status} 
              title={status} 
              tasks={groupedTodos[status] || []} // Добавил || [] для надежности
              statuses={statuses}
              onCardClick={openModal}
            />
          ))}
        </main>
        <DragOverlay>
          {activeTask ? (<TaskCardItem task={activeTask} statuses={statuses} />) : null}
        </DragOverlay>
      </DndContext>
      <TaskModal 
        task={selectedTask} 
        onClose={closeModal} 
        assignees={['Давид', 'Илья', 'Оба']}
      />
    </>
  )
}
