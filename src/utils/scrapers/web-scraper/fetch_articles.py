import os
from openai import OpenAI
from pinecone import Pinecone
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")  
)

# Initialize Pinecone client
pc = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY") 
)

# Constants
EMBEDDING_MODEL = "text-embedding-3-small"  # OpenAI's embedding model
PINECONE_INDEX_NAME = "blog-search"  # Name for your Pinecone index
EMBEDDING_DIMENSION = 1536  # Dimension for text-embedding-3-small model

# MAIN FUNCTION
# Function to search and retrieve the articles (title, url, id, score)
def fetch_articles(query, top_k=3, verbose=False):
    """
    Search for blogs similar to the query
    
    Args:
        query (str): The search query
        top_k (int): Number of similar blogs to return  

    Output format:
    [
      {
        "title": "Article Title",
        "url": "https://www.example.com/article"
      },
      ...
    ]
    """
    # Generate embedding for the query
    query_embedding = get_embedding(query)
    
    # Connect to the Pinecone index
    index = pc.Index(PINECONE_INDEX_NAME)
    
    # Perform the search
    search_results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )

    if verbose:
        print("search_results: ", search_results)
    
    # Extract the results
    results = []
    for match in search_results['matches']:
        results.append({
            'title': match['metadata']['title'],
            'url': match['metadata']['url'],
            'id': match['id'],
            'score': match['score']
        })
    
    return results

# Function to get embedding for a single text (we will use this for the query)
def get_embedding(text):
    """
    Generate embeddings for a single text
    
    Args:
        text (str): The input text to generate embeddings for
        
    Returns:
        list: The embedding vector
    """
    try:
        response = client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=text,
            encoding_format="float"  # Returns embeddings as float values
        )
        
        return response.data[0].embedding
    except Exception as e:
        print(f"Error generating embedding: {e}")
        raise

# Function to test the search functionality
def main():
    """
    Main function to demonstrate functionality
    """
    # 1. Define the CSV file path
    # csv_path = "/Users/muskanmahajan/Zero2One/zero-to-one/gfg_metadata_cleaned.csv"
    
    # 2. Process the CSV and upload to Pinecone (only need to run once)
    # print("Step 1: Processing blog data and creating embeddings...")
    # upload_to_pinecone(csv_path)
    
    # 3. Perform some example searches
    print("Testing search functionality...")
    
    test_queries = [
        # "data structures and algorithms",
        "machine learning tutorials",
        "set up react project",
        "aws services",
        "aws gcp azure",
        # "web development with JavaScript"
    ]
    
    test_queries.extend([
      "Database schema design for event management system",
      "MongoDB vs PostgreSQL for beginners",
      "Prisma ORM tutorial for Next.js"
    ])
    
    for query in test_queries:
        print(f"\nSearch query: '{query}'")
        # search_blogs: The function to search for similar blogs
        results = fetch_articles(query)
        
        print("Top matching blogs:")
        for i, result in enumerate(results, 1):
            print(f"{i}. {result['title']} (Score: {result['score']:.4f})")
            print(f"   Link: {result['url']}")
            print(f"   ID: {result['id']}")

if __name__ == "__main__":
    pass