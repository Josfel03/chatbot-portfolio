from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from loguru import logger
from app.core.config import settings

# Cargar variables de entorno
load_dotenv()

app = FastAPI(
    title="RAG Chatbot API",
    description="API para chatbot con RAG usando ChromaDB y OpenAI",
    version="1.0.0"
)

# Configurar CORS desde settings
ALLOWED_ORIGINS = settings.get_allowed_origins()
logger.info(f"CORS habilitado para: {ALLOWED_ORIGINS}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware de logging
@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Recibida: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Respondida: {response.status_code} {request.url}")
    return response

# Importar routers
from app.routers import upload, query, health, admin

app.include_router(upload.router)
app.include_router(query.router)
app.include_router(health.router)
app.include_router(admin.router)

@app.get("/")
async def root():
    return {
        "message": "RAG Chatbot API",
        "docs": "/docs",
        "allowed_origins": ALLOWED_ORIGINS
    }
