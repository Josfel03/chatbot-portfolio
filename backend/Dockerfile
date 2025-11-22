# Utiliza una imagen oficial de Python como base
FROM python:3.11-slim

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY requirements.txt ./

# Instala las dependencias del proyecto
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copia el código fuente de la app
COPY ./app ./app

# Crea el directorio de persistencia para ChromaDB y uploads
RUN mkdir -p /app/chroma_db /app/uploaded_files

# Expone el puerto por defecto de la app
EXPOSE 8000

# Establece las variables de entorno en producción
ENV PYTHONUNBUFFERED=1
ENV CHROMA_PERSIST_DIR=/app/chroma_db
ENV UPLOADS_DIR=/app/uploaded_files

# Comando para lanzar la aplicación (puedes cambiar workers según necesidad)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
