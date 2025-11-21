
'use client';

import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Sidebar() {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    setFileName(file.name);
    setUploadStatus('uploading');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/upload-pdf/`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Error al subir');
      
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 4000); 
    } catch (error) {
      console.error(error);
      setUploadStatus('error');
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col font-sans">
      {/* Header Sidebar */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center px-5 justify-between shadow-sm shrink-0">
        <h2 className="font-bold text-gray-700 tracking-tight">Biblioteca</h2>
        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold border border-green-200">
            <ShieldCheck size={12} />
            <span>RAG ACTIVO</span>
        </div>
      </div>

      {/* Área de Carga */}
      <div className="p-5 shrink-0">
        <label className="group flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-blue-200 rounded-xl cursor-pointer bg-white hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-full mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud size={24} />
            </div>
            <p className="text-sm text-gray-600 font-medium group-hover:text-blue-600">
              Arrastra o click para subir PDF
            </p>
            <p className="text-xs text-gray-400 mt-1">Soporta archivos de hasta 10MB</p>
          </div>
          <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
        </label>

        {/* Notificación de Estado */}
        {uploadStatus !== 'idle' && (
          <div className={`mt-4 p-3 rounded-lg border flex items-start gap-3 text-sm shadow-sm animate-in fade-in slide-in-from-top-2
            ${uploadStatus === 'uploading' ? 'bg-blue-50 border-blue-100 text-blue-700' : ''}
            ${uploadStatus === 'success' ? 'bg-green-50 border-green-100 text-green-700' : ''}
            ${uploadStatus === 'error' ? 'bg-red-50 border-red-100 text-red-700' : ''}
          `}>
            {uploadStatus === 'uploading' && <Loader2 className="animate-spin w-5 h-5 shrink-0" />}
            {uploadStatus === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
            {uploadStatus === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold">
                {uploadStatus === 'uploading' && 'Procesando documento...'}
                {uploadStatus === 'success' && '¡Listo! Conocimiento actualizado.'}
                {uploadStatus === 'error' && 'Error al procesar.'}
              </p>
              {fileName && <p className="text-xs opacity-80 truncate mt-0.5">{fileName}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Lista de Archivos */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="text-xs font-bold text-gray-400 px-3 mb-3 uppercase tracking-wider">
            Documentos Indexados
        </div>
        
        {/* Ejemplo de item de archivo */}
        <div className="group flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all cursor-pointer">
            <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                <FileText size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-700 truncate group-hover:text-gray-900">manual_operaciones.pdf</h4>
                <p className="text-[10px] text-gray-400">Subido hoy • 2.4 MB</p>
            </div>
        </div>

        {/* Item 2 (Simulado) */}
        <div className="group flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all cursor-pointer mt-1">
            <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                <FileText size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-700 truncate group-hover:text-gray-900">poliza_seguros_2024.pdf</h4>
                <p className="text-[10px] text-gray-400">Subido ayer • 1.1 MB</p>
            </div>
        </div>
      </div>
    </div>
  );
}