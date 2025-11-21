# 1. IMAGEN BASE: Usamos Python 3.11 "Slim" (Versión ligera de Linux, estándar para IA)
FROM python:3.11-slim

# 2. VARIABLES DE ENTORNO: 
# PYTHONDONTWRITEBYTECODE: Evita generar archivos .pyc (basura en contenedores)
# PYTHONUNBUFFERED: Hace que los logs de Python salgan directo a la consola (vital para debug)
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. DIRECTORIO DE TRABAJO: Creamos una carpeta /app dentro del contenedor
WORKDIR /app

# 4. INSTALACIÓN DE DEPENDENCIAS (Capa de Caché):
# Primero copiamos SOLO el requirements.txt. 
# Docker se salta este paso en futuras construcciones. Ahorra mucho tiempo.
COPY requirements.txt .

# Instalamos las librerías
RUN pip install --no-cache-dir -r requirements.txt

# 5. CÓDIGO FUENTE:
# Ahora sí, copiamos todo el código (app/, .env, etc) dentro del contenedor
COPY . .

# 6. PUERTO: Avisamos que la app escucha en el 8000
EXPOSE 8000

# 7. COMANDO DE ARRANQUE:
# Lanzamos Uvicorn.
# --host 0.0.0.0 es OBLIGATORIO en Docker (para que sea accesible desde fuera)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]