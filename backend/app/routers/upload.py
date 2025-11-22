# app/routers/upload.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.pdf_service import validate_pdf, extract_text_from_pdf
from app.services.rag_service import add_document_to_chromadb
from app.schemas.models import PDFUploadResponse
import chromadb
import uuid

router = APIRouter(prefix="/api/v1", tags=["Upload"])

@router.post("/upload_pdf/", response_model=PDFUploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    if not validate_pdf(file):
        raise HTTPException(
            status_code=400,
            detail="Solo se aceptan archivos PDF válidos y menores a 10MB."
        )
    try:
        text = extract_text_from_pdf(file)
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Error al procesar el PDF: {str(e)}"
        )

    # Cambia aquí: usa PersistentClient y define el path de persistencia
    client = chromadb.PersistentClient(path="./chroma_db")
    collection = client.get_or_create_collection(name="documentos_demo")

    doc_id = str(uuid.uuid4())
    add_document_to_chromadb(collection, text, doc_id)

    num_chunks = len(text) // 500 if text else 0
    return PDFUploadResponse(
        document_id=doc_id,
        filename=file.filename,
        pages=num_chunks,
        status="indexed"
    )
