from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.chat import ChatRequest, ChatResponse, chat


app = FastAPI(
    title="Asan Innovators AI Assistant",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
