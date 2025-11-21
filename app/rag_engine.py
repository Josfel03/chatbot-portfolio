import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

# 1. Cargar secretos (El Guardia de Seguridad)
# Esto busca el archivo .env y carga la API KEY
load_dotenv()

# Verificación rápida (Solo para nosotros, borrar en producción)
if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("¡ERROR! No se encontró la API Key de OpenAI. Revisa tu archivo .env")

# Configuración de directorios para la base de datos
# Esto creará una carpeta 'chroma_db' en tu proyecto para guardar los vectores
PERSIST_DIRECTORY = "./chroma_db"

def procesar_y_guardar_documento(ruta_pdf):
    """
    Esta función es el 'Digestor':
    1. Lee el PDF.
    2. Lo parte en trocitos (chunks).
    3. Lo convierte en números (vectores).
    4. Lo guarda en ChromaDB.
    """
    print(f"--- Procesando documento: {ruta_pdf} ---")
    
    # PASO A: Cargar el PDF
    loader = PyPDFLoader(ruta_pdf)
    documentos = loader.load()
    print(f"1. Documento cargado. Páginas: {len(documentos)}")

    # PASO B: Dividir en Chunks (Trozos)
    # ¿Por qué? Porque la IA no puede leer un libro entero de golpe.
    # Necesita párrafos pequeños para encontrar la información exacta.
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,  # Tamaño de cada trozo (caracteres)
        chunk_overlap=200 # Solapamiento (para no cortar frases a la mitad)
    )
    chunks = text_splitter.split_documents(documentos)
    print(f"2. Documento dividido en {len(chunks)} trozos (chunks).")

    # PASO C: Embeddings y Guardado (La Magia)
    # Aquí convertimos texto a vectores y lo guardamos.
    print("3. Creando base de datos vectorial (esto puede tardar un poco)...")
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=OpenAIEmbeddings(), # Usamos OpenAI para convertir texto a números
        persist_directory=PERSIST_DIRECTORY
    )
    print("--- ¡Éxito! Documento vectorizado y guardado en ChromaDB ---")
    return True

# Bloque de prueba (Solo se ejecuta si corres este archivo directamente)
if __name__ == "__main__":
    # Necesitamos un PDF de prueba. 
    # Asegúrate de tener un archivo llamado 'manual.pdf' en la raíz o cambia la ruta.
    ruta_prueba = "manual.pdf" 
    
    if os.path.exists(ruta_prueba):
        procesar_y_guardar_documento(ruta_prueba)
    else:
        print(f"No encontré el archivo {ruta_prueba} para probar. Coloca un PDF ahí.")