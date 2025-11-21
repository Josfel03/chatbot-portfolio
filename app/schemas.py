from pydantic import BaseModel

# Esto define QUÉ esperamos recibir del usuario
class QuestionRequest(BaseModel):
    question: str

# Esto define QUÉ le vamos a devolver
class AnswerResponse(BaseModel):
    answer: str
    source: str = "Documento Local"