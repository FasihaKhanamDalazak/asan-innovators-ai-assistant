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


settings = get_settings()


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
            size=384, # BAAI/bge-small-en-v1.5 embedding dimension
            distance=Distance.COSINE,
        ),
    )


def load_documents():
    """Load all markdown files from the data directory."""

    data_dir = Path("data")

    if not data_dir.exists():
        raise FileNotFoundError(
            f"Data directory not found: {data_dir.resolve()}"
        )

    documents = SimpleDirectoryReader(
        input_dir=data_dir,
        required_exts=[".md"],
    ).load_data()

    if not documents:
        raise ValueError("No markdown files found inside the data directory.")

    return documents


def main() -> None:
    print("\n========== INGESTION STARTED ==========\n")

    # Configure LlamaIndex
    Settings.llm = llm
    Settings.embed_model = embed_model
    Settings.node_parser = SentenceSplitter(
        chunk_size=512,
        chunk_overlap=64,
    )

    # Load documents
    documents = load_documents()
    print(f"Loaded {len(documents)} markdown files.")

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