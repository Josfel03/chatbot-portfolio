# app/services/rag_service.py

from app.services.openai_service import get_embeddings
from chromadb.api.models.Collection import Collection

def chunk_document(text: str, chunk_size: int = 500) -> list[str]:
    """Divide el texto en chunks para vectorización"""
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

def add_document_to_chromadb(collection, document: str, doc_id: str):
    chunks = chunk_document(document)
    vectors = get_embeddings(chunks)
    # Crea listas de ids, metadatas y documents para todos los chunks
    ids = [f"{doc_id}_{idx}" for idx in range(len(chunks))]
    metadatas = [{"page": idx} for idx in range(len(chunks))]
    documents = chunks  # La lista de textos de cada chunk
    
    collection.add(
        embeddings=vectors,
        ids=ids,
        metadatas=metadatas,
        documents=documents  # Aquí envía los textos de cada chunk
    )

def query_document(collection: Collection, query: str, top_k: int = 3):
    """
    Vectoriza la consulta, busca los chunks más relevantes y los devuelve.
    """
    query_vec = get_embeddings([query])[0]
    results = collection.query(
        query_embeddings=[query_vec],
        n_results=top_k
    )
    return results
