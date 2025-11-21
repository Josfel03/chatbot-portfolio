import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // ¡OJO AQUÍ! Estas rutas son vitales.
    // Le dicen a Tailwind: "Busca clases en estas carpetas"
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tus colores personalizados
        whatsapp: {
          bg: "#efeae2",
          header: "#f0f2f5",
          user: "#d9fdd3",
          bot: "#ffffff",
          accent: "#00a884",
        },
      },
    },
  },
  plugins: [],
};
export default config;