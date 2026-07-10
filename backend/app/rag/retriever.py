from operator import attrgetter

from llama_index.core import Settings, VectorStoreIndex

from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient

from app.core.config import get_settings
from app.core.llm import embed_model, llm

settings = get_settings()

Settings.llm = llm
Settings.embed_model = embed_model

client = QdrantClient(
    url=settings.QDRANT_URL,
    api_key=settings.QDRANT_API_KEY,
)

collection = client.get_collection(settings.COLLECTION_NAME)

print("\n========== COLLECTION ==========")
print(f"Collection : {settings.COLLECTION_NAME}")
print(f"Vectors    : {collection.points_count}")
print("================================\n")

vector_store = QdrantVectorStore(
    client=client,
    collection_name=settings.COLLECTION_NAME,
)

index = VectorStoreIndex.from_vector_store(
    vector_store=vector_store,
)

retriever = index.as_retriever(
    similarity_top_k=settings.RETRIEVE_TOP_K,
)


def retrieve(query: str, min_score: float | None = None):
    """
    Retrieve the most relevant chunks for a query.

    min_score: overrides settings.MIN_SCORE for this call. Any chunk
    scoring below this is dropped before ranking/selection — this is
    the real confidence gate for what counts as "answerable from the KB".
    """

    query = " ".join(query.strip().split())

    nodes = retriever.retrieve(query)

    print("\nRaw retrieval:")
    for node in nodes:
        print(node.score)

    threshold = settings.MIN_SCORE if min_score is None else min_score

    # Real cutoff — chunks below this score are not considered
    # relevant enough to ground an answer.
    nodes = [n for n in nodes if n.score is not None and n.score >= threshold]

    print(f"\nAfter cutoff ({threshold}): {len(nodes)}")

    nodes.sort(
        key=attrgetter("score"),
        reverse=True,
    )

    selected = nodes[: settings.FINAL_TOP_K]

    if settings.ENABLE_RETRIEVAL_LOGS:
        print("\n========== RETRIEVAL ==========")

        for node in selected:
            print(
                f"{node.score:.3f}"
                f" | {node.metadata.get('category', '-')}"
                f" | {node.metadata.get('title', '-')}"
            )

        print("===============================\n")

    return selected