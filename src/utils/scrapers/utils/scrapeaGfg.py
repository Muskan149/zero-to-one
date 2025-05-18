# This script scrapes the aGfG website for links and metadata.

import requests
from bs4 import BeautifulSoup
import csv

# First level of scrape: Get all the links from the home page

REDUNDANT_LINKS = ['#', '?', 'contribute', 'javascript:void(0)', 'instagram', 'facebook', 'linkedin', 'twitter', 'youtube', 'advertise', 'contribute', 'course', 'courses', "company",
                        "physics", "maths", "chemistry", "biology", "social-science", "english-grammar", "commerce", "social-science", "english-grammar", "commerce", "social-science", "english-grammar", "commerce"]

def get_links_from_home_page():
    url = "https://www.geeksforgeeks.org/"

    # Get the home page and parse the HTML
    response = requests.get(url)

    print(f"Entered the site {url}")

    soup = BeautifulSoup(response.text, "html.parser")
    links = []

    print("Aggregating urls...")

    # Find all the <li> tags and then find all the <a> tags within those <li> tags.
    # Also find all the <div> tags with the class "HomePageArticleCard_homePageArticleCard__a_mZs" and then find all the <a> tags within those <div> tags.
    # Also find all the <div> tags with the class "HomePageTopicCard_homePageTopicCard__eePhS" and then find all the <a> tags within those <div> tags.
    # We will then extract the href attribute from those <a> tags and add them to a list.   
    # We will then return this list of links.
    for a_tag in soup.find_all("a", class_="HomePageArticleCard_homePageArticleCard__a_mZs"): 
        href = a_tag.get("href")
        if href.startswith('https://www.geeksforgeeks.org/') and not any(x in href for x in REDUNDANT_LINKS):
            links.append(a_tag.get("href"))
    
    for a_tag in soup.find_all("a", class_="HomePageTopicCard_homePageTopicCard__eePhS"):
        href = a_tag.get("href")
        if href.startswith('https://www.geeksforgeeks.org/') and not any(x in href for x in REDUNDANT_LINKS):
            links.append(a_tag.get("href"))

    for li in soup.find_all("li"):
        a_tag = li.find("a")
        if a_tag:
            href = a_tag.get("href")
            if href.startswith('https://www.geeksforgeeks.org/') and not any(x in href for x in REDUNDANT_LINKS):
                links.append(a_tag.get("href"))
    
    print("Saving to csv...")
    
    # Save links to CSV file
    with open(f'gfg_links_home.csv', 'w+', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        for link in links:
            writer.writerow([link])

    print("Added to csv!")
    print("=" * 40)
    print(f"Retrieved {len(links)} links on url {url}")
    print("=" * 40)

    return links

def get_second_level_links():
    # Top level links from the home page
    links = []

    # Second level links
    second_level_links = []
    
    print("Reading from csv...")

    # Read the csv file and populate the links list
    with open(f'gfg_links_home.csv', 'r', newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            link = row[0]
            links.append(link)
    
    # Add the links from the home page to the second level links
    second_level_links.extend(links)

    # For each link, get the links from the page
    print("Getting second level links...")
    for link in links:
        count =  0
        response = requests.get(link)
        soup = BeautifulSoup(response.text, "html.parser")
        for li_item in soup.find_all("li"):
            a_tag = li_item.find("a")
            if a_tag:
                href = a_tag.get("href")
                if href.startswith('https://www.geeksforgeeks.org/') and not any(x in href for x in REDUNDANT_LINKS):
                    second_level_links.append(a_tag.get("href"))
                    count += 1
                    if count % 20 == 0:
                        print(f"Added link: {href}")
                    if count >= 30:
                        break

    # Print the number of links in the second level links
    print(f"Number of links in the second level links before removing duplicates: {len(second_level_links)}")

    # Remove duplicates from the second level links
    second_level_links = list(dict.fromkeys(second_level_links))

    # Print the number of links in the second level links after removing duplicates
    print(f"Number of links in the second level links after removing duplicates: {len(second_level_links)}")

    # Save links to CSV file
    with open(f'gfg_links_second_level.csv', 'w+', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        for link in second_level_links:
            writer.writerow([link])
    
    print("Added to csv!")
    print("=" * 40)
    print(f"Retrieved {len(second_level_links)}")
    print("=" * 40)

    return second_level_links

if __name__ == "__main__":
    # # Retrieve the home page links
    # links = get_links_from_home_page()

    # Retrieve the second level links
    second_level_links = get_second_level_links()