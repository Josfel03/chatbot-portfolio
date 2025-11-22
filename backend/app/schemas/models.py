from pydantic import BaseModel

class PDFUploadResponse(BaseModel):
    document_id: str
    filename: str
    pages: int
    status: str = "indexed"

    class Config:
        json_schema_extra = {
            "example": {
                "document_id": "123e4567...",
                "filename": "manual.pdf",
                "pages": 32,
                "status": "indexed"
            }
        }

class QueryRequest(BaseModel):
    question: str


class QueryResponse(BaseModel):
    answer: str
    sources: list[dict]   # Esto acepta metadatos por chunk (lo que devuelve ChromaDB)
