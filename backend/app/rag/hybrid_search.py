def reciprocal_rank_fusion(vector_results, keyword_results, k=60):
    scores, lookup = {}, {}
    for rank, item in enumerate(vector_results, 1):
        scores[item.id] = scores.get(item.id, 0) + 1/(k+rank)
        lookup[item.id] = item
    for rank, item in enumerate(keyword_results, 1):
        scores[item.id] = scores.get(item.id, 0) + 1/(k+rank)
        lookup[item.id] = item
    return [lookup[i] for i in sorted(scores, key=scores.get, reverse=True)]
