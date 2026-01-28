// app/components/TaskModal.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateTaskDetails, addSubTask, addComment } from '../actions'
import { format, parseISO } from 'date-fns'
import { SubTask } from './SubTask'
import { Comment } from './Comment'
import { AssetUpload } from './AssetUpload'

type Todo = {
  id: number;
  task_text: string;
  description: string | null;
  due_date: string | null;
  asset_url: string | null;
};

type SubTaskData = { id: number; text: string; is_completed: boolean; };
type CommentData = { id: number; author: string; text: string; created_at: string; };

type TaskModalProps = {
  task: Todo | null;
  onClose: () => void;
  assignees: string[];
}

export function TaskModal({ task: initialTask, onClose, assignees }: TaskModalProps) {
  const [task, setTask] = useState(initialTask);
  const [subtasks, setSubtasks] = useState<SubTaskData[]>([]);
  const [comments, setComments] = useState<CommentData[]>([]);
  
  const detailsFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setTask(initialTask); // Обновляем внутреннее состояние, если пропс изменился
    if (initialTask) {
      const supabase = createClient();
      const fetchRelatedData = async () => {
        const { data: subtasksData } = await supabase.from('sub_tasks').select('*').eq('todo_id', initialTask.id).order('created_at');
        setSubtasks(subtasksData || []);

        const { data: commentsData } = await supabase.from('comments').select('*').eq('todo_id', initialTask.id).order('created_at');
        setComments(commentsData || []);
      };
      fetchRelatedData();
    }
  }, [initialTask]);

  const handleDetailsSubmit = async () => {
    if (detailsFormRef.current) {
        const formData = new FormData(detailsFormRef.current);
        const { data } = await updateTaskDetails(formData);
        if (data) setTask(prev => ({ ...prev!, ...data }));
    }
    onClose();
  }

  const handleAddSubtask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const { data } = await addSubTask(formData);
    if (data) setSubtasks(prev => [...prev, data]);
    form.reset();
  }

  const handleToggleSubtask = (updatedSubtask: SubTaskData) => {
    setSubtasks(prev => prev.map(st => st.id === updatedSubtask.id ? updatedSubtask : st));
  }

  const handleDeleteSubtask = (deletedId: number) => {
    setSubtasks(prev => prev.filter(st => st.id !== deletedId));
  }

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const { data } = await addComment(formData);
    if (data) setComments(prev => [...prev, data]);
    form.reset();
  }

  const onAssetUpdate = (newUrl: string | null) => {
    setTask(prev => ({ ...prev!, asset_url: newUrl }));
  }

  if (!task) return null;

  const formattedDueDate = task.due_date ? format(parseISO(task.due_date), 'yyyy-MM-dd') : '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-start p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl my-8" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b">
            <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800">&times;</button>
            <h2 className="text-2xl font-bold">{task.task_text}</h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <form ref={detailsFormRef} id="details-form">
                    <input type="hidden" name="id" value={task.id} />
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Описание (промпты, ссылки, заметки)</label>
                      <textarea id="description" name="description" defaultValue={task.description || ''} rows={8} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Здесь можно хранить промпты..."/>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">Дедлайн</label>
                      <input type="date" id="due_date" name="due_date" defaultValue={formattedDueDate} className="w-full p-2 border border-gray-300 rounded-md"/>
                    </div>
                </form>
                
                <AssetUpload taskId={task.id} currentAssetUrl={task.asset_url} onAssetUpdate={onAssetUpdate} />

                <div>
                    <h3 className="font-bold mb-2">Чек-лист</h3>
                    <div className="space-y-2 mb-3">
                        {subtasks.map(st => <SubTask key={st.id} subtask={st} onToggle={handleToggleSubtask} onDelete={handleDeleteSubtask} />)}
                    </div>
                    <form onSubmit={handleAddSubtask} className="flex gap-2">
                        <input type="hidden" name="todo_id" value={task.id} />
                        <input type="text" name="text" placeholder="Новая подзадача..." className="flex-grow p-2 border rounded-md" />
                        <button type="submit" className="px-4 bg-gray-200 rounded-md hover:bg-gray-300">Добавить</button>
                    </form>
                </div>
            </div>

            <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg flex flex-col h-full max-h-[70vh]">
                <h3 className="font-bold mb-4">Обсуждение</h3>
                <div className="flex-grow space-y-4 overflow-y-auto mb-4">
                    {comments.map(c => <Comment key={c.id} comment={c} />)}
                </div>
                <form onSubmit={handleAddComment}>
                    <input type="hidden" name="todo_id" value={task.id} />
                    <textarea name="text" placeholder="Написать комментарий..." rows={2} required className="w-full p-2 border rounded-md mb-2"></textarea>
                    <div className="flex justify-between items-center">
                        <select name="author" className="p-2 border rounded-md text-sm">
                            {assignees.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Отправить</button>
                    </div>
                </form>
            </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex justify-end">
             <button type="button" onClick={onClose} className="mr-4 px-4 py-2 rounded-md">Закрыть</button>
             <button type="button" onClick={handleDetailsSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Сохранить и Закрыть</button>
        </div>
      </div>
    </div>
  )
}
