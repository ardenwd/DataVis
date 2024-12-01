import csv
from collections import Counter

# File name
input_file = "charli.csv"
output_file = "song_line_counts.csv"

# Dictionary to store song counts
song_counts = Counter()

# Open and process the input file
with open(input_file, 'r', encoding='utf-8') as file:
    reader = csv.reader(file)
    
    for row in reader:
        # Extract the song name from the row
        song = row[2]  # Third column is the song name
        song_counts[song] += 1

# Write the counts to a new CSV file
with open(output_file, 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["Song", "Unique Word Count"])  # Header row
    
    for song, count in song_counts.items():
        writer.writerow([song, count])

print(f"Song line counts have been written to {output_file}")
