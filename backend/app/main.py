# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import upload, query, health, admin
from app.core.config import settings
from app.core.logger import logger

app = FastAPI(
    title="Enterprise RAG Chatbot API",
    version="1.0.0",
    description="API de análisis de documentos con RAG, ChromaDB y OpenAI."
)

# CORS seguro: solo tu frontend o dominios de demo permitidos
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://tudominio.demo"],  # <--- reemplaza por tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middlewares opcionales: logging estructurado global
@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Recibida: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Respondida: {response.status_code} {request.url}")
    return response

# Incluye todos tus routers/endpoints
app.include_router(upload.router)
app.include_router(query.router)
app.include_router(health.router)
app.include_router(admin.router)
# Endpoint base informativo opcional
@app.get("/", tags=["Root"])
async def read_root():
    return {
        "message": "RAG Chatbot API está corriendo",
        "version": "1.0.0",
        "docs": "/docs"
    }
