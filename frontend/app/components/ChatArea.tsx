'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload } from 'lucide-react';
import { uploadPdf, queryDoc } from '../lib/api';
import MessageBubble from './MessageBubble';
import { Message, UploadResult } from '../types';

export default function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: '¡Hola! Soy tu asistente RAG. Sube un PDF y pregúntame lo que quieras sobre él.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const result = await uploadPdf(file);
      setUploadResult(result);
      setMessages(prev => [...prev, {
        role: 'system',
        content: `✅ PDF cargado: ${result.filename} (${result.pages} páginas)`,
        timestamp: new Date(),
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: '❌ Error al subir el PDF',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await queryDoc(input);
      const botMessage: Message = {
        role: 'bot',
        content: response.answer,
        sources: response.sources,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: '❌ Error al consultar el documento',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white flex items-center justify-between">
        <h1 className="text-xl font-bold">Chat PDF Inteligente</h1>
        <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <Upload size={18} />
          <span>{loading ? 'Subiendo...' : 'Subir PDF'}</span>
          <input
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            className="hidden"
            disabled={loading}
          />
        </label>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, idx) => (
          React.createElement((MessageBubble as any), { key: idx, message: msg })
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Pregunta algo sobre el PDF..."
            disabled={loading || !uploadResult}
          />
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSend}
            disabled={loading || !input.trim() || !uploadResult}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
