from flask import Flask, request, jsonify
from fetch_articles import fetch_articles 
from fetch_videos import fetch_videos, create_youtube_client
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:3001", "http://10.91.31.159:3000", "https://zero-to-one.vercel.app"]}}, 
     supports_credentials=True,
     methods=["GET", "POST", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

@app.route("/", methods=["GET"])
def home():
    return "Flask backend is running!"

@app.route("/api/postArticles", methods=["POST"])
def fetch_articles_endpoint():
    data = request.get_json()
    query = data.get("query")

    if not query:
        return jsonify({"error": "Query is required"}), 400

    try:
        results = fetch_articles(query)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/postVideos", methods=["POST"])
def fetch_videos_endpoint():
    data = request.get_json()
    query = data.get("query")

    if not query:
        return jsonify({"error": "Query is required"}), 400

    try:
        # Create YouTube client only when needed
        youtube_client = create_youtube_client()
        results = fetch_videos(query, youtube_client)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host='0.0.0.0', port=port)