from llama_index.embeddings.fastembed import FastEmbedEmbedding
from llama_index.llms.google_genai import GoogleGenAI
from google.genai import types

from app.core.config import get_settings



settings = get_settings()

RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "answer": {"type": "string"},
        "follow_ups": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 0,
            "maxItems": 2
        }
    },
    "required": ["answer", "follow_ups"]
}

llm = GoogleGenAI(
    model="gemini-2.5-flash",
    api_key=settings.GEMINI_API_KEY,
    generation_config=types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=RESPONSE_SCHEMA,
    ),
)

embed_model = FastEmbedEmbedding(
    model_name="BAAI/bge-small-en-v1.5"
)