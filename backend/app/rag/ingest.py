from pathlib import Path

from llama_index.core import (
    Settings,
    SimpleDirectoryReader,
    StorageContext,
    VectorStoreIndex,
)
from llama_index.core.node_parser import SentenceSplitter
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams

from app.core.config import get_settings
from app.core.llm import embed_model, llm

from collections import Counter
from app.rag.metadata import enrich_documents

settings = get_settings()

def embedding_dimension() -> int:
    """
    Detect the embedding dimension automatically.
    """

    return len(
        embed_model.get_text_embedding(
            "asan innovators"
        )
    )
def recreate_collection(client: QdrantClient) -> None:
    """Delete the collection if it exists and create a fresh one."""

    collections = {
        collection.name
        for collection in client.get_collections().collections
    }

    if settings.COLLECTION_NAME in collections:
        print(f"Deleting collection: {settings.COLLECTION_NAME}")
        client.delete_collection(settings.COLLECTION_NAME)

    print(f"Creating collection: {settings.COLLECTION_NAME}")

    client.create_collection(
        collection_name=settings.COLLECTION_NAME,
        vectors_config=VectorParams(
            size=embedding_dimension(), # BAAI/bge-small-en-v1.5 embedding dimension
            distance=Distance.COSINE,
        ),
    )


def load_documents() -> list:
    """
    Load every markdown document recursively and enrich metadata.
    """

    data_dir = Path(settings.DATA_DIR).resolve()

    if not data_dir.exists():
        raise FileNotFoundError(
            f"Data directory not found: {data_dir.resolve()}"
        )

    documents = SimpleDirectoryReader(
        input_dir=str(data_dir),
        recursive=True,
        required_exts=[".md"],
        filename_as_id=True,
    ).load_data()

    if not documents:
        raise ValueError(
            "No markdown documents found."
        )

    documents = enrich_documents(
        documents,
        data_dir,
    )

    print("\nDiscovered knowledge base\n")

    counts = Counter(
        doc.metadata["category"]
        for doc in documents
    )

    for category, total in sorted(counts.items()):
        print(f"  {category:<15} {total:>3}")

    print(f"\nTotal documents : {len(documents)}\n")

    return documents


def main() -> None:
    print("\n========== INGESTION STARTED ==========\n")

    # Configure LlamaIndex
    Settings.llm = llm
    Settings.embed_model = embed_model
    Settings.node_parser = SentenceSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
        include_metadata=True,
        include_prev_next_rel=True,
    )
    # Load documents
    documents = load_documents()
    

    # Connect to Qdrant
    client = QdrantClient(
        url=settings.QDRANT_URL,
        api_key=settings.QDRANT_API_KEY,
    )

    # Reset collection
    recreate_collection(client)

    # Create vector store
    vector_store = QdrantVectorStore(
        client=client,
        collection_name=settings.COLLECTION_NAME,
    )

    storage_context = StorageContext.from_defaults(
        vector_store=vector_store,
    )

    # Build index
    VectorStoreIndex.from_documents(
        documents,
        storage_context=storage_context,
        show_progress=True,
    )

    print("\n========== INGESTION COMPLETED ==========")
    print(f"Collection : {settings.COLLECTION_NAME}")
    print(f"Documents  : {len(documents)}")
    print("Status     : Success ✅")


if __name__ == "__main__":
    main()