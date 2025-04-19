from flask import Flask, request, jsonify
from get_web_articles import get_web_articles 
from get_youtube_links import get_youtube_links

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return "Flask backend is running!"

@app.route("/api/getArticles", methods=["GET"])
def search_articles():
    # data = request.get_json()
    query = request.args.get("query")  # <-- this grabs `?query=...` from the URL

    if not query:
        return jsonify({"error": "Query is required"}), 400

    try:
        results = get_web_articles(query)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/postArticles", methods=["POST"])
def post_articles():
    data = request.get_json()
    query = data.get("query")

    if not query:
        return jsonify({"error": "Query is required"}), 400

    try:
        results = get_web_articles(query)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/getYoutubeLinks", methods=["GET"])
def search_videos():
    query = request.args.get("query")  # <-- same fix here
    if not query:
        return jsonify({"error": "Query is required"}), 400

    try:
        results = get_youtube_links(query)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/postVideos", methods=["POST"])
def post_videos():
    data = request.get_json()
    query = data.get("query")

    if not query:
        return jsonify({"error": "Query is required"}), 400

    try:
        results = get_youtube_links(query)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8000)