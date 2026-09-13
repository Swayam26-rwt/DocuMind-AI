def keyword_search(db, query, limit=8):
    from app.models.document_chunk import DocumentChunk
    return db.query(DocumentChunk).filter(
        DocumentChunk.content.ilike(f"%{query}%")
    ).limit(limit).all()
