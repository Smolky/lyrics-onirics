## Lyrics Orinics - A Mashups application
## Current Web trends 2016-17
# José Antonio García Díaz

The assignment consist in develop a mash-up application. In this case I decided to do a music stuff because is one of my hobbies. I come with the idea of retrieve the lyrics of the songs you are listening on radio.fm (or spotify if the user has the accounts connected)

The application developed has been uploaded to a github repository and  with the current *API_KEY* only works there. The application could be freely downloaded and uploaded on another server but remember changing the API key on the *js/main.js* file

You can visit the application here
https://smolky.github.io/lyrics-onirics/

# Instructions
To use this application you have an lastfm account that you can create here: https://www.last.fm/es/join?next=/es/ (or use mine joseagd).

*TIP*: You can sync your last.fm account with Spotify, so when you listen a song on spotify then the lyrics will be loaded. 
https://support.spotify.com/us/using_spotify/playlists/scrobble-to-last-fm/


Once is all setup the application makes queries to retrieve the following information
- The last songs listened by the user
- The track_id from musixmatch
- The lyrics from musixmatch api

# Restrictions
The free use of the MusixMatch API is restricted to no more than 2K queries and only to fetch the 30% of the lyrics.

# Work to done
The lyrics are poorly formatted. I try to decide where are the new lines splitting the letters in uppercase but a lot of improvements could be done here.

# APIs used
http://www.last.fm/es/api
https://developer.musixmatch.com/

# Architecture
This is a web project that uses the following technologies:
- HTML Boilerplate
- jQuery
- PureCSS

