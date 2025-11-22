# app/services/pdf_service.py

import PyPDF2
from fastapi import UploadFile

def validate_pdf(file: UploadFile, max_size: int = 10_000_000) -> bool:
    """
    Verifica que el archivo sea PDF y no supere el tamaño límite.
    Devuelve True si es válido, False si no.
    """
    # Verifica extensión
    if not file.filename.lower().endswith('.pdf'):
        return False

    # Lee todo el archivo a memoria para verificar tamaño
    contents = file.file.read()
    file.file.seek(0)  # Regresa el puntero al inicio para otras operaciones
    if len(contents) > max_size:
        return False

    return True

def extract_text_from_pdf(file: UploadFile) -> str:
    """
    Extrae texto de todas las páginas de un PDF subido.
    Devuelve un string con el texto concatenado.
    Lanza excepción si el PDF está corrupto o es ilegible.
    """
    try:
        # Leer el archivo usando PyPDF2 (requiere que el file esté en modo binario, file.file es tipo IO)
        reader = PyPDF2.PdfReader(file.file)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text() or ""
            text += page_text
        file.file.seek(0)  # Si otros procesos necesitan leer el archivo después
        if not text.strip():
            raise ValueError("El PDF no contiene texto útil o es un escaneo")
        return text
    except Exception as e:
        # Puedes loguear el error aquí si tienes logger
        print(f"Error al extraer texto del PDF: {e}")
        raise ValueError("No se pudo procesar el PDF. ¿Está corrupto o protegido?")
