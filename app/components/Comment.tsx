// app/components/Comment.tsx
'use client'

import { format } from 'date-fns'

type CommentProps = {
  comment: {
    author: string;
    text: string;
    created_at: string;
  };
}

export function Comment({ comment }: CommentProps) {
  const isDavid = comment.author === 'Давид'
  return (
    <div className={`flex gap-3 ${isDavid ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-3 rounded-lg max-w-xs ${isDavid ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
        <p className="font-bold">{comment.author}</p>
        <p>{comment.text}</p>
        <p className="text-xs opacity-70 mt-1">{format(new Date(comment.created_at), 'HH:mm')}</p>
      </div>
    </div>
  )
}
