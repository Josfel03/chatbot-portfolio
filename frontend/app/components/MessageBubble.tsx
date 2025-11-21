
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { User, Bot, Copy } from 'lucide-react';

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const dateObj = new Date(message.timestamp);

  return (
    <div className={`flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isUser ? 'justify-end' : 'justify-start'}`}>
      
      {/* Contenedor flexible alineado al fondo */}
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
        
        {/* Avatar con mejor sombra y borde */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-gray-100 shadow-sm
          ${isUser 
            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' 
            : 'bg-white text-blue-600'}`}>
          {isUser ? <User size={14} /> : <Bot size={18} />}
        </div>

        {/* La Burbuja: Más "Whatsapp", con sombra suave y mejor tipografía */}
        <div className={`relative px-4 py-3 shadow-md text-[15px] leading-relaxed
          ${isUser 
            ? 'bg-[#d9fdd3] text-gray-900 rounded-2xl rounded-tr-sm' // Verde usuario, punta arriba derecha
            : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm'      // Blanco bot, punta arriba izquierda
          }`}>
          
          <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1">
             {isUser ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
             ) : (
                <ReactMarkdown>{message.content}</ReactMarkdown>
             )}
          </div>
          
          {/* Hora pequeña y discreta */}
          <span 
            suppressHydrationWarning={true} 
            className={`text-[10px] block text-right mt-2 font-medium
              ${isUser ? 'text-green-800/60' : 'text-gray-400'}
            `}
          >
            {isNaN(dateObj.getTime()) 
              ? '...' 
              : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          </span>
        </div>
      </div>
    </div>
  );
}