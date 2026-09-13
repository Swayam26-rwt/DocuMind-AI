def confidence_from_evidence(retrieval_score, citation_support, extraction_consistency):
    values = [max(0, min(1, float(x))) for x in
              (retrieval_score, citation_support, extraction_consistency)]
    return round(sum(values) / len(values), 4)
