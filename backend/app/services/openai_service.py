import openai
from app.core.config import settings

# Instancia el cliente actual de OpenAI (solo una vez por proceso)
client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

def get_embeddings(text_chunks: list[str]) -> list[list[float]]:
    """Obtiene embeddings con OpenAI v1.x API"""
    vectors = []
    for chunk in text_chunks:
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=chunk
        )
        vectors.append(response.data[0].embedding)
    return vectors

def get_llm_response(prompt: str, context: str) -> str:
    """Obtiene respuesta del modelo LLM GPT-4o"""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": context},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content
