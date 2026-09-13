def paginate(query, page=1, page_size=20): return query.offset((page-1)*page_size).limit(page_size)
