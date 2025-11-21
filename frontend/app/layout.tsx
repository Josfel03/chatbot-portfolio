
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <--- ¡ESTA LÍNEA ES LA CLAVE!

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chatbot RAG",
  description: "Asistente Inteligente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* Aplicamos la fuente Inter a todo el body */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}