from llama_index.core import PromptTemplate

from app.core.llm import llm
from app.rag.retriever import retrieve

import json

SYSTEM_PROMPT = """
You are the official AI assistant for Asan Innovators.

Your job is to answer questions ONLY using the provided company knowledge.

Rules:
- Answer naturally and professionally.
- Never mention "context", "documents", or "knowledge base".
- Never invent information.
- Never guess.
- If the answer cannot be found, return:

{
  "answer": "I couldn't find that information about Asan Innovators.",
  "follow_ups": []
}

- Otherwise return ONLY valid JSON in this format:

{
  "answer": "Your answer here",
  "follow_ups": [
    "Follow-up question 1",
    "Follow-up question 2"
  ]
}

Rules for follow-ups:
- Suggest 1 or 2 questions.
- They must be relevant to the answer.
- They must be answerable using the company information.
- Do not repeat the user's question.
- Do not include markdown.
- Output ONLY JSON.

--------------------
Context:
{context}
--------------------

Question:
{question}
"""

prompt = PromptTemplate(SYSTEM_PROMPT)

def clean_json(text: str) -> str:
    text = text.strip()

    if text.startswith("```"):
        lines = text.splitlines()
        lines = [
            line for line in lines
            if not line.startswith("```")
        ]
        text = "\n".join(lines)

    return text

def answer(question: str) -> str:
    """
    Generate an answer using Retrieval-Augmented Generation (RAG).
    """

    nodes = retrieve(question)

    if not nodes:
        return "I couldn't find that information about Asan Innovators."

    context = "\n\n".join(
        node.text
        for node in nodes
    )

    final_prompt = prompt.format(
        context=context,
        question=question,
    )

    response = llm.complete(final_prompt)

    try:
        result = json.loads(
            clean_json(response.text)
        )
        return result
    except json.JSONDecodeError:
        return {
            "answer": response.text.strip(),
            "follow_ups": []
        }