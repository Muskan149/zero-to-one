from urllib.request import urlopen # to open and access the urls
from bs4 import BeautifulSoup # to parse the html
import requests # to open and access the urls so that beautiful soup can parse it
import csv
import time
import random
import os

# Extracts links from a given url on 2 levels deep. This means it will extract links from the given url and then extract links from those links.
def extract_links(url, num_levels):
    """
    Extracts links from a given URL on 2 levels deep.
    
    Args:
        url (str): The URL of the webpage to extract links from
        num_levels (int): The number of levels deep to extract links
    
    Returns:
        list: A list of URLs
    """
    all_links = set()

    def extract_links_recursive(url, level=0):
        if level >= num_levels:
            return
        
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")

        for l_item in soup.findAll('li'):           
            a_tag = l_item.find('a')

            if a_tag:
                href = a_tag.get('href')
                all_links.add(href)
                extract_links_recursive(href, level + 1)

    extract_links_recursive(url, 0)

    return list(all_links)

# Extracts metadata from a given URL including title, name, description, and keywords.
def extract_metadata(url):
    """
    Extracts metadata from a given URL including title, name, description, and keywords.
    
    Args:
        url (str): The URL of the webpage to extract metadata from
        
    Returns:
        dict: A dictionary containing the following metadata:
            - title (str): The page title from the <title> tag
            - name (str): The page name (from h1 tag or title)
            - description (str): Meta description content
            - keywords (str): Meta keywords content 
            - link (str): Original URL
    
    Example:
        >>> metadata = extract_metadata("https://pythontutorial.com")
        >>> print(metadata)
        {
            'title': 'Python Tutorial',
            'name': 'Python Tutorial Heading', 
            'description': 'Welcome to the Python Tutorial',
            'keywords': 'python, variables, functions, loops, conditionals',
            'link': 'https://pythontutorial.com'
        }
    """
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
            'title': f"Error: {str(e)}",
            'name': "N/A",
            'description': f"Exception: {str(e)}",
            'keywords': "N/A",
            'link': url
        }

# Cleans links and extracts metadata from each link
def process_links(links):
    """
    Processes all links (cleans them). Then extracts metadata from each link.
    
    Args:
        links (list): A list of URLs to process
    
    Returns:
        list: A list of dictionaries containing the metadata for each link
    
    Example:
        >>> links = ["https://example1.com", "https://example2.org"]
        >>> metadata_list = process_links(links)    
    """
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

# Function to write data (links and metadata) to CSV with the following fields: title, name (h1 tag or title), description, keywords, link
def write_links_and_metadata_to_csv(data, filename="website_metadata.csv"):
    
    with open(filename, 'w+', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['title', 'name', 'description', 'keywords', 'link']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for row in data:
            writer.writerow(row)

def extract_w3_links(url):
    """
    Extracts links from W3Schools main page that have class 'ga-nav'
    
    Args:
        url (str): The URL of the W3Schools main page
        
    Returns:
        list: A list of URLs with class 'ga-nav'
    """
    print("Starting to extract W3Schools navigation links...")
    
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        
        # Find all <a> tags with class 'ga-nav'
        nav_links = soup.find_all('a', class_='ga-nav')
        
        # Extract href attributes and filter out javascript:void(0) and invalid links
        links = []
        for link in nav_links:
            href = link.get('href')
            if href and not href.startswith('javascript:'):
                links.append(href)
        
        print(f"Found {len(links)} valid navigation links")
        return links
        
    except Exception as e:
        print(f"Error extracting links: {str(e)}")
        return []

def extract_submenu_links(url):
    """
    Extracts links from the leftmenuinner div of a W3Schools page
    
    Args:
        url (str): The URL of the W3Schools page
        
    Returns:
        list: A list of URLs from the left menu
    """
    try:
        # Skip if URL is invalid or is a javascript link
        if not url or url.startswith('javascript:'):
            return []
            
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        
        # Find the leftmenuinner div
        left_menu = soup.find('div', id='leftmenuinner')
        
        if left_menu:
            # Find all <a> tags within the left menu
            submenu_links = left_menu.find_all('a')
            # Filter out javascript:void(0) links
            return [link.get('href') for link in submenu_links 
                   if link.get('href') and not link.get('href').startswith('javascript:')]
        return []
        
    except Exception as e:
        print(f"Error extracting submenu links from {url}: {str(e)}")
        return []

def write_links_to_csv(links, filename):
    """
    Writes links to a CSV file
    
    Args:
        links (list): List of URLs to write
        filename (str): Name of the CSV file
    """
    # Filter out any remaining invalid links
    valid_links = [link for link in links if link and not link.startswith('javascript:')]
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['link'])  # Header
        for link in valid_links:
            writer.writerow([link])

def main():
    print("Starting W3Schools scraper...")
    
    # Base URL
    base_url = 'https://www.w3schools.com'
    
    # Extract main navigation links
    nav_links = extract_w3_links(base_url)
    
    # Print every 10th link
    for i, link in enumerate(nav_links, 1):
        if i % 10 == 0:
            print(f"Link {i}: {link}")
    
    # Save main navigation links
    write_links_to_csv(nav_links, 'w3_links.csv')
    print(f"Saved {len(nav_links)} main navigation links to w3_links.csv")
    
    # Extract and save submenu links
    all_submenu_links = []
    total_links = len(nav_links)
    
    print("\nStarting to extract submenu links...")
    for i, link in enumerate(nav_links, 1):
        if i % 50 == 0:
            print(f"Processing main link {i}/{total_links}")
        
        # Handle relative URLs
        full_url = base_url + link if link.startswith('/') else link
        submenu_links = extract_submenu_links(full_url)
        all_submenu_links.extend(submenu_links)
        
        # Add a small delay to avoid overwhelming the server
        time.sleep(random.uniform(0.5, 1.5))
    
    # Save submenu links
    write_links_to_csv(all_submenu_links, 'w3_links_deep.csv')
    print(f"\nScraping complete!")
    print(f"Total main navigation links: {len(nav_links)}")
    print(f"Total submenu links: {len(all_submenu_links)}")
    print(f"Results saved to w3_links.csv and w3_links_deep.csv")

# Run the scraper
if __name__ == "__main__":
    main()