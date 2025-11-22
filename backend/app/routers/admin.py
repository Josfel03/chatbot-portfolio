# app/routers/admin.py (o en health.py para pruebas)

from fastapi import APIRouter
from app.core.db import collection

router = APIRouter(prefix="/api/v1", tags=["Admin"])

@router.get("/list_chunks")
async def list_chunks():
    try:
        results = collection.get(ids=None, limit=20)  # 'ids=None' para todos; ajusta limit según uso
        return {
            "ids": results.get("ids", []),
            "documents": results.get("documents", []),
            "metadatas": results.get("metadatas", [])
        }
    except Exception as e:
        return {"error": str(e)}
