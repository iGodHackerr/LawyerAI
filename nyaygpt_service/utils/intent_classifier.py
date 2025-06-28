# utils/intent_classifier.py
def detect_intent(query):
    query_lower = query.lower()
    if any(word in query_lower for word in ["strategy", "win", "defend", "argument"]):
        return "strategy"
    elif "recommend lawyer" in query_lower or "best advocate" in query_lower:
        return "lawyer_recommendation"
    elif any(word in query_lower for word in ["loophole", "exploit", "flaw"]):
        return "loophole_detection"
    elif any(word in query_lower for word in ["explain", "meaning", "define", "what is", "section"]):
        return "legal_explanation"
    else:
        return "general"
