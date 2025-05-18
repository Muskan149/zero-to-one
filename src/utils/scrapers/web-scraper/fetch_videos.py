# -*- coding: utf-8 -*-

# Sample Python code for youtube.search.list
# See instructions for running these code samples locally:
# https://developers.google.com/explorer-help/code-samples#python
import os
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
import json
import urllib.parse
import pickle
from google.oauth2.credentials import Credentials
import os.path

scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"]
CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), "youtube_credentials.pickle")

# Main function to scrape YouTube videos based on a query and return a list of video details
def fetch_videos(query, youtube_client=None, top_k=2, verbose=False):
    # Get or create a YouTube client if not provided
    if youtube_client is None:
        youtube_client = create_youtube_client()
        
    # Output format:
    # [
    #   {
    #     "title": "Video Title",
    #     "url": "https://www.youtube.com/watch?v=video_id"
    #   },
    #   ...
    # Function to extract video info and create YouTube links
    def extract_youtube_info(json_object):
        data = json_object
        # Extract video info and create YouTube links
        videos = []
        
        for item in data.get('items', []):
            if 'videoId' in item.get('id', {}):
                video_id = item['id']['videoId']
                url = f"https://www.youtube.com/watch?v={video_id}"
                
                video_info = {
                    'title': item['snippet']['title'],
                    'channel': item['snippet']['channelTitle'],
                    'published': item['snippet']['publishedAt'],
                    'url': url
                }
                
                videos.append(video_info)
        
        return videos  

    try:
        # URL encode the query to handle special characters and spaces
        encoded_query = urllib.parse.quote(query)
        
        # Call the search.list method to retrieve results matching the specified query term.
        request = youtube_client.search().list(
            q=encoded_query,
            part='snippet',
            type='video',
            maxResults=10  # Increased from 2 to 10 for better testing
        )

        response = request.execute()

        if verbose:
            print("query: ", query)
            print("response: ")
            print(json.dumps(response, indent=4))

        # Check if we got any items in the response
        if not response.get('items'):
            print(f"Warning: No items found in response for query: {query}")
            print("Response:", json.dumps(response, indent=2))
            return []

        # Retrieve list of video details
        videos = extract_youtube_info(response)
        # Return the number of videos we want to scrape
        return videos[:top_k]

    except googleapiclient.errors.HttpError as e:
        print(f"An HTTP error occurred: {e}")
        print(f"Error details: {e.error_details if hasattr(e, 'error_details') else 'No details available'}")
        return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

# Global variable to store the YouTube client
_cached_youtube_client = None

# Function to create a google client
def create_youtube_client():
    global _cached_youtube_client
    
    # If we already have a cached client, return it
    if _cached_youtube_client is not None:
        return _cached_youtube_client
    
    # Disable OAuthlib's HTTPS verification when running locally.
    # *DO NOT* leave this option enabled in production.
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    api_service_name = "youtube"
    api_version = "v3"
    client_secrets_file = os.path.join(os.path.dirname(__file__), "CLIENT_SECRET_FILE.json")
    
    # Check if we have saved credentials
    if os.path.exists(CREDENTIALS_FILE):
        try:
            with open(CREDENTIALS_FILE, 'rb') as token:
                credentials = pickle.load(token)
                
            # Create YouTube client with saved credentials
            _cached_youtube_client = googleapiclient.discovery.build(
                api_service_name, api_version, credentials=credentials)
            print("Using cached YouTube credentials")
            return _cached_youtube_client
            
        except Exception as e:
            print(f"Error loading cached credentials: {e}")
            # If there's an error, we'll create new credentials
            
    # If no cached credentials or error loading them, create new ones
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
        client_secrets_file, scopes)

    credentials = flow.run_local_server(port=8081)
    
    # Save the credentials for future use
    try:
        with open(CREDENTIALS_FILE, 'wb') as token:
            pickle.dump(credentials, token)
        print("Saved YouTube credentials for future use")
    except Exception as e:
        print(f"Error saving credentials: {e}")
            
    _cached_youtube_client = googleapiclient.discovery.build(
        api_service_name, api_version, credentials=credentials)
    
    return _cached_youtube_client

if __name__ == "__main__":
    # Test different query variations
    queries = [
        "Node.js pagination",  # Simpler query
    ]

    youtube_client = create_youtube_client()

    all_videos = []
    for query in queries:
        print(f"\nTesting query: {query}")
        videos = fetch_videos(query, youtube_client, verbose=False)
        if videos:
            print(f"Found {len(videos)} videos for query: {query}")
            for video in videos:
                print(f"Title: {video['title']}")
                print(f"URL: {video['url']}")
                print()
            all_videos.extend([{"title": video['title'], "url": video['url']} for video in videos])
        else:
            print(f"No videos found for query: {query}")

    if all_videos:
        with open("videosOutput.txt", "w+") as output_file:
            json.dump(all_videos, output_file, indent=4)
            print("\nSuccessfully written to file")
    pass