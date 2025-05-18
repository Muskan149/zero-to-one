# This script retrieves the metadata from the links in the gfg_links_second_level file
# Metadata includes:
# - Title
# - URL
# - Description
# - Keywords
# - Author
# - Category
# - Tags

# Then it generates a csv file with the metadata
# Title, URL, Description, Keywords, Author, Category, Tags will all be concatenated under one column called "metadata"

import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import csv
from urllib.parse import urlparse
import re


def get_metadata(url):
    try:
        # Add headers to mimic a browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Make the request
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Parse the HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract metadata
        title = soup.title.string if soup.title else ''
        
        # Get meta description
        description = ''
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            description = meta_desc.get('content', '')
            
        # Get meta keywords
        keywords = ''
        meta_keywords = soup.find('meta', attrs={'name': 'keywords'})
        if meta_keywords:
            keywords = meta_keywords.get('content', '')
            
        # Get category from URL path
        category = urlparse(url).path.strip('/').split('/')[0] if urlparse(url).path else ''
        
        # Get tags (assuming they're in meta tags)
        tags = []
        meta_tags = soup.find_all('meta', attrs={'property': 'article:tag'})
        if meta_tags:
            tags = [tag.get('content', '') for tag in meta_tags]

        # Get content from the body of the page and replace all the multiple newlines with a space using regex
        content = re.sub(r'\n+', ' ', soup.get_text())
        
        # Return a dictionary with 3 columns: title, url, content, metadata (where metadata is a string of description, keywords, category, tags concatenated)
        return {
            'title': title,
            'url': url,
            'content': content,
            'metadata': f"Description: {description}\nKeywords: {keywords}\nCategory: {category}\nTags: {', '.join(tags)}"
        }
        
    except Exception as e:
        print(f"Error processing {url}: {str(e)}")
        # Return a dictionary with error information instead of a string
        return {
            'title': '',
            'url': url,
            'content': '',
            'metadata': f"Error: {str(e)}"
        }

def main():
    # Read URLs from the CSV file
    urls = []
    with open('gfg_links_second_level.csv', 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            if row:  # Check if row is not empty
                urls.append(row[0])
    
    # Process each URL and collect metadata
    results = []
    for i, url in enumerate(urls):
        print(f"Processing: {url}")
        metadata = get_metadata(url)
        if metadata['title'] != '':
            results.append(metadata)
        
        if i % 20 == 0:
            print(f"Processed {url} with metadata: {metadata}")
        # Add a small delay to be respectful to the server
        time.sleep(1)
    
    # Make a CSV file with the urls and the metadata
    with open('gfg_metadata_0.csv', 'w+') as file:
        writer = csv.writer(file)
        writer.writerow(['title', 'url', 'content', 'metadata'])
        for result in results:
            writer.writerow([result['title'], result['url'], result['content'], result['metadata']])

    # Create DataFrame and save to CSV
    df = pd.DataFrame(results, columns=['title', 'url', 'content', 'metadata'])

    # Print the number of rows in the dataframe
    print(f"Number of rows in the dataframe: {len(df)}")

    print(df.head())

    # Save the dataframe to a csv file
    df.to_csv('gfg_metadata.csv', index=False)
    print("Metadata has been saved to gfg_metadata.csv")

if __name__ == "__main__":
    main()
