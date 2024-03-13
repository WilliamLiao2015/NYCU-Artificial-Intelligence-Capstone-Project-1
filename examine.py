import pandas as pd
import json
import numpy as np

# Read the JSON file
with open('../../../data/reviews.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Extract "rating" and "conclusion" fields
ratings = [review['rating'] for review in data]
conclusions = [review['conclusion'] for review in data]

# Create a DataFrame using pandas
df = pd.DataFrame({'rating': ratings, 'conclusion': conclusions})

# Add new attributes for each rating value
ratingAttr = ['Accuracy', 'Objectivity', 'Clarity and Coherence', 'Depth of Analysis', 'Language and Presentation', 'Readability', 'Attractiveness']

def extract_element(series, index):
    try:
        return series[index]
    except IndexError:
        return np.nan

for i in range(7):
    df[ratingAttr[i]] = df['rating'].apply(lambda x: extract_element(x, i))

# Drop rating attribute and nan values row, then convert the values to int
df.drop('rating', axis=1, inplace=True)
df = df.dropna().astype(int)


# Print the DataFrame
print(df)