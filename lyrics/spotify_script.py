import json 
import pandas as pd
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from bs4 import BeautifulSoup
import requests

cid ='4ebda78e1f134e1791ca1b3d789b6dff'
secret ='1ed2dbefd00b45cf900db1fd3cc3f76f'

client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret)
sp = spotipy.Spotify(client_credentials_manager = client_credentials_manager)

#insert the URI as a string into the function
def get_album_tracks(uri_info):
    uri = []
    track = []
    duration = []
    explicit = []
    track_number = []
    one = sp.album_tracks(uri_info, limit=50, offset=0, market='US')
    df1 = pd.DataFrame(one)
    
    for i, x in df1['items'].items():
        uri.append(x['uri'])
        track.append(x['name'])
        duration.append(x['duration_ms'])
        explicit.append(x['explicit'])
        track_number.append(x['track_number'])
    
    df2 = pd.DataFrame({
    'uri':uri,
    'track':track,
    'duration_ms':duration,
    'explicit':explicit,
    'track_number':track_number})
    
    return df2

charli_tracks = get_album_tracks('spotify:album:386IqvSuljaZsMjwDGGdLj')
# blonde_df2_metadata = get_track_info(blonde_df1_tracks)
# df1 = merge_frames(blonde_df1_tracks, blonde_df2_metadata)
# lyrics_onto_frame(df1, 'frank ocean')

json_data = charli_tracks.to_json(orient="records", indent=4)

# Write JSON data to a file
with open('charli_spotify.json', 'w') as f:
    f.write(json_data)