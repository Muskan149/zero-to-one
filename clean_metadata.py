# Load gfg_metadata.csv and clean the metadata column
import pandas as pd
import re

# Define multiple patterns to clean
patterns = [
    r'Like\s+Corporate\s+&\s+Communications\s+Address:.*?Got It !',  # Main advertising block
    r'@GeeksforGeeks.*?All rights reserved',  # Copyright notice
    r'We use cookies.*?Got It !',  # Cookie notice
    r'Advertise with us.*?Contact Us',  # Navigation links
    r'Languages.*?CS Subjects',  # Menu items
    r'Registered Address:.*?201305',  # Address block
]

try:
    # Load the CSV file
    print("Loading CSV file...")
    df = pd.read_csv('gfg_metadata.csv')
    
    # Clean the metadata column using multiple patterns
    print("Cleaning metadata...")
    for pattern in patterns:
        df['metadata'] = df['metadata'].str.replace(pattern, '', regex=True, case=False, flags=re.DOTALL)
    
    # Additional cleaning for any remaining whitespace
    df['metadata'] = df['metadata'].str.strip()
    df['metadata'] = df['metadata'].str.replace(r'\s+', ' ', regex=True)  # Replace multiple spaces with single space
    
    # Save the cleaned metadata to a new file
    print("Saving cleaned data...")
    df.to_csv('gfg_metadata_cleaned.csv', index=False)
    
    print("Cleaned metadata saved to gfg_metadata_cleaned.csv")
    
except FileNotFoundError:
    print("Error: Could not find gfg_metadata.csv")
except Exception as e:
    print(f"An error occurred: {str(e)}")