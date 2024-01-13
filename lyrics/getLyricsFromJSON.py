import string
import json
import csv
import textblob

# Open JSON file and slice by object
file = open("Lyrics_Charli.json", "r")
data = json.load(file)
tracks = data['tracks']

# now we will open a file for writing
data_file = open('charli.csv', 'w', newline='', encoding="utf-8")

# create the csv writer object
csv_writer = csv.writer(data_file) 

for row in tracks:
    line = row['song']['lyrics']

    # Convert the characters in line to
    # lowercase to avoid case mismatch
    line = line.lower()

    # Remove specific punctuation
    line = line.replace("\n"," ")
    #  line = line.replace(",","")
    # line = line.replace(".","")
    # line = line.replace("\"","")

    # line = line.replace("(","")
    # line = line.replace(")","")
    line = line.translate(str.maketrans('', '', string.punctuation))



    # Split the line into words
    words = line.split(" ")

    # Create a dictionary
    d = dict()

    # Iterate over each word in line
    for word in words:
        # Check if the word is already in dictionary
        if word in d:
            # Increment count of word by 1
            d[word] = d[word] + 1
        else:
            # Add the word to dictionary with count 1
            d[word] = 1

    for data in d:
        csv_writer.writerow([data,d[data],row['song']['title']])

data_file.close()        