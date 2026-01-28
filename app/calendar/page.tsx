// app/calendar/page.tsx
import { createServerSupabaseClient } from "@/lib/supabase/server";
// ИСПОЛЬЗУЕМ ОТНОСИТЕЛЬНЫЙ ПУТЬ
import { CalendarView } from "../components/CalendarView";

export default async function CalendarPage() {
  const supabase = createServerSupabaseClient();

  const { data: todos } = await supabase
    .from('todos')
    .select('id, task_text, due_date')
    .not('due_date', 'is', null);

  const events = todos?.map(todo => ({
    id: todo.id,
    title: todo.task_text,
    start: new Date(todo.due_date),
    end: new Date(todo.due_date),
  })) || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Календарь Контента</h1>
        <div className="h-[calc(100vh-220px)] bg-white p-4 rounded-lg shadow">
          <CalendarView events={events} />
        </div>
    </div>
  );
}
