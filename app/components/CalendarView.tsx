// app/components/CalendarView.tsx
'use client'

import { useState, useCallback } from 'react' // <-- ИЗМЕНЕНИЕ 1: Импортируем хуки
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar' // <-- ИЗМЕНЕНИЕ 2: Импортируем View
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import ru from 'date-fns/locale/ru'
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
  // ИЗМЕНЕНИЕ 3: Создаем состояние для даты и вида
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.MONTH);

  // ИЗМЕНЕНИЕ 4: Создаем обработчики, которые будет вызывать календарь
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
      // ИЗМЕНЕНИЕ 5: Передаем наше состояние и обработчики в календарь
      date={date}
      view={view}
      onNavigate={onNavigate}
      onView={onView}
    />
  )
}
