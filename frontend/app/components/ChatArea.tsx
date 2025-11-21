'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, Search, Paperclip, Sparkles } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { Message } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: '¡Hola! 👋 Soy tu **Asistente Documental de IA**.\n\nHe analizado tus PDFs y estoy listo. Pregúntame cosas como:\n- *"¿Cuáles son las cláusulas de rescisión?"*\n- *"Resumen de la página 5"*',
      timestamp: new Date("2024-01-01T09:00:00")
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage.content }),
      });

      if (!res.ok) throw new Error('Error en la respuesta');
      
      const data = await res.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: data.answer,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: '⚠️ **Error de conexión**\nNo pude conectar con el cerebro del servidor. Verifica que el backend esté corriendo.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#efeae2] relative">
      
      {/* Header Premium */}
      <div className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
                <Sparkles size={20} />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 leading-tight">Asistente Corporativo</h3>
            <p className="text-xs text-green-600 font-medium">Conectado a Base de Conocimiento</p>
          </div>
        </div>
        <div className="flex gap-4 text-gray-400">
          <Search size={20} className="cursor-pointer hover:text-gray-600 transition-colors" />
          <MoreVertical size={20} className="cursor-pointer hover:text-gray-600 transition-colors" />
        </div>
      </div>

      {/* Área de Mensajes con Patrón de Fondo */}
      <div className="flex-1 overflow-y-auto p-4 z-0 relative">
        {/* Patrón de fondo sutil (WhatsApp style) */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"></div>
        
        <div className="max-w-4xl mx-auto flex flex-col justify-end min-h-0 relative z-10">
            {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
            ))}
            
            {isLoading && (
            <div className="flex justify-start mb-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
            </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area Flotante */}
      <div className="p-4 bg-[#f0f2f5] z-10">
        <div className="max-w-4xl mx-auto flex items-end gap-2">
            <button className="p-3 text-gray-500 hover:bg-gray-200 rounded-full transition-colors mb-1">
                <Paperclip size={22} />
            </button>
            
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-all overflow-hidden">
                <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Escribe un mensaje a la IA..."
                    className="w-full p-4 border-none focus:ring-0 text-gray-700 placeholder-gray-400 bg-transparent"
                />
            </div>

            <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`p-4 rounded-full text-white shadow-md transition-all transform hover:scale-105 active:scale-95 mb-1 flex items-center justify-center
                ${isLoading || !input.trim() 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-[#00a884] hover:bg-[#008f6f]'}`}
            >
                <Send size={20} className={isLoading ? 'opacity-0' : 'ml-0.5'} />
            </button>
        </div>
        <div className="text-center mt-2">
            <p className="text-[10px] text-gray-400">La IA puede cometer errores. Revisa la información importante.</p>
        </div>
      </div>
    </div>
  );
}