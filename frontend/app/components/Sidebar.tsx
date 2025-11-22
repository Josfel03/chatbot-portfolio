'use client';

import React from 'react';
import { FileText, MessageSquare, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="bg-white border-r h-screen w-64 flex flex-col p-4 shadow">
      <div className="flex items-center gap-2 mb-8">
        <FileText className="text-blue-600" size={28} />
        <span className="text-lg font-bold">RAG Chatbot</span>
      </div>
      
      <nav className="flex flex-col gap-3">
        <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
          <MessageSquare size={18} />
          <span>Nuevo Chat</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
          <FileText size={18} />
          <span>Documentos</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
          <Settings size={18} />
          <span>Configuración</span>
        </button>
      </nav>
      
      <div className="flex-grow"></div>
      
      <div className="pt-4 border-t text-xs text-gray-500">
        Sistema RAG activo
      </div>
    </aside>
  );
}
