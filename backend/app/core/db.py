# app/core/db.py

import chromadb

# Inicializa ChromaDB con persistencia en disco
client = chromadb.PersistentClient(path="./chroma_db")

# Obtiene (o crea) la colección principal usada en el proyecto
collection = client.get_or_create_collection(name="documentos_demo")

