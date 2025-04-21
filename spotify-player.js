// Spotify Player Configuration
const SPOTIFY_CLIENT_ID = '03a516285448453cba1b56fb1feccaf7';
const SPOTIFY_REDIRECT_URI = window.location.origin + '/callback';
const SPOTIFY_SCOPES = 'streaming user-read-email user-read-private';

let accessToken = null;
let player = null;

// Debug function
function debug(message) {
    console.log(`[Spotify Player] ${message}`);
    document.getElementById('player-status').textContent = message;
}

// Initialize Spotify Web Playback SDK
window.onSpotifyWebPlaybackSDKReady = () => {
    debug('Initializing Spotify Player...');
    
    if (!accessToken) {
        debug('No access token found. Please log in.');
        return;
    }

    try {
        player = new Spotify.Player({
            name: 'S9K Custom Player',
            getOAuthToken: cb => { 
                debug('Getting OAuth token...');
                cb(accessToken); 
            },
            volume: 0.5
        });

        // Error handling
        player.addListener('initialization_error', ({ message }) => { 
            debug(`Failed to initialize: ${message}`);
        });
        
        player.addListener('authentication_error', ({ message }) => { 
            debug(`Failed to authenticate: ${message}`);
        });
        
        player.addListener('account_error', ({ message }) => { 
            debug(`Failed to validate Spotify account: ${message}`);
        });
        
        player.addListener('playback_error', ({ message }) => { 
            debug(`Failed to perform playback: ${message}`);
        });

        // Playback status updates
        player.addListener('player_state_changed', state => {
            if (state) {
                debug('Player state changed');
                updatePlayerUI(state);
            }
        });

        // Ready
        player.addListener('ready', ({ device_id }) => {
            debug(`Ready with Device ID: ${device_id}`);
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
            debug(`Device ID has gone offline: ${device_id}`);
        });

        // Connect to the player
        debug('Connecting to Spotify...');
        player.connect().then(success => {
            if (success) {
                debug('Successfully connected to Spotify!');
            } else {
                debug('Failed to connect to Spotify');
            }
        });

    } catch (error) {
        debug(`Error initializing player: ${error.message}`);
    }
};

// Update player UI based on current state
function updatePlayerUI(state) {
    if (!state) {
        debug('No player state available');
        return;
    }

    try {
        const { current_track, paused } = state.track_window;
        const progress = state.position;
        const duration = current_track.duration_ms;

        // Update track info
        document.getElementById('track-name').textContent = current_track.name;
        document.getElementById('artist-name').textContent = current_track.artists[0].name;
        document.getElementById('album-cover').src = current_track.album.images[0].url;

        // Update progress bar
        const progressPercent = (progress / duration) * 100;
        document.getElementById('progress-bar').style.width = `${progressPercent}%`;

        // Update play/pause button
        document.getElementById('play-pause').textContent = paused ? '▶' : '❚❚';
    } catch (error) {
        debug(`Error updating UI: ${error.message}`);
    }
}

// Player Controls
function togglePlay() {
    if (player) {
        debug('Toggling play/pause');
        player.togglePlay();
    } else {
        debug('Player not initialized');
    }
}

function nextTrack() {
    if (player) {
        debug('Playing next track');
        player.nextTrack();
    } else {
        debug('Player not initialized');
    }
}

function previousTrack() {
    if (player) {
        debug('Playing previous track');
        player.previousTrack();
    } else {
        debug('Player not initialized');
    }
}

function setVolume(volume) {
    if (player) {
        debug(`Setting volume to ${volume}`);
        player.setVolume(volume);
    } else {
        debug('Player not initialized');
    }
}

// Initialize Spotify authentication
function initializeSpotify() {
    debug('Initializing Spotify authentication...');
    const url = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(SPOTIFY_SCOPES)}`;
    window.location.href = url;
}

// Handle authentication callback
if (window.location.hash) {
    try {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        accessToken = params.get('access_token');
        
        if (accessToken) {
            debug('Access token received');
            document.getElementById('login-button').style.display = 'none';
            document.getElementById('player-container').style.display = 'block';
            
            // Remove the hash from URL without refreshing
            history.replaceState(null, null, ' ');
            
            // Initialize player if SDK is ready
            if (typeof Spotify !== 'undefined') {
                window.onSpotifyWebPlaybackSDKReady();
            }
        } else {
            debug('No access token found in URL hash');
        }
    } catch (error) {
        debug(`Error processing authentication: ${error.message}`);
    }
}

// Add event listeners for iPod wheel controls
document.addEventListener('DOMContentLoaded', () => {
    debug('Setting up iPod wheel controls...');
    const wheelButtons = document.querySelectorAll('.wheel-button');
    wheelButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const action = button.classList.contains('play') ? 'togglePlay' :
                          button.classList.contains('next') ? 'nextTrack' :
                          button.classList.contains('prev') ? 'previousTrack' : null;
            
            if (action) {
                debug(`Wheel button clicked: ${action}`);
                window[action]();
            }
        });
    });
}); 