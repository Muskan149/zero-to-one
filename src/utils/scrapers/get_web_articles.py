# pip install openai python-dotenv pandas pinecone numpy
import os
import pandas as pd
import numpy as np
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec
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

# Function to search and retrieve the articles 
def get_web_articles(query, top_k=3):
    """
    Search for blogs similar to the query
    
    Args:
        query (str): The search query
        top_k (int): Number of similar blogs to return
        
    Returns:
        list: List of dictionaries containing title and link of similar blogs
    """
    # Generate embedding for the query
    query_embedding = get_embedding(query)
    # print("testing query_embedding", query_embedding)
    
    # Connect to the Pinecone index
    index = pc.Index(PINECONE_INDEX_NAME)
    
    # Perform the search
    search_results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    
    # Format the results and return the title, url, and description of the top matches
    results = []
    for match in search_results['matches']:
        results.append({
            'title': match['metadata']['title'],
            'url': match['metadata']['link'],
            'description': match['metadata']['description'],
            'score': match['score']
        })
    
    return results

# Function to get embedding for a single text
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

# Function to get embeddings for a batch of texts
def get_batch_embeddings(texts, batch_size=100):
    """
    Generate embeddings for multiple texts in batches
    
    Args:
        texts (list): Array of input texts
        batch_size (int): Size of batches to process
        
    Returns:
        list: Array of embedding vectors
    """
    all_embeddings = []
    
    # Process in batches to avoid rate limits
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]

        # Convert all items to strings and handle None values
        batch = [str(text) if text is not None else "" for text in batch]

        try:
            response = client.embeddings.create(
                model=EMBEDDING_MODEL,
                input=batch,
                encoding_format="float"
            )
            
            batch_embeddings = [item.embedding for item in response.data]
            all_embeddings.extend(batch_embeddings)
            print(f"Processed batch {i//batch_size + 1}/{(len(texts)+batch_size-1)//batch_size}")
        except Exception as e:
            print(f"Error generating batch embeddings: {e}")
            raise
            
    return all_embeddings

# Function to create Pinecone index if it doesn't exist
def create_pinecone_index():
    """
    Create a Pinecone index for storing blog embeddings if it doesn't exist
    """
    # Check if the index already exists
    if PINECONE_INDEX_NAME not in pc.list_indexes().names():
        print(f"Creating new Pinecone index: {PINECONE_INDEX_NAME}")
        
        # Create the index - using free tier compatible settings
        # Free tier uses Starter type indexes in gcp-starter
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=EMBEDDING_DIMENSION,
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
                # Use the free tier)
                )
        )
        print(f"Index {PINECONE_INDEX_NAME} created successfully")
    else:
        print(f"Index {PINECONE_INDEX_NAME} already exists")

# Function to upload blog data and embeddings to Pinecone
def upload_to_pinecone(csv_path):
    """
    Process blog data from CSV, generate embeddings, and upload to Pinecone
    
    Args:
        csv_path (str): Path to the CSV file with blog data
    """
    # Load and preprocess data
    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df)} rows from CSV")
    
    # Make sure Pinecone index exists
    create_pinecone_index()
    
    # Connect to the index
    index = pc.Index(PINECONE_INDEX_NAME)
    
    # Generate embeddings for the merged_info column
    print("Generating embeddings for blog data...")
    texts = df['merged_info'].tolist()
    embeddings = get_batch_embeddings(texts)
    
    # Prepare data for Pinecone
    vectors_to_upsert = []
    for i, (_, row) in enumerate(df.iterrows()):
        vector = {
            'id': str(row['id']),
            'values': embeddings[i],
            'metadata': {
                'title': row['title'],
                'link': row['link'],
                'description': row['description'] if not pd.isna(row['description']) else ""
            }
        }
        vectors_to_upsert.append(vector)
    
    # Upsert in batches (Pinecone may have limits)
    batch_size = 100
    for i in range(0, len(vectors_to_upsert), batch_size):
        batch = vectors_to_upsert[i:i+batch_size]
        index.upsert(vectors=batch)
        print(f"Uploaded batch {i//batch_size + 1}/{(len(vectors_to_upsert)+batch_size-1)//batch_size} to Pinecone")
    
    print(f"Successfully uploaded {len(vectors_to_upsert)} blog embeddings to Pinecone")

# Function to test the search functionality
def main():
    """
    Main function to demonstrate functionality
    """
    # # 1. Define the CSV file path
    # csv_path = "/Users/muskanmahajan/Zero2One/zero-to-one/src/utils/scrapers/website_metadata_merged - website_metadata_merged.csv"
    
    # # 2. Process the CSV and upload to Pinecone (only need to run once)
    # print("Step 1: Processing blog data and creating embeddings...")
    # upload_to_pinecone(csv_path)
    
    # # 3. Perform some example searches
    print("Testing search functionality...")
    
    test_queries = [
        # "data structures and algorithms",
        "machine learning tutorials",
        # "web development with JavaScript"
    ]
    
    for query in test_queries:
        print(f"\nSearch query: '{query}'")
        # search_blogs: The function to search for similar blogs
        results = get_web_articles(query)
        
        print("Top matching blogs:")
        for i, result in enumerate(results, 1):
            print(f"{i}. {result['title']} (Score: {result['score']:.4f})")
            print(f"   Description: {result['description'] if 'description' in result else 'No description available'}")
            print(f"   Link: {result['url']}")