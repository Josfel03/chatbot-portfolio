import os
import shutil
from fastapi import FastAPI, File, UploadFile, HTTPException
from app.schemas import QuestionRequest, AnswerResponse
# Importamos las funciones de TU motor
from app.rag_engine import procesar_y_guardar_documento, preguntar_al_pdf

app = FastAPI(
    title="RAG Portfolio API",
    version="1.0.0", 
    description="API profesional que conecta FastAPI con LangChain y GPT-4o"
)

# Carpeta temporal para guardar los PDFs que suban los usuarios
UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def root():
    return {"message": "La API de IA está lista. Ve a /docs para probarla."}

# --- ENDPOINT 1: SUBIR PDF ---
@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Recibe un archivo PDF, lo guarda temporalmente y lo procesa (Vectoriza).
    """
    # 1. Validar que sea PDF
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="El archivo debe ser un PDF.")
    
    # 2. Guardar el archivo en disco
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 3. Llamar a TU motor de IA
    try:
        exito = procesar_y_guardar_documento(file_path)
        if exito:
            return {"message": f"Archivo '{file.filename}' procesado e indexado con éxito."}
    except Exception as e:
        # Si falla, borramos el archivo y avisamos
        os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error procesando el PDF: {str(e)}")

# --- ENDPOINT 2: CHATEAR ---
@app.post("/chat/", response_model=AnswerResponse)
async def chat_endpoint(request: QuestionRequest):
    """
    Recibe una pregunta JSON, busca en la DB vectorial y responde.
    """
    try:
        # Llamar a TU motor de IA
        respuesta_texto = preguntar_al_pdf(request.question)
        
        return AnswerResponse(answer=respuesta_texto)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el motor de IA: {str(e)}")