// app/components/ClientKanbanWrapper.tsx

'use client' // <-- САМОЕ ГЛАВНОЕ: объявляем этот компонент клиентским.

import dynamic from 'next/dynamic'

// Типы для пропсов, которые мы ожидаем от серверной страницы
type Todo = {
  id: number;
  status: string;
  task_text: string;
  is_completed: boolean;
  project: string;
  assignee: string;
};

type ClientKanbanWrapperProps = {
  initialTodos: Todo[];
  statuses: string[];
};

// Динамический импорт KanbanBoard теперь находится здесь, ВНУТРИ клиентского компонента.
const KanbanBoard = dynamic(() => import('./KanbanBoard').then(mod => mod.KanbanBoard), {
  ssr: false, // <-- Здесь эта опция абсолютно легальна!
  loading: () => <p className="text-center p-10">Загрузка канбан-доски...</p>,
});

// Сам компонент-обертка
export function ClientKanbanWrapper({ initialTodos, statuses }: ClientKanbanWrapperProps) {
  // Его единственная задача - отрендерить динамически загруженный KanbanBoard,
  // передав ему все полученные пропсы.
  return <KanbanBoard initialTodos={initialTodos} statuses={statuses} />;
}
