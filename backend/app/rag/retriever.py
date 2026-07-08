from llama_index.core import Settings, VectorStoreIndex
from llama_index.core.postprocessor import SimilarityPostprocessor
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient

from app.core.config import get_settings
from app.core.llm import embed_model, llm

settings = get_settings()

# Configure LlamaIndex
Settings.llm = llm
Settings.embed_model = embed_model

# Connect to Qdrant
client = QdrantClient(
    url=settings.QDRANT_URL,
    api_key=settings.QDRANT_API_KEY,
)

vector_store = QdrantVectorStore(
    client=client,
    collection_name=settings.COLLECTION_NAME,
)

index = VectorStoreIndex.from_vector_store(
    vector_store=vector_store,
)


retriever = index.as_retriever(
    similarity_top_k=settings.SIMILARITY_TOP_K,
)

postprocessor = SimilarityPostprocessor(
    similarity_cutoff=settings.SIMILARITY_CUTOFF,
)


def retrieve(query: str):
    """
    Retrieve the most relevant chunks for a user query.
    """

    nodes = retriever.retrieve(query)
    nodes = postprocessor.postprocess_nodes(nodes)

    return nodes