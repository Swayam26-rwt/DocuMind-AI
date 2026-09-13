def build_context(chunks):
    return "\n\n".join(
        f"[Source {i+1} | page={c.page_number}]\n{c.content}"
        for i, c in enumerate(chunks)
    )
