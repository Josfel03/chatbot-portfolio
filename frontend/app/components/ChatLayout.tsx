'use client';

import React from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

export default function ChatLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        <ChatArea />
      </main>
    </div>
  );
}
