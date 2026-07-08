from pydantic import BaseModel

from app.rag.pipeline import answer


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    answer: str


def chat(request: ChatRequest) -> ChatResponse:
    return ChatResponse(
        answer=answer(request.message)
    )