'use client';

import React from 'react';
import { Message } from '../types';
import { User, Bot, Info } from 'lucide-react';

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-2xl flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-blue-600' : isSystem ? 'bg-yellow-500' : 'bg-gray-700'
        }`}>
          {isUser ? <User size={16} className="text-white" /> : 
           isSystem ? <Info size={16} className="text-white" /> :
           <Bot size={16} className="text-white" />}
        </div>

        {/* Content */}
        <div className={`px-4 py-2 rounded-lg ${
          isUser ? 'bg-blue-600 text-white' :
          isSystem ? 'bg-yellow-100 text-gray-900' :
          'bg-white text-gray-900 border'
        }`}>
          <p className="whitespace-pre-line">{message.content}</p>
          
          {message.sources && message.sources.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs font-semibold mb-1">Fuentes:</p>
              <ul className="text-xs space-y-1">
                {message.sources.map((src, idx) => (
                  <li key={idx}>📄 Página {src.page}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
