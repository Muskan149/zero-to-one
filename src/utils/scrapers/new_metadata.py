import csv
import pandas as pd

# Option 1: Using pandas (easier to work with)
def add_merged_column_pandas():
    # Read the CSV file
    df = pd.read_csv('website_metadata.csv')
    
    # Create a new column by concatenating the specified columns
    # Adding separators between the content for better readability
    df['merged_info'] = df['name'] + ' | ' + df['description'] + ' | ' + df['keywords']
    
    # Write the updated dataframe to a new CSV
    df.to_csv('website_metadata_merged.csv', index=False)
    
    print("Successfully created website_metadata_merged.csv with the merged_info column")

def add_ids():
    # This function adds ids to the columns of website_metadata_merged.csv

    # Read the CSV file
    df = pd.read_csv('website_metadata_merged.csv')
    
    # Create a new column by concatenating the specified columns
    # Adding separators between the content for better readability
    df['merged_info'] = df['name'] + ' | ' + df['description'] + ' | ' + df['keywords']
    
    # Write the updated dataframe to a new CSV
    df.to_csv('website_metadata_merged.csv', index=False)
    
    print("Successfully created website_metadata_merged.csv with the merged_info column")



# Choose one of the two functions to run
# Option 1 is recommended if you have pandas installed
# Try using pandas first (more robust with encoding issues)
add_merged_column_pandas()
