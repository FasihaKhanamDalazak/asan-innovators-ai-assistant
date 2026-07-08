from llama_index.core import PromptTemplate

from app.core.llm import llm
from app.rag.retriever import retrieve


SYSTEM_PROMPT = """
You are the official AI assistant for Asan Innovators.

Your job is to answer questions ONLY using the provided company knowledge.

Rules:
- Answer naturally and professionally.
- Never mention "context", "documents", or "knowledge base".
- Never invent information.
- Never guess.
- If the answer cannot be found, reply exactly:

"I couldn't find that information about Asan Innovators."

Keep answers concise unless the user asks for more details.

--------------------
Context:
{context}
--------------------

Question:
{question}

Answer:
"""

prompt = PromptTemplate(SYSTEM_PROMPT)


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

    return response.text.strip()