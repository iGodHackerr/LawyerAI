# import os
# import uuid
# import time
# import google.generativeai as genai
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from dotenv import load_dotenv

# # --- Fix for Tokenizers Warning ---
# # This should be set before importing sentence_transformers
# os.environ["TOKENIZERS_PARALLELISM"] = "false"

# # --- NyayGPT Imports ---
# import torch
# from sentence_transformers import SentenceTransformer
# from utils.data_loader import load_legal_data
# from utils.intent_classifier import detect_intent
# from utils.prompt_builder import build_prompt

# # --- Initialization ---
# load_dotenv()

# # --- Flask App Setup ---
# app = Flask(__name__)
# # Allow all origins for simplicity, since it's a backend service
# CORS(app) 

# # --- Gemini API Configuration ---
# try:
#     api_key = "AIzaSyCtwTknD6TREio7NSyQg_6QvSFn26KfzUM"
#     if not api_key:
#         raise ValueError("GOOGLE_API_KEY not found in environment variables.")
#     genai.configure(api_key=api_key)
#     gemini_model = genai.GenerativeModel('gemini-1.5-flash')
#     print("✅ [NyayGPT API] Gemini API configured successfully.")
# except Exception as e:
#     print(f"🔴 FATAL: [NyayGPT API] Error configuring Gemini API: {e}")
#     gemini_model = None

# # --- NyayGPT: One-Time Setup (runs once at server start) ---
# print("⏳ [NyayGPT API] Loading legal data and embedding model...")
# try:
#     # Use relative paths assuming the script is run from the project root
#     file_paths = [
#         './Dataset/CPC.json',
#         './Dataset/CrPC.json',
#         './Dataset/IPC.json',
#         './Dataset/RTI.json',
#         './Dataset/SMA.json'
#     ]
#     legal_data = load_legal_data(file_paths)
#     embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

#     if legal_data and embedding_model:
#         corpus_embeddings = embedding_model.encode(legal_data, convert_to_tensor=True)
#         print("✅ [NyayGPT API] Legal data and embeddings loaded successfully.")
#     else:
#         corpus_embeddings = None
#         raise ValueError("Legal data or embedding model failed to load.")
# except Exception as e:
#     print(f"🔴 FATAL: [NyayGPT API] Could not load all required components: {e}")
#     legal_data = None
#     embedding_model = None
#     corpus_embeddings = None

# # --- OpenAI-Style API Endpoint ---

# @app.route('/v1/chat/completions', methods=['POST'])
# def chat_completions():
#     """
#     Handles chat completion requests in a format compatible with OpenAI's API.
#     """
#     # --- MODIFIED: Corrected the check to avoid the RuntimeError ---
#     if legal_data is None or embedding_model is None or corpus_embeddings is None or gemini_model is None:
#         return jsonify({
#             "error": {
#                 "message": "The NyayGPT service is not fully initialized. Check server logs for details.",
#                 "type": "server_error",
#                 "code": 500
#             }
#         }), 500

#     # --- Extract user query from the request ---
#     try:
#         data = request.get_json()
#         messages = data.get("messages", [])
#         if not messages or not isinstance(messages, list):
#             return jsonify({"error": "Invalid 'messages' field."}), 400
        
#         # Get the content from the last user message
#         user_query = messages[-1].get("content")
#         if not user_query:
#             return jsonify({"error": "No content in the last user message."}), 400

#     except Exception as e:
#         return jsonify({"error": f"Invalid request body: {e}"}), 400

#     # --- Core NyayGPT Logic ---
#     try:
#         intent = detect_intent(user_query)
#         # Build the specialized prompt using your custom RAG logic
#         prompt = build_prompt(user_query, intent, legal_data, embedding_model, corpus_embeddings)
        
#         # Configure and call the Gemini API
#         generation_config = genai.types.GenerationConfig(
#             temperature=0.2,
#             max_output_tokens=512
#         )
#         response = gemini_model.generate_content(
#             contents=prompt,
#             generation_config=generation_config
#         )
#         ai_content = response.text.strip()

#     except Exception as e:
#         print(f"🔴 ERROR: [NyayGPT API] Failed during response generation: {e}")
#         return jsonify({"error": {"message": f"An internal error occurred: {e}", "type": "api_error"}}), 500

#     # --- Format the response to match OpenAI's structure ---
#     completion_response = {
#         "id": f"chatcmpl-{uuid.uuid4()}",
#         "object": "chat.completion",
#         "created": int(time.time()),
#         "model": "nyaygpt-1.0",
#         "choices": [
#             {
#                 "index": 0,
#                 "message": {
#                     "role": "assistant",
#                     "content": ai_content
#                 },
#                 "finish_reason": "stop"
#             }
#         ],
#         "usage": {
#             # Usage stats are not directly available, so we provide placeholders
#             "prompt_tokens": 0,
#             "completion_tokens": 0,
#             "total_tokens": 0
#         }
#     }
    
#     return jsonify(completion_response)

# # A simple health check to see if the server is running
# @app.route('/', methods=['GET'])
# def health_check():
#     return "NyayGPT API service is running."

# if __name__ == '__main__':
#     # Run this service on a different port than your main app
#     app.run(host='0.0.0.0', port=5002, debug=True)




import os
import uuid
import time
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# --- Fix for Tokenizers Warning ---
# This should be set before importing sentence_transformers
os.environ["TOKENIZERS_PARALLELISM"] = "false"

# --- NyayGPT Imports ---
import torch
from sentence_transformers import SentenceTransformer
from utils.data_loader import load_legal_data
from utils.intent_classifier import detect_intent
from utils.prompt_builder import build_prompt

# --- Initialization ---
load_dotenv()

# --- Flask App Setup ---
app = Flask(__name__)
# Allow all origins for simplicity, since it's a backend service
CORS(app) 

# --- Gemini API Configuration ---
try:
    api_key = "AIzaSyCtwTknD6TREio7NSyQg_6QvSFn26KfzUM"
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in environment variables.")
    genai.configure(api_key=api_key)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')
    print("✅ [NyayGPT API] Gemini API configured successfully.")
except Exception as e:
    print(f"🔴 FATAL: [NyayGPT API] Error configuring Gemini API: {e}")
    gemini_model = None

# --- NyayGPT: One-Time Setup (runs once at server start) ---
print("⏳ [NyayGPT API] Loading legal data and embedding model...")
try:
    # Use relative paths assuming the script is run from the project root
    file_paths = [
        './Dataset/CPC.json',
        './Dataset/CrPC.json',
        './Dataset/IPC.json',
        './Dataset/RTI.json',
        './Dataset/SMA.json'
    ]
    legal_data = load_legal_data(file_paths)
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

    if legal_data and embedding_model:
        corpus_embeddings = embedding_model.encode(legal_data, convert_to_tensor=True)
        print("✅ [NyayGPT API] Legal data and embeddings loaded successfully.")
    else:
        corpus_embeddings = None
        raise ValueError("Legal data or embedding model failed to load.")
except Exception as e:
    print(f"🔴 FATAL: [NyayGPT API] Could not load all required components: {e}")
    legal_data = None
    embedding_model = None
    corpus_embeddings = None

# --- OpenAI-Style API Endpoint ---

@app.route('/v1/chat/completions', methods=['POST'])
def chat_completions():
    """
    Handles chat completion requests in a format compatible with OpenAI's API.
    """
    if legal_data is None or embedding_model is None or corpus_embeddings is None or gemini_model is None:
        return jsonify({
            "error": {
                "message": "The NyayGPT service is not fully initialized. Check server logs for details.",
                "type": "server_error",
                "code": 500
            }
        }), 500

    try:
        data = request.get_json()
        messages = data.get("messages", [])
        if not messages or not isinstance(messages, list):
            return jsonify({"error": "Invalid 'messages' field."}), 400
        user_query = messages[-1].get("content")
        if not user_query:
            return jsonify({"error": "No content in the last user message."}), 400
    except Exception as e:
        return jsonify({"error": f"Invalid request body: {e}"}), 400

    try:
        intent = detect_intent(user_query)
        prompt = build_prompt(user_query, intent, legal_data, embedding_model, corpus_embeddings)
        generation_config = genai.types.GenerationConfig(temperature=0.2, max_output_tokens=2512)
        response = gemini_model.generate_content(contents=prompt, generation_config=generation_config)
        ai_content = response.text.strip()
    except Exception as e:
        print(f"🔴 ERROR: [NyayGPT API] Failed during response generation: {e}")
        return jsonify({"error": {"message": f"An internal error occurred: {e}", "type": "api_error"}}), 500

    completion_response = {
        "id": f"chatcmpl-{uuid.uuid4()}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": "nyaygpt-1.0",
        "choices": [{"index": 0, "message": {"role": "assistant", "content": ai_content}, "finish_reason": "stop"}],
        "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
    }
    return jsonify(completion_response)

# --- ADDED: New Endpoint for Title Generation ---

@app.route('/v1/title/generate', methods=['POST'])
def generate_title_from_text():
    """Generates a short title from a given text snippet."""
    if gemini_model is None:
        return jsonify({"error": {"message": "Gemini model not configured.", "type": "server_error"}}), 500

    try:
        data = request.get_json()
        conversation_text = data.get("conversation_text")
        if not conversation_text:
            return jsonify({"error": "Missing 'conversation_text' in request body."}), 400
    except Exception as e:
        return jsonify({"error": f"Invalid request body: {e}"}), 400

    prompt = f"Based on the following conversation, suggest a very short, concise title (4 words maximum).\n\nConversation:\n{conversation_text}"

    try:
        response = gemini_model.generate_content(prompt)
        title = response.text.strip().replace('"', '')
        return jsonify({"title": title})
    except Exception as e:
        print(f"🔴 ERROR: [NyayGPT API] Failed during title generation: {e}")
        return jsonify({"error": {"message": f"An internal error occurred during title generation: {e}", "type": "api_error"}}), 500

# --- Health Check Endpoint ---

@app.route('/', methods=['GET'])
def health_check():
    return "NyayGPT API service is running."

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
