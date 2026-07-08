from pydantic import BaseModel

from app.rag.pipeline import answer


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    answer: str
    follow_ups: list[str] = []


def chat(request: ChatRequest) -> ChatResponse:
    result = answer(request.message)

    return ChatResponse(
        answer=result["answer"],
        follow_ups=result["follow_ups"],
    )