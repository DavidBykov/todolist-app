// app/components/ClientKanbanWrapper.tsx
'use client'

import dynamic from 'next/dynamic'
import { useState, useMemo } from 'react'
import { DragEndEvent } from '@dnd-kit/core' // <-- Импортируем тип
import { updateTaskStatus } from '../actions'  // <-- Импортируем экшен

// Тип Todo остается прежним
type Todo = {
  id: number; status: string; task_text: string; is_completed: boolean; project: string; assignee: string; description: string | null; due_date: string | null; asset_url: string | null;
};

type ClientKanbanWrapperProps = {
  initialTodos: Todo[];
  statuses: string[];
  projects: string[];
  assignees: string[];
};

// Динамический импорт KanbanBoard
const KanbanBoard = dynamic(() => import('./KanbanBoard').then(mod => mod.KanbanBoard), {
  ssr: false,
  loading: () => <p className="text-center p-10">Загрузка канбан-доски...</p>,
});

export function ClientKanbanWrapper({ initialTodos, statuses, projects, assignees }: ClientKanbanWrapperProps) {
  // ИЗМЕНЕНИЕ 1: Теперь здесь "ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ" для задач
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedAssignee, setSelectedAssignee] = useState('all');

  const filteredTodos = useMemo(() => {
    // Фильтрация теперь работает с состоянием 'todos'
    return todos.filter(todo => {
      const matchesSearch = todo.task_text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProject = selectedProject === 'all' || todo.project === selectedProject;
      const matchesAssignee = selectedAssignee === 'all' || todo.assignee === selectedAssignee;
      return matchesSearch && matchesProject && matchesAssignee;
    });
  }, [todos, searchTerm, selectedProject, selectedAssignee]);


  // ИЗМЕНЕНИЕ 2: Логика Drag-and-Drop ПЕРЕЕХАЛА СЮДА
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const activeId = String(active.id)
      const overId = String(over.id)
      const task = todos.find(t => String(t.id) === activeId)
      const newStatus = overId
      if (task && task.status !== newStatus) {
        // Обновляем "ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ"
        setTodos(prev => prev.map(t => String(t.id) === activeId ? { ...t, status: newStatus } : t))
        // Отправляем запрос на сервер в фоне
        updateTaskStatus(Number(activeId), newStatus)
      }
    }
  }

  return (
    <>
      {/* Панель фильтров (без изменений) */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="text" placeholder="Поиск по названию..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md"/>
        <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
          <option value="all">Все проекты</option>
          {projects.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={selectedAssignee} onChange={e => setSelectedAssignee(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
          <option value="all">Все ответственные</option>
          {assignees.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* ИЗМЕНЕНИЕ 3: Передаем в KanbanBoard отфильтрованные данные и обработчик */}
      <KanbanBoard 
        todos={filteredTodos} 
        statuses={statuses}
        onDragEnd={handleDragEnd} // <-- Передаем обработчик
      />
    </>
  )
}
