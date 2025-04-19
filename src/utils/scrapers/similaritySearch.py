# pip install openai python-dotenv numpy
import os
import numpy as np
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")  # Add your API key to a .env file
)

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
            model="text-embedding-3-small",
            input=text,
            encoding_format="float"  # Returns embeddings as float values
        )
        
        return response.data[0].embedding
    except Exception as e:
        print(f"Error generating embedding: {e}")
        raise


def get_batch_embeddings(texts):
    """
    Generate embeddings for multiple texts in batch
    
    Args:
        texts (list): Array of input texts
        
    Returns:
        list: Array of embedding vectors
    """
    try:
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=texts,
            encoding_format="float"
        )
        
        return [item.embedding for item in response.data]
    except Exception as e:
        print(f"Error generating batch embeddings: {e}")
        raise


def cosine_similarity(embedding_a, embedding_b):
    """
    Calculate cosine similarity between two embedding vectors
    
    Args:
        embedding_a (list): First embedding vector
        embedding_b (list): Second embedding vector
        
    Returns:
        float: Cosine similarity score (between -1 and 1)
    """
    if len(embedding_a) != len(embedding_b):
        raise ValueError("Embeddings must have the same dimensions")
    
    # Convert to numpy arrays for efficient computation
    a = np.array(embedding_a)
    b = np.array(embedding_b)
    
    # Calculate cosine similarity
    dot_product = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    
    if norm_a == 0 or norm_b == 0:
        return 0
    
    return dot_product / (norm_a * norm_b)


def main():
    """
    Example usage
    """
    try:
        # Example 1: Get embedding for a single text
        text = "This is a sample text for embedding generation"
        embedding = get_embedding(text)
        print(f"Single embedding generated with {len(embedding)} dimensions")
        
        # Example 2: Get embeddings for multiple texts
        texts = [
            "OpenAI's text-embedding-3-small model is fast and efficient",
            "Vector embeddings are useful for semantic search",
            "The model generates 1,536 dimensional vectors"
        ]
        embeddings = get_batch_embeddings(texts)
        print(f"Generated {len(embeddings)} embeddings, each with {len(embeddings[0])} dimensions")
        
        # Example 3: Compare similarity between two texts
        text_a = "Machine learning algorithms are fascinating"
        text_b = "Deep learning is an exciting subset of AI"
        embedding_a = get_embedding(text_a)
        embedding_b = get_embedding(text_b)
        similarity = cosine_similarity(embedding_a, embedding_b)
        print(f"Similarity between texts: {similarity:.4f}")
        
    except Exception as e:
        print(f"Error in main function: {e}")


if __name__ == "__main__":
    main()

# Example .env file content:
# OPENAI_API_KEY=your_api_key_here