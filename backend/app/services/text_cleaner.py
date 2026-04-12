import html
import re

_TAG_RE = re.compile(r"<[^>]+>")
_BLOCK_BREAK_RE = re.compile(r"(?i)</?(p|div|section|article|h[1-6]|ul|ol|li|br)\b[^>]*>")
_PARA_RE = re.compile(r"\n{3,}")
_LINE_WS_RE = re.compile(r"[ \t]+")


def clean_job_description(value: str, fallback: str = "No description available") -> str:
    """Strip HTML and keep readable paragraph breaks for job descriptions."""
    if not value:
        return fallback

    text = str(value)
    # Preserve visual structure before stripping remaining tags.
    with_breaks = _BLOCK_BREAK_RE.sub("\n", text)
    no_tags = _TAG_RE.sub(" ", with_breaks)
    unescaped = html.unescape(no_tags)

    lines = [
        _LINE_WS_RE.sub(" ", line).strip()
        for line in unescaped.splitlines()
    ]
    normalized = "\n".join(line for line in lines if line)
    normalized = _PARA_RE.sub("\n\n", normalized).strip()
    return normalized or fallback
