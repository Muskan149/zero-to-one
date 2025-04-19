# import getBatchEmbeddings and cosineSimilarity from similaritysearch.js
# input takes a query
# first serve all the ids and descriptions from src/utils/scrapers/website_metadata_merged.csv as a dictionary
# get embeggings for all the descriptions
# given the query, run similarity search on the query and all the descriptions
# return the descriptions and id with the top 3 cosineSimilarity scores

import pandas as pd   
import os  
import pickle 
from typing import List, Dict, Tuple, Any

# We'll need to use a Python equivalent of the JS functions you mentioned
# For this example, I'll assume we have a Python module that wraps these JS functions
from similarity_search import get_batch_embeddings, cosine_similarity

def returnWebResults(query: str, embedding_cache_path: str = "description_embeddings.pkl") -> List[Dict[str, Any]]:
    """
    Return top 3 web results based on cosine similarity between query and website descriptions.
    
    Args:
        query: The search query
        embedding_cache_path: Path to save/load embeddings cache
    
    Returns:
        List of dictionaries containing the top 3 results with their ids, descriptions, and similarity scores
    """
    # Check if we have cached embeddings
    descriptions_data = {}
    description_embeddings = {}
    
    # Load website metadata
    csv_path = "src/utils/scrapers/website_metadata_merged.csv"
    df = pd.read_csv(csv_path)
    
    # Convert to dictionary format
    descriptions_data = {row['id']: row['description'] for _, row in df.iterrows()}
    
    # Check if embeddings cache exists
    if os.path.exists(embedding_cache_path):
        # Load cached embeddings
        with open(embedding_cache_path, 'rb') as f:
            description_embeddings = pickle.load(f)
        
        # Check if we need to add any new descriptions that weren't cached
        missing_ids = set(descriptions_data.keys()) - set(description_embeddings.keys())
        if missing_ids:
            new_descriptions = {id: descriptions_data[id] for id in missing_ids}
            new_embeddings = get_batch_embeddings(list(new_descriptions.values()))
            
            # Add new embeddings to our cache
            for i, id in enumerate(new_descriptions.keys()):
                description_embeddings[id] = new_embeddings[i]
            
            # Save updated cache
            with open(embedding_cache_path, 'wb') as f:
                pickle.dump(description_embeddings, f)
    else:
        # Generate embeddings for all descriptions
        all_descriptions = list(descriptions_data.values())
        all_embeddings = get_batch_embeddings(all_descriptions)
        
        # Create dictionary mapping ids to embeddings
        description_embeddings = {id: all_embeddings[i] for i, id in enumerate(descriptions_data.keys())}
        
        # Save embeddings cache
        with open(embedding_cache_path, 'wb') as f:
            pickle.dump(description_embeddings, f)
    
    # Get embedding for the query
    query_embedding = get_batch_embeddings([query])[0]
    
    # Calculate similarity scores for all descriptions
    similarity_scores = []
    for id, embedding in description_embeddings.items():
        score = cosine_similarity(query_embedding, embedding)
        similarity_scores.append((id, score))
    
    # Sort by similarity score in descending order and get top 3
    top_results = sorted(similarity_scores, key=lambda x: x[1], reverse=True)[:3]
    
    # Format results
    results = []
    for id, score in top_results:
        results.append({
            "id": id,
            "description": descriptions_data[id],
            "similarity_score": score
        })
    
    return results