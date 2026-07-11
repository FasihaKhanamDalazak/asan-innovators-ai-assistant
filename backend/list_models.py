from google import genai
from app.core.config import get_settings

settings = get_settings()

client = genai.Client(api_key=settings.GEMINI_API_KEY)

print("\nAvailable models:\n")

for model in client.models.list():
    print(model.name)

    