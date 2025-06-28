# utils/prompt_builder.py
import random
from sentence_transformers import util

def build_prompt(query, intent, legal_data, model, corpus_embeddings):
    base_persona = (
        "You are NyayGPT, a fierce and witty legal strategist for the Indian legal system. "
        "You think like a judge, a law professor, and a courtroom genius. Use Indian legal sections, witty tactics, "
        "and explain legal concepts in simple terms when needed. Always end with a tactical suggestion."
    )

    if intent == "strategy":
        return f"{base_persona}\n\nBased on this case, suggest a bold legal strategy:\n{query}"

    elif intent == "lawyer_recommendation":
        return f"{base_persona}\n\nRecommend an experienced Indian lawyer for this query:\n{query}"

    elif intent == "loophole_detection":
        return f"{base_persona}\n\nDetect any legal loopholes in the following situation:\n{query}"

    elif intent == "legal_explanation" and legal_data and corpus_embeddings is not None:
        query_embedding = model.encode(query, convert_to_tensor=True)
        scores = util.pytorch_cos_sim(query_embedding, corpus_embeddings)[0]
        top_score = scores.max().item()
        top_result = scores.argmax().item()

        if top_score > 0.4:
            match = legal_data[top_result]
            section = match.get("Section", "N/A")
            desc = match.get("Description", "")
            return (
                f"{base_persona}\n\nExplain this legal section in simple terms:\n"
                f"Section: {section}\nDescription: {desc}\n\nQuery: {query}"
            )

    return f"{base_persona}\n\nAnswer the following legal question with full detail:\n{query}"
