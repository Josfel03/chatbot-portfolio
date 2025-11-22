
from fastapi import APIRouter, HTTPException
from app.schemas.models import QueryRequest, QueryResponse
from app.services.rag_service import query_document
from app.services.openai_service import get_llm_response
from app.core.db import collection  # Ya inicializado con persistencia

router = APIRouter(prefix="/api/v1", tags=["Query"])

@router.post("/query/", response_model=QueryResponse)
async def query_rag(request: QueryRequest):
    try:
        results = query_document(collection, request.question)
        context_chunks = [doc[0] for doc in results.get("documents", []) if doc and doc[0]]
        context = " ".join(context_chunks)
        if not context.strip():
            raise HTTPException(status_code=404, detail="No se encontraron fragmentos relevantes para la consulta.")
        answer = get_llm_response(request.question, context)
        sources = results.get("metadatas", [])
        # ---- Aplanado, para cualquier estructura ----
        if sources and isinstance(sources[0], list):
            sources = [item for sublist in sources for item in sublist]
        return QueryResponse(answer=answer, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en consulta RAG: {str(e)}")
