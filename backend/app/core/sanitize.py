import re


def sanitize_answer(text: str) -> str:
    """
    Safety net: if the model outputs raw HTML instead of markdown
    (despite prompt instructions), convert the common tags to markdown
    so the chat UI renders correctly either way.
    """

    # <li>item</li> -> - item
    text = re.sub(r"<li>\s*", "- ", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*</li>", "\n", text, flags=re.IGNORECASE)

    # <ul>/<ol> wrappers -> just newlines
    text = re.sub(r"</?(ul|ol)>", "\n", text, flags=re.IGNORECASE)

    # <b>text</b> or <strong>text</strong> -> **text**
    text = re.sub(r"<(b|strong)>", "**", text, flags=re.IGNORECASE)
    text = re.sub(r"</(b|strong)>", "**", text, flags=re.IGNORECASE)

    # <i>text</i> or <em>text</em> -> *text*
    text = re.sub(r"<(i|em)>", "*", text, flags=re.IGNORECASE)
    text = re.sub(r"</(i|em)>", "*", text, flags=re.IGNORECASE)

    # <br> or <br/> -> newline
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.IGNORECASE)

    # <p>text</p> -> text with surrounding newlines
    text = re.sub(r"</?p>", "\n", text, flags=re.IGNORECASE)

    # strip any remaining stray tags we didn't explicitly handle
    text = re.sub(r"<[^>]+>", "", text)

    # collapse excess blank lines/whitespace left behind
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]+\n", "\n", text)

    return text.strip()