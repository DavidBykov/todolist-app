// app/components/AssetUpload.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateTaskAsset } from '../actions'

type AssetUploadProps = {
  taskId: number;
  currentAssetUrl: string | null;
  onAssetUpdate: (newUrl: string | null) => void;
}

export function AssetUpload({ taskId, currentAssetUrl, onAssetUpdate }: AssetUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError('')

    const supabase = createClient()
    // Создаем уникальное имя файла, чтобы избежать конфликтов
    const filePath = `public/${taskId}-${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('task-assets')
      .upload(filePath, file)

    if (uploadError) {
      setError('Ошибка загрузки файла: ' + uploadError.message)
      setIsUploading(false)
      return
    }

    // Получаем публичную ссылку на только что загруженный файл
    const { data: { publicUrl } } = supabase.storage
      .from('task-assets')
      .getPublicUrl(filePath)
    
    // 1. Мгновенно обновляем UI через коллбэк
    onAssetUpdate(publicUrl)
    
    // 2. В фоне сохраняем ссылку в базу данных
    const formData = new FormData()
    formData.append('id', String(taskId))
    formData.append('asset_url', publicUrl)
    await updateTaskAsset(formData)

    setIsUploading(false)
  }

  return (
    <div>
      <h3 className="font-bold mb-2">Ассет</h3>
      {currentAssetUrl && (
        <div className="mb-4">
          <img src={currentAssetUrl} alt="Загруженный ассет" className="max-w-full rounded-md max-h-60" />
        </div>
      )}
      
      <label htmlFor={`asset-upload-${taskId}`} className="cursor-pointer bg-gray-200 px-4 py-2 rounded-md text-sm hover:bg-gray-300">
        {isUploading ? 'Загрузка...' : 'Загрузить/Заменить файл'}
      </label>
      <input
        id={`asset-upload-${taskId}`}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}
