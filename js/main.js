$(document).ready (function () {

    // Init vars
    var timeout = 60;


    // API Keys
    var lastfm_api_key = '1ca8aa035bb77c75efffd489397c65e0';
    var musixmatch_api_key = 'b46ce3856bfb01d9f0d1e469dd0d8a81';
    
    
    // Get DOM elements
    var user_field = $('[name="lastfm-user"]');
    var lyrics_wrapper = $('.lyrics-wrapper');
    var spotify_sync_link = $('.sync-spotify-action');
    var lastfm_user_field = $('[name="lastfm-user"]');
    var song_title = $('.song-title');
    var artist_title = $('.artist-title');
    var sync_action = $('.sync-action');
    var artist_title = $('.artist-title');
    var sync_action = $('.sync-action');
    var user_title = $('.user-profile-title');
    var user_image = $('.user-profile-image');


    // Retrieve query string
    // @link http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    var qs = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=', 2);
            if (p.length == 1)
                b[p[0]] = "";
            else
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.hash.substr(1).split('&'));



    // Magic
    var sync = function () {

        // Empty last response
        lyrics_wrapper.html ('');
        
        
        // Retrieve user name
        var user = lastfm_user_field.val ();


        // Retrieve recent tracks from LAST.FM account
        $.ajax({
            url: 
                'http://ws.audioscrobbler.com/2.0/' +
                '?method=user.getrecenttracks' + 
                '&user=' + user + 
                '&api_key=' + lastfm_api_key + 
                '&format=json'
            ,
            success: function(response) {
                
                // Notify error to the user
                if ( ! response || ! response.recenttracks || response.error) {
                    return;
                }
                
                
                // Fetch only the first track
                $.each (response.recenttracks.track, function (index, item) {
                
                    // Only the first value it's needed. The following
                    // tracks are ignored
                    if (index != 0) {
                        return true;
                    }
                    
                    
                    // Update song information
                    song_title.html (item.name);
                    artist_title.html (item.artist['#text']);
                    
                    
                    // Retrieve track information in musixmatch
                    $.ajax ({
                        type: "GET",
                        url: "http://api.musixmatch.com/ws/1.1/track.search",
                        data: {
                            'q_artist': item.artist['#text'],
                            'q_track': item.name,
                            'page_size': 10,
                            'page': 1, 
                            's_track_rating': 'desc',
                            'apikey': musixmatch_api_key,
                            'format': 'jsonp'
                        },
                        dataType: "jsonp",
                        jsonpCallback: 'jsonp_callback',
                        contentType: 'application/json',                                
                        success: function (track_response) {
                        
                            // Validate
                            if ( ! track_response || ! track_response.message || ! track_response.message.body) {
                                return;
                            }
                            
                            // Retrieve track information
                            var track = track_response.message.body.track_list[0].track;
                            var track_id = track.track_id;
                            var has_lyrics = track.has_lyrics;
                            
                            
                            // No lyrics?
                            if ( ! has_lyrics) {
                                return;
                            }
                            
                            
                            // Retrieve lyrics
                            $.ajax ({
                                type: "GET",
                                url: "http://api.musixmatch.com/ws/1.1/track.lyrics.get",
                                data: {
                                    'track_id': track_id,
                                    'apikey': musixmatch_api_key,
                                    'format': 'jsonp'
                                },
                                dataType: "jsonp",
                                jsonpCallback: 'jsonp_callback',
                                contentType: 'application/json',                                
                                success: function (lyrics_response) {
                                    
                                    // Get lyrics
                                    var lyrics = lyrics_response.message.body.lyrics.lyrics_body;
                                    
                                    
                                    // Trying to do our best with the unformatted lyrics
                                    // Replace advertisement
                                    lyrics = lyrics.replace ('******* This Lyrics is NOT for Commercial use *******', '');
                                    
                                    
                                    // Trying to force new break line
                                    lyrics = lyrics.split(/(?=[A-Z])/).join("<br />")
                                    
                                    
                                    // Update lyrics
                                    lyrics_wrapper.html (lyrics);
                                    
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    console.log ('error');
                                    console.log ('=============================');
                                    console.log(jqXHR);
                                    console.log(textStatus);
                                    console.log(errorThrown);
                                }                                    
                            });
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log ('error');
                            console.log ('=============================');
                            console.log(jqXHR);
                            console.log(textStatus);
                            console.log(errorThrown);
                        }                                    
                    });
                });
            }
        });            
    }


    // User interface
    var interval = setInterval (function (e) {
        timeout--;
        sync_action.find ('.time-left').html (timeout);
        
        if (timeout <= 0) {
            timeout = 30;
            sync ();
        }
        
    }, 1 * 1000);

    sync_action.click (function (e) {
        sync ();
    });
    sync ();


    // Remember last user
    user_field.change (function (e) {
        
        // Store
        localStorage.user = user_field.val ();
        
        
        // No more to do
        if ( ! user_field.val ()) {
            return;
        }
        
        
        // Retrieve info
        $.ajax({
            url: 
                'http://ws.audioscrobbler.com/2.0/' +
                '?method=user.getinfo' + 
                '&user=' + localStorage.user + 
                '&api_key=' + lastfm_api_key + 
                '&format=json'
            ,
            success: function(response) {
                user_title.html (response.user.name);
                user_image.attr ('src', response.user.image[2]['#text']);            
            }
        });
    }).trigger ('change');
    
    
    // Retrieve if used before
    if (localStorage['user']) {
        user_field.val (localStorage['user']);
    }
    
    
});
