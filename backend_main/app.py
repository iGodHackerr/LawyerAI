# import os
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from dotenv import load_dotenv
# from pymongo import MongoClient
# from bson import ObjectId
# from datetime import datetime, timezone
# import uuid
# import json
# import requests
# import certifi
# import ssl

# # --- Initialization ---
# load_dotenv()

# # --- Flask App Setup ---
# app = Flask(__name__)
# # Allow all origins for simplicity in local development
# CORS(app, resources={r"/*": {"origins": "*"}}) 

# # --- MongoDB Configuration ---
# client = None # Initialize client as None before the try block
# try:
#     mongo_uri = os.getenv("MONGO_URI")
#     if not mongo_uri:
#         raise ValueError("MONGO_URI not found in environment variables.")
#     # --- MODIFIED: Replaced invalid 'ssl_cert_reqs' with valid 'tlsAllowInvalidCertificates' ---
#     client = MongoClient(
#         mongo_uri,
#         tlsCAFile=certifi.where(),
#         tlsAllowInvalidCertificates=True # This will bypass local certificate validation issues
#     )
#     db = client.get_database("ai_chat_app")
#     # Test the connection
#     client.admin.command('ping')
#     print("✅ [Main App] MongoDB connection successful.")
#     # Define collections
#     users_collection = db.users
#     chats_collection = db.chats
#     messages_collection = db.messages
# except Exception as e:
#     print(f"🔴 FATAL: [Main App] Error connecting to MongoDB: {e}")
#     client = None # Ensure client is None on failure

# # --- NyayGPT Service Connection ---
# # This app now exclusively connects to the NyayGPT microservice for all AI tasks.
# print("✅ [Main App] Configured to connect to NyayGPT API service.")


# # --- Helper Functions ---
# def serialize_doc(doc):
#     """Converts MongoDB's ObjectId to a string for JSON serialization."""
#     if doc and '_id' in doc:
#         doc['_id'] = str(doc['_id'])
#     return doc

# def call_nyaygpt_api(user_content):
#     """
#     Makes an HTTP POST request to the standalone NyayGPT API service.
#     """
#     NYAYGPT_API_URL = "http://127.0.0.1:5002/v1/chat/completions"
#     payload = {
#         "model": "nyaygpt-1.0",
#         "messages": [{"role": "user", "content": user_content}]
#     }
#     try:
#         response = requests.post(NYAYGPT_API_URL, json=payload, timeout=90)
#         response.raise_for_status()
#         api_response = response.json()
#         return api_response['choices'][0]['message']['content']
#     except requests.exceptions.RequestException as e:
#         print(f"🔴 ERROR: Could not connect to NyayGPT API: {e}")
#         return "I'm sorry, I was unable to connect to my specialized legal knowledge base. Please try again later."
#     except (KeyError, IndexError) as e:
#         print(f"🔴 ERROR: Invalid response from NyayGPT API: {e}")
#         return "I received an unexpected response from my legal knowledge base. Please contact support."

# # --- API Endpoints ---

# @app.route('/login', methods=['POST'])
# def login():
#     """Creates a new user session and returns a unique ID."""
#     if not client: return jsonify({"error": "Database not connected"}), 500
#     user_id = str(uuid.uuid4())
#     users_collection.insert_one({'user_id': user_id, 'createdAt': datetime.now(timezone.utc)})
#     return jsonify({"userId": user_id}), 201

# @app.route('/chats/<user_id>', methods=['GET'])
# def get_chats(user_id):
#     """Fetches all chat history for a given user."""
#     if not client: return jsonify({"error": "Database not connected"}), 500
#     user_chats = list(chats_collection.find({'user_id': user_id}).sort('createdAt', -1))
#     return jsonify([serialize_doc(chat) for chat in user_chats]), 200

# @app.route('/chat', methods=['POST'])
# def new_chat():
#     """Creates a new, empty chat."""
#     if not client: return jsonify({"error": "Database not connected"}), 500
#     data = request.get_json()
#     chat = {'user_id': data['userId'], 'title': 'New Conversation', 'createdAt': datetime.now(timezone.utc)}
#     result = chats_collection.insert_one(chat)
#     chat['_id'] = str(result.inserted_id)
#     return jsonify(serialize_doc(chat)), 201

# @app.route('/chat/<chat_id>/messages', methods=['GET'])
# def get_messages(chat_id):
#     """Gets all messages for a specific chat."""
#     if not client: return jsonify({"error": "Database not connected"}), 500
#     messages = list(messages_collection.find({'chat_id': chat_id}).sort('timestamp', 1))
#     return jsonify([serialize_doc(msg) for msg in messages]), 200

# @app.route('/chat/<chat_id>/message', methods=['POST'])
# def new_message(chat_id):
#     """Adds a user message and gets a specialized AI response by calling the NyayGPT API."""
#     if not client: return jsonify({"error": "Database not connected"}), 500
    
#     data = request.get_json()
#     user_content = data['content']
    
#     user_message = {'chat_id': chat_id, 'role': 'user', 'content': user_content, 'timestamp': datetime.now(timezone.utc)}
#     messages_collection.insert_one(user_message)
        
#     try:
#         ai_content = call_nyaygpt_api(user_content)
#         assistant_message = {'chat_id': chat_id, 'role': 'assistant', 'content': ai_content, 'timestamp': datetime.now(timezone.utc)}
#         result = messages_collection.insert_one(assistant_message)
#         assistant_message['_id'] = str(result.inserted_id)
#         return jsonify(serialize_doc(assistant_message)), 201
#     except Exception as e:
#         return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

# @app.route('/chat/<chat_id>', methods=['DELETE'])
# def delete_chat(chat_id):
#     """Deletes a chat and all its associated messages."""
#     if not client: return jsonify({"error": "Database not connected"}), 500
#     try:
#         obj_id = ObjectId(chat_id)
#         chats_collection.delete_one({'_id': obj_id})
#         messages_collection.delete_many({'chat_id': chat_id})
#         return jsonify({"message": "Chat deleted successfully"}), 200
#     except Exception as e:
#         print(f"Error deleting chat: {e}")
#         return jsonify({"error": str(e)}), 500

# # Title generation endpoint removed as it was dependent on the direct Gemini connection.

# @app.route('/', methods=['GET'])
# def health_check():
#     """A simple health check to see if the server is running."""
#     return "Main backend server is running."

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5001, debug=True)




import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timezone
import uuid
import json
import requests
import certifi
import ssl

# --- Initialization ---
load_dotenv()

# --- Flask App Setup ---
app = Flask(__name__)
# Allow all origins for simplicity in local development
CORS(app, resources={r"/*": {"origins": "*"}}) 

# --- MongoDB Configuration ---
client = None # Initialize client as None before the try block
try:
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        raise ValueError("MONGO_URI not found in environment variables.")
    # --- Corrected SSL Handling ---
    client = MongoClient(
        mongo_uri,
        tlsCAFile=certifi.where(),
        tlsAllowInvalidCertificates=True # This will bypass local certificate validation issues
    )
    db = client.get_database("ai_chat_app")
    client.admin.command('ping')
    print("✅ [Main App] MongoDB connection successful.")
    users_collection = db.users
    chats_collection = db.chats
    messages_collection = db.messages
except Exception as e:
    print(f"🔴 FATAL: [Main App] Error connecting to MongoDB: {e}")
    client = None 

# --- NyayGPT Service Connection ---
print("✅ [Main App] Configured to connect to NyayGPT API service.")


# --- Helper Functions ---
def serialize_doc(doc):
    """Converts MongoDB's ObjectId to a string for JSON serialization."""
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

def call_nyaygpt_api(user_content):
    """Makes an HTTP POST request to the standalone NyayGPT API service for chat."""
    NYAYGPT_API_URL = "http://127.0.0.1:5002/v1/chat/completions"
    payload = {"model": "nyaygpt-1.0", "messages": [{"role": "user", "content": user_content}]}
    try:
        response = requests.post(NYAYGPT_API_URL, json=payload, timeout=90)
        response.raise_for_status()
        api_response = response.json()
        return api_response['choices'][0]['message']['content']
    except requests.exceptions.RequestException as e:
        print(f"🔴 ERROR: Could not connect to NyayGPT API: {e}")
        return "I'm sorry, I was unable to connect to my specialized legal knowledge base."
    except (KeyError, IndexError) as e:
        print(f"🔴 ERROR: Invalid response from NyayGPT API: {e}")
        return "I received an unexpected response from my legal knowledge base."

# --- ADDED: Helper function for title generation ---
def call_title_generation_api(conversation_text):
    """Makes an HTTP POST request to the NyayGPT API to generate a title."""
    TITLE_API_URL = "http://127.0.0.1:5002/v1/title/generate"
    payload = {"conversation_text": conversation_text}
    try:
        response = requests.post(TITLE_API_URL, json=payload, timeout=30)
        response.raise_for_status()
        api_response = response.json()
        return api_response['title']
    except requests.exceptions.RequestException as e:
        print(f"🔴 ERROR: Could not connect to NyayGPT API for title generation: {e}")
        return "New Conversation" # Fallback title
    except KeyError:
        print(f"🔴 ERROR: Invalid response from NyayGPT title API.")
        return "New Conversation" # Fallback title

# --- API Endpoints ---

@app.route('/login', methods=['POST'])
def login():
    if not client: return jsonify({"error": "Database not connected"}), 500
    user_id = str(uuid.uuid4())
    users_collection.insert_one({'user_id': user_id, 'createdAt': datetime.now(timezone.utc)})
    return jsonify({"userId": user_id}), 201

@app.route('/chats/<user_id>', methods=['GET'])
def get_chats(user_id):
    if not client: return jsonify({"error": "Database not connected"}), 500
    user_chats = list(chats_collection.find({'user_id': user_id}).sort('createdAt', -1))
    return jsonify([serialize_doc(chat) for chat in user_chats]), 200

@app.route('/chat', methods=['POST'])
def new_chat():
    if not client: return jsonify({"error": "Database not connected"}), 500
    data = request.get_json()
    chat = {'user_id': data['userId'], 'title': 'New Conversation', 'createdAt': datetime.now(timezone.utc)}
    result = chats_collection.insert_one(chat)
    chat['_id'] = str(result.inserted_id)
    return jsonify(serialize_doc(chat)), 201

@app.route('/chat/<chat_id>/messages', methods=['GET'])
def get_messages(chat_id):
    if not client: return jsonify({"error": "Database not connected"}), 500
    messages = list(messages_collection.find({'chat_id': chat_id}).sort('timestamp', 1))
    return jsonify([serialize_doc(msg) for msg in messages]), 200

@app.route('/chat/<chat_id>/message', methods=['POST'])
def new_message(chat_id):
    if not client: return jsonify({"error": "Database not connected"}), 500
    data = request.get_json()
    user_content = data['content']
    user_message = {'chat_id': chat_id, 'role': 'user', 'content': user_content, 'timestamp': datetime.now(timezone.utc)}
    messages_collection.insert_one(user_message)
    try:
        ai_content = call_nyaygpt_api(user_content)
        assistant_message = {'chat_id': chat_id, 'role': 'assistant', 'content': ai_content, 'timestamp': datetime.now(timezone.utc)}
        result = messages_collection.insert_one(assistant_message)
        assistant_message['_id'] = str(result.inserted_id)
        return jsonify(serialize_doc(assistant_message)), 201
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@app.route('/chat/<chat_id>', methods=['DELETE'])
def delete_chat(chat_id):
    if not client: return jsonify({"error": "Database not connected"}), 500
    try:
        obj_id = ObjectId(chat_id)
        chats_collection.delete_one({'_id': obj_id})
        messages_collection.delete_many({'chat_id': chat_id})
        return jsonify({"message": "Chat deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting chat: {e}")
        return jsonify({"error": str(e)}), 500

# --- ADDED: Re-instated the title generation endpoint ---
@app.route('/chat/<chat_id>/title', methods=['POST'])
def generate_title(chat_id):
    """Generates and updates a chat title by calling the NyayGPT service."""
    if not client: return jsonify({"error": "Database not connected"}), 500
    
    messages = list(messages_collection.find({'chat_id': chat_id}).sort('timestamp', 1).limit(4))
    if len(messages) < 2: 
        return jsonify({"error": "Not enough messages to generate a title"}), 400
    
    conversation_text = "\n".join([f"{m['role']}: {m['content']}" for m in messages])
    
    try:
        title = call_title_generation_api(conversation_text) # Call the new helper
        chats_collection.update_one({'_id': ObjectId(chat_id)}, {'$set': {'title': title}})
        return jsonify({"title": title}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET'])
def health_check():
    """A simple health check to see if the server is running."""
    return "Main backend server is running."

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
