from fastapi import FastAPI

from app.chat import ChatRequest, ChatResponse, chat

app = FastAPI(
    title="Asan Innovators AI Assistant",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "status": "running",
        "message": "Asan Innovators AI Assistant API"
    }


@app.post(
    "/chat",
    response_model=ChatResponse,
)
def chat_endpoint(request: ChatRequest):
    return chat(request)