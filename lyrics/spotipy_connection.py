cid ='4ebda78e1f134e1791ca1b3d789b6dff'
secret ='1ed2dbefd00b45cf900db1fd3cc3f76f'

client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret)
sp = spotipy.Spotify(client_credentials_manager = client_credentials_manager)