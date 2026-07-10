from pathlib import Path
import re

from llama_index.core import Document


TITLE_PATTERN = re.compile(r"^#\s+(.+)$", re.MULTILINE)


def extract_title(text: str, fallback: str) -> str:
    """
    Extract the first Markdown H1 heading.

    Falls back to the filename if no H1 exists.
    """

    match = TITLE_PATTERN.search(text)

    if match:
        return match.group(1).strip()

    return fallback.replace("-", " ").replace("_", " ").title()


def enrich_document(
    document: Document,
    data_dir: Path,
) -> Document:
    """
    Add metadata to every document.

    Example metadata:

    {
        title,
        category,
        source,
        path
    }
    """

    source = Path(document.metadata["file_path"]).resolve()

    relative = source.relative_to(data_dir.resolve())
    category = (
        relative.parts[0]
        if len(relative.parts) > 1
        else "root"
    )

    title = extract_title(
        document.text,
        source.stem,
    )

    document.metadata = {
        **document.metadata,

        "title": title,

        "category": category,

        "source": source.name,

        "path": str(relative),
    }

    return document


def enrich_documents(
    documents: list[Document],
    data_dir: Path,
) -> list[Document]:
    """
    Enrich every loaded document.
    """

    return [
        enrich_document(
            document,
            data_dir,
        )
        for document in documents
    ]