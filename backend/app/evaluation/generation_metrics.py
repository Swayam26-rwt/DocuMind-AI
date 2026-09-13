def faithfulness_proxy(answer, evidence): return 0.0 if not answer else min(1.0, len(evidence)/max(1,len(answer)))
