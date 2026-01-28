// app/components/SubTask.tsx
'use client'

import { toggleSubTask, deleteSubTask } from '../actions'

type SubTaskData = { id: number; text: string; is_completed: boolean; };

type SubTaskProps = {
  subtask: SubTaskData;
  onToggle: (updatedSubtask: SubTaskData) => void;
  onDelete: (deletedId: number) => void;
}

export function SubTask({ subtask, onToggle, onDelete }: SubTaskProps) {
  const handleToggle = async () => {
    const formData = new FormData();
    formData.append('id', String(subtask.id));
    formData.append('is_completed', String(subtask.is_completed));
    const { data } = await toggleSubTask(formData);
    if (data) onToggle(data);
  }

  const handleDelete = async () => {
    const formData = new FormData();
    formData.append('id', String(subtask.id));
    const { deletedId } = await deleteSubTask(formData);
    if (deletedId) onDelete(deletedId);
  }

  return (
    <div className="flex items-center gap-3 group">
      <button onClick={handleToggle} className="text-2xl">{subtask.is_completed ? '✅' : '⬜️'}</button>
      <span className={`flex-grow ${subtask.is_completed ? 'line-through text-gray-400' : ''}`}>{subtask.text}</span>
      <button onClick={handleDelete} className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">🗑️</button>
    </div>
  )
}
