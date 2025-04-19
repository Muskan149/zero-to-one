from urllib.request import urlopen # to open and access the urls
from bs4 import BeautifulSoup # to parse the html
import requests # to open and access the urls so that beautiful soup can parse it
import csv
import time
import random
    

def extract_metadata(url):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        
        # Check if the request was successful
        if response.status_code == 200: # success
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Extract title
            title = soup.title.string.strip() if soup.title else "No title"
            
            # Extract name - using h1 or first heading as fallback
            name_tag = soup.find('h1')
            name = name_tag.text.strip() if name_tag else title
            
            # Extract meta description
            meta_desc_tag = soup.find('meta', attrs={'name': 'description'})
            description = meta_desc_tag.get('content', '').strip() if meta_desc_tag else "No description"
            
            # Extract keywords
            keywords_tag = soup.find('meta', attrs={'name': 'keywords'})
            keywords = keywords_tag.get('content', '').strip() if keywords_tag else "No keywords"
            
            return {
                'title': title,
                'name': name,
                'description': description,
                'keywords': keywords,
                'link': url
            }
        else:
            return {
                'title': f"Error: {response.status_code}",
                'name': "N/A",
                'description': "N/A",
                'keywords': "N/A",
                'link': url
            }
    except Exception as e:
        return {
            'title': "Error",
            'name': "N/A",
            'description': f"Exception: {str(e)}",
            'keywords': "N/A",
            'link': url
        }

# Create a function to write data to CSV
def write_to_csv(data, filename="website_metadata.csv"):
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['title', 'name', 'description', 'keywords', 'link']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for row in data:
            writer.writerow(row)

# Main function to process all links
def process_links(links):
    metadata_list = []
    total_links = len(links)
    
    print(f"Starting to process {total_links} links...")

    for i, link in enumerate(links):
        print(f"Processing link {i+1}/{total_links}: {link}")
        
        # Handle relative URLs
        if link.startswith('/'):
            link = 'https://www.geeksforgeeks.org' + link
        
        # Extract metadata
        metadata = extract_metadata(link)
        metadata_list.append(metadata)
        
        # Add a small delay to avoid overwhelming the server
        time.sleep(random.uniform(1, 3))
    
    return metadata_list

# Run the scraper
if __name__ == "__main__":
    url = 'https://www.geeksforgeeks.org/'

    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    top_level_hrefs = []

    for l_item in soup.findAll('li'):
        a_tag = l_item.find('a')

        if a_tag:
            href = a_tag.get('href')
            top_level_hrefs.append(href)
            # print(href)

    with open("links.csv", 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['link']
        writer = csv.writer(csvfile)
        
        for row in top_level_hrefs:
            writer.writerow([row])

    # Filter out any invalid URLs
    # valid_hrefs = [href for href in top_level_hrefs if href and (href.startswith('http') or href.startswith('/'))]
    
    # Process the first 50 links only (to avoid very long runtime)
    # Remove this slice if you want to process all links
    links_to_process = top_level_hrefs[:50]
    
    # Process links
    all_metadata = process_links(links_to_process)
    
    # Write to CSV
    write_to_csv(all_metadata)
    
    print(f"Scraping complete! Data saved to website_metadata.csv")