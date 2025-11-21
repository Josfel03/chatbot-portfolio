import React from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

export default function ChatLayout() {
  return (
    // Usamos flex-row para asegurar que estén lado a lado
    <div className="flex flex-row h-screen w-full overflow-hidden bg-gray-100">
      
      {/* CAMBIO CRÍTICO: 
         1. Quitamos 'hidden'.
         2. Fijamos el ancho en 'w-80' (320px) y 'shrink-0' para que no se aplaste.
         3. Agregamos z-20 y sombra para que destaque sobre el chat.
      */}
      <div className="w-80 shrink-0 h-full border-r border-gray-300 bg-white shadow-lg z-20">
        <Sidebar />
      </div>

      {/* El Chat toma el resto del espacio */}
      <div className="flex-1 h-full relative min-w-0">
        <ChatArea />
      </div>
    </div>
  );
}