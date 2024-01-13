# Make HTTP requests
import requests
# Scrape data from an HTML document
from bs4 import BeautifulSoup
# I/O
import os
# Search and manipulate strings
import re

import lyricsgenius as lg

genius = lg.Genius("daIyb-_De3vGr1zfq8Pwlu7eFu6X6GHrZo1HdThP0gR6TkoNGS5T4DV2dWLZITnS",
                             skip_non_songs=True, remove_section_headers=True)

lyrics = []
album = genius.search_album("Charli", "Charli XCX")
album.save_lyrics()