// app/components/PinScreen.tsx
'use client'

import { useState, FormEvent } from 'react'

type PinScreenProps = {
  onPinSuccess: () => void;
}

// ВАЖНО: Измените этот PIN на ваш собственный!
const CORRECT_PIN = '6464'

export function PinScreen({ onPinSuccess }: PinScreenProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (pin === CORRECT_PIN) {
      setError('')
      onPinSuccess() // Вызываем функцию родителя при успехе
    } else {
      setError('Неверный PIN-код')
      setPin('')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Введите PIN-код</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password" // Тип password, чтобы цифры скрывались
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={4}
            className="w-full p-4 text-center text-2xl border-2 border-gray-300 rounded-md tracking-[1em]"
            placeholder="••••"
            autoFocus
          />
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  )
}
