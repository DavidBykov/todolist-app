// app/components/CalendarView.tsx
'use client'

import { useState, useCallback } from 'react'
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar'

// --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
// Импортируем все функции как именованные из основного пакета date-fns
import { format, parse, startOfWeek, getDay } from 'date-fns' 
import { ru } from 'date-fns/locale' // Импортируем локаль отдельно

import 'react-big-calendar/lib/css/react-big-calendar.css'

// Настройка локализации (без изменений)
const locales = {
  'ru': ru,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

// Тип для событий (без изменений)
type Event = {
  id: number;
  title: string;
  start: Date;
  end: Date;
}

type CalendarViewProps = {
  events: Event[];
}

export function CalendarView({ events }: CalendarViewProps) {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.MONTH);

  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate]);
  const onView = useCallback((newView: View) => setView(newView), [setView]);

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      culture='ru'
      messages={{
        next: "След.",
        previous: "Пред.",
        today: "Сегодня",
        month: "Месяц",
        week: "Неделя",
        day: "День",
        agenda: "Повестка"
      }}
      date={date}
      view={view}
      onNavigate={onNavigate}
      onView={onView}
    />
  )
}
