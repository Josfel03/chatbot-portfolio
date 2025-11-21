import os
import shutil
from dotenv import load_dotenv

# --- IMPORTACIONES DE ÉLITE (Solo lo necesario) ---
# Usamos langchain_community solo para herramientas externas (PDF, Chroma)
from langchain_community.document_loaders import PyPDFLoader
from langchain_chroma import Chroma
# Usamos langchain_text_splitters explícitamente
from langchain_text_splitters import RecursiveCharacterTextSplitter
# Usamos langchain_openai para los modelos
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
# Usamos langchain_core para la Lógica Pura (LCEL) -> ESTO ES LO ROBUSTO
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

load_dotenv()

# Configuración
PERSIST_DIRECTORY = "./chroma_db"
CHROMA_SETTINGS = {"allow_reset": True}

def procesar_y_guardar_documento(ruta_pdf):
    """
    Ingesta de datos: PDF -> Texto -> Chunks -> Vectores -> DB
    """
    print(f"--- 1. Procesando documento: {ruta_pdf} ---")
    
    if not os.path.exists(ruta_pdf):
        raise FileNotFoundError(f"El archivo {ruta_pdf} no existe.")

    # Cargar
    loader = PyPDFLoader(ruta_pdf)
    docs = loader.load()
    
    # Dividir
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(docs)
    print(f"... Documento dividido en {len(splits)} fragmentos.")

    # Limpiar DB anterior para evitar duplicados sucios en desarrollo
    if os.path.exists(PERSIST_DIRECTORY):
        shutil.rmtree(PERSIST_DIRECTORY)

    # Guardar
    Chroma.from_documents(
        documents=splits,
        embedding=OpenAIEmbeddings(),
        persist_directory=PERSIST_DIRECTORY
    )
    print("--- ¡Éxito! Base de datos vectorial creada ---")
    return True

def format_docs(docs):
    """Ayudante para convertir documentos recuperados en un solo string de texto"""
    return "\n\n".join(doc.page_content for doc in docs)

def preguntar_al_pdf(pregunta):
    """
    Lógica RAG usando LCEL (LangChain Expression Language) Puro.
    Sin cajas negras.
    """
    print(f"--- 2. Preguntando: '{pregunta}' ---")
    
    # A. Cargar la DB Vectorial
    vectorstore = Chroma(
        persist_directory=PERSIST_DIRECTORY, 
        embedding_function=OpenAIEmbeddings()
    )
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    
    # B. El Modelo (LLM)
    llm = ChatOpenAI(model="gpt-4o", temperature=0)

    # C. El Prompt (Instrucciones)
    template = """Eres un asistente útil para tareas de análisis documental.
    Usa los siguientes fragmentos de contexto recuperado para responder la pregunta.
    Si no sabes la respuesta, di simplemente que no lo sabes.
    
    Contexto:
    {context}
    
    Pregunta:
    {question}
    
    Respuesta Útil:"""
    
    prompt = ChatPromptTemplate.from_template(template)

    # D. LA CADENA (LCEL) - AQUÍ ESTÁ LA MAGIA
    # 1. "context": toma la pregunta, busca en el retriever y formatea los docs.
    # 2. "question": pasa la pregunta tal cual (Passthrough).
    # 3. | prompt: envía todo al template.
    # 4. | llm: envía el prompt lleno al modelo.
    # 5. | StrOutputParser: convierte la respuesta del modelo en texto limpio.
    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    # Ejecutar
    return rag_chain.invoke(pregunta)

# Bloque de ejecución directa
if __name__ == "__main__":
    # Solo descomenta esto si necesitas regenerar la DB
    # procesar_y_guardar_documento("manual.pdf")
    
    try:
        respuesta = preguntar_al_pdf("¿De qué trata el documento?")
        print("\n🤖 RESPUESTA:\n" + respuesta)
    except Exception as e:
        print(f"\n❌ ERROR:\n{e}")