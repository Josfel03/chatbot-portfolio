# app/routers/health.py

from fastapi import APIRouter
import chromadb
import openai
from app.core.config import settings

router = APIRouter(prefix="/api/v1", tags=["Health"])

@router.get("/health")
async def health_check():
    # Chequeo de ChromaDB
    try:
        client = chromadb.Client()
        # Intenta listar colecciones como prueba de conectividad
        collections = client.list_collections()
        chroma_status = "ok"
    except Exception as e:
        chroma_status = f"error: {str(e)}"

    # Chequeo de OpenAI API
    try:
        client_ai = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        # Intenta listar modelos como prueba de conexión
        models = client_ai.models.list()
        openai_status = "ok"
    except Exception as e:
        openai_status = f"error: {str(e)}"

    return {
        "status": "ok",
        "chroma": chroma_status,
        "openai": openai_status
    }
