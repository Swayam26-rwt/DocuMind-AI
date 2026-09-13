def build_citations(chunks):
    return [{"chunk_id": c.id, "page": c.page_number, "quote": c.content[:500]} for c in chunks]
