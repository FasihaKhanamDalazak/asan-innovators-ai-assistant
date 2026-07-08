from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.google_genai import GoogleGenAI

from app.core.config import get_settings


settings = get_settings()


llm = GoogleGenAI(
    model="gemini-2.5-flash",
    api_key=settings.GEMINI_API_KEY,
)


embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-small-en-v1.5"
)