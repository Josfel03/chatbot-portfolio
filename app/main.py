from fastapi import FastAPI

# 1. Inicializamos la App
app = FastAPI(
    title="Chatbot RAG Corporativo",
    version="1.0.0",
    description="API para interrogar documentos PDF usando IA."
)

# 2. Definimos el primer Endpoint (La Ventanilla de Bienvenida)
@app.get("/")
async def root():
    """
    Endpoint de prueba para verificar que el servidor funciona.
    """
    return {
        "mensaje": "Sistema Operativo",
        "estado": "OK",
        "rol": "Orquestador de IA"
    }