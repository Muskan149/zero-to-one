import os
from openai import OpenAI
from pinecone import Pinecone
from dotenv import load_dotenv
import pandas as pd
from pinecone import ServerlessSpec

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

# Function to create Pinecone index if it doesn't exist
def create_pinecone_index():
    """
    Create a Pinecone index for storing blog embeddings if it doesn't exist
    """
    # Check if the index already exists
    if PINECONE_INDEX_NAME not in pc.list_indexes().names():
        print(f"Creating new Pinecone index: {PINECONE_INDEX_NAME}")    
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=EMBEDDING_DIMENSION,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )   
        print(f"Index {PINECONE_INDEX_NAME} created successfully")
    else:
        print(f"Index {PINECONE_INDEX_NAME} already exists")            

# Function to upload the metadata's embeddings to Pinecone
def upload_to_pinecone(csv_path):
    """
    Process gfg articles metadata from CSV, generate embeddings, and upload to Pinecone
    
    Args:
        csv_path (str): Path to the CSV file with blog data
    """
    # Load and preprocess data
    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df)} rows from CSV")

    # Add an id column to the dataframe
    df['id'] = range(1, len(df) + 1) # this is the id of the article
    
    # Make sure Pinecone index exists
    create_pinecone_index()
    
    # Connect to the index
    index = pc.Index(PINECONE_INDEX_NAME)
    
    # Generate embeddings for the merged_info column
    print("Generating embeddings for blog data...")
    texts = df['content'].tolist()
    embeddings = get_batch_embeddings(texts)
    
    # Prepare data for Pinecone
    vectors_to_upsert = []
    for i, (_, row) in enumerate(df.iterrows()):
        vector = {
            'id': str(row['id']),
            'values': embeddings[i],
            'metadata': {
                'title': row['title'],
                'url': row['url'],
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

# Function to get embeddings for a batch of texts
def get_batch_embeddings(texts, batch_size=100, token_limit=10000):
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
        batch = [str(text)[500:token_limit-500] if text is not None else "" for text in batch]

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
