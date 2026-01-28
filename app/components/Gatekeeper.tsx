// app/components/Gatekeeper.tsx
'use client'

import { useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { PinScreen } from './PinScreen'

type GatekeeperProps = {
  children: ReactNode; // Здесь будет наше основное приложение
}

const AUTH_COOKIE_NAME = 'kanban-auth-token'; // Название нашего "пропуска"

export function Gatekeeper({ children }: GatekeeperProps) {
  // Состояние, которое определяет, прошел ли пользователь проверку
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // При первой загрузке компонента проверяем, есть ли "пропуск" в cookies
  useEffect(() => {
    const token = Cookies.get(AUTH_COOKIE_NAME)
    if (token === 'true') { // Проверяем, что токен правильный
      setIsAuthenticated(true)
    }
  }, [])

  // Функция, которая вызывается при успешном вводе PIN-кода
  const handlePinSuccess = () => {
    setIsAuthenticated(true)
    // Устанавливаем "пропуск" в cookies на 7 дней
    Cookies.set(AUTH_COOKIE_NAME, 'true', { expires: 7 })
  }

  // Если пользователь не аутентифицирован, показываем ему экран с PIN-кодом
  if (!isAuthenticated) {
    return <PinScreen onPinSuccess={handlePinSuccess} />
  }

  // Если все в порядке, показываем основное приложение
  return <>{children}</>
}
