# -*- coding: utf-8 -*-

# Sample Python code for youtube.search.list
# See instructions for running these code samples locally:
# https://developers.google.com/explorer-help/code-samples#python

import os
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
import json

scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"]

# Function to scrape YouTube videos based on a query and return a list of video details
def get_youtube_links(query):
    # Disable OAuthlib's HTTPS verification when running locally.
    # *DO NOT* leave this option enabled in production.
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    api_service_name = "youtube"
    api_version = "v3"
    client_secrets_file = "/Users/muskanmahajan/Zero2One/zero-to-one/src/utils/scrapers/CLIENT_SECRET_FILE.json"

    # Get credentials and create an API client
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
        client_secrets_file, scopes)
    credentials = flow.run_local_server()
    youtube = googleapiclient.discovery.build(
        api_service_name, api_version, credentials=credentials)
    
    query = f"tutorial for {query}"
    
    # Call the search.list method to retrieve results matching the specified query term.

    request = youtube.search().list(
        q=query,
        part='snippet',
        type='video',
        maxResults=5
    )
    response = request.execute()

    print(json.dumps(response, indent=4))

    # Retrieve list of video details
    videos = extract_youtube_info(response)
    # print(f"Retrieved Videos: {videos}")

    with open("videosOutput.txt", "w+") as output_file:
        json.dump(videos, output_file, indent=4)
        print("successfully written to file")

    return videos

# Function to extract video info and create YouTube links
def extract_youtube_info(json_object):
    # Parse the JSON data
    # data = json.loads(json_string)
    
    data = json_object
    # Extract video info and create YouTube links
    videos = []
    
    for item in data.get('items', []):
        if 'videoId' in item.get('id', {}):
            video_id = item['id']['videoId']
            youtube_link = f"https://www.youtube.com/watch?v={video_id}"
            
            video_info = {
                'title': item['snippet']['title'],
                'channel': item['snippet']['channelTitle'],
                'published': item['snippet']['publishedAt'],
                'link': youtube_link
            }
            
            videos.append(video_info)
    
    return [{"title": video['title'],
             "channel": video['channel'],
             "published": video['published'],
             "url": video['link']} for video in videos]

if __name__ == "__main__":
    videos = get_youtube_links("geogia tech tour muskan ")
    for video in videos:
        print(video)
        print()