def precision_at_k(retrieved, relevant, k):
    return sum(x in relevant for x in retrieved[:k]) / max(1, k)
def recall_at_k(retrieved, relevant, k):
    return sum(x in relevant for x in retrieved[:k]) / max(1, len(relevant))
