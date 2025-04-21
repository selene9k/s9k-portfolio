// YouTube Player API initialization
let player;
let currentVideoIndex = 0;
let isPlaying = false;
let playlist = [];

// Load YouTube IFrame API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Create YouTube player when API is ready
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '360',
        width: '640',
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'rel': 0,
            'modestbranding': 1,
            'showinfo': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });

    // Load the playlist
    loadPlaylist();
    // Initialize iPod wheel controls
    setupIpodControls();
}

// Load playlist from YouTube
function loadPlaylist() {
    const playlistId = 'PL4W4D8HMjF8tA25TLSKdGu5emlwc-ZR9Y';
    const apiKey = 'AIzaSyBRhA_W6wo1WDD87SDZgypkWzPGCJGYZ2A';
    
    fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                playlist = data.items.map(item => item.snippet.resourceId.videoId);
                // Load the first video
                player.loadVideoById(playlist[0]);
                updateVideoInfo();
            } else {
                console.error('No videos found in playlist');
                // Fallback to a default playlist if needed
                playlist = [
                    'dQw4w9WgXcQ',  // Never Gonna Give You Up
                    'JGwWNGJdvx8',  // Shape of You
                    'OPf0YWhXkTM',  // Uptown Funk
                    'RgKAFK5djSk',  // See You Again
                    'pRpeEdMmmQ0'   // Closer
                ];
                player.loadVideoById(playlist[0]);
            }
        })
        .catch(error => {
            console.error('Error loading playlist:', error);
            // Fallback to default playlist
            playlist = [
                'dQw4w9WgXcQ',  // Never Gonna Give You Up
                'JGwWNGJdvx8',  // Shape of You
                'OPf0YWhXkTM',  // Uptown Funk
                'RgKAFK5djSk',  // See You Again
                'pRpeEdMmmQ0'   // Closer
            ];
            player.loadVideoById(playlist[0]);
        });
}

// Setup iPod wheel controls
function setupIpodControls() {
    const wheelButtons = document.querySelectorAll('.wheel-button');
    
    wheelButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const action = button.classList.contains('play') ? 'togglePlayPause' :
                          button.classList.contains('next') ? 'playNextVideo' :
                          button.classList.contains('prev') ? 'playPreviousVideo' : null;
            
            if (action) {
                window[action]();
            }
        });
    });

    // Add touch events for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    const wheel = document.querySelector('.ipod-wheel');

    wheel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    wheel.addEventListener('touchmove', (e) => {
        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // Horizontal swipe for next/previous
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 50) {
                playNextVideo();
                touchStartX = touchEndX;
            } else if (diffX < -50) {
                playPreviousVideo();
                touchStartX = touchEndX;
            }
        }
        // Vertical swipe for play/pause
        else if (Math.abs(diffY) > 50) {
            if (diffY > 0) {
                togglePlayPause();
                touchStartY = touchEndY;
            }
        }
    });
}

// Player ready event handler
function onPlayerReady(event) {
    console.log('YouTube Player Ready');
    updateProgressBar();
    updateVideoInfo();
}

// Player state change event handler
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        document.getElementById('play-pause-button').textContent = '❚❚';
        document.querySelector('.wheel-button.play').textContent = '❚❚';
        updateProgressBar();
    } else if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
        document.getElementById('play-pause-button').textContent = '▶';
        document.querySelector('.wheel-button.play').textContent = '▶';
    } else if (event.data === YT.PlayerState.ENDED) {
        playNextVideo();
    }
}

// Update progress bar
function updateProgressBar() {
    if (isPlaying) {
        const progress = (player.getCurrentTime() / player.getDuration()) * 100;
        document.getElementById('youtube-progress').style.width = `${progress}%`;
        requestAnimationFrame(updateProgressBar);
    }
}

// Update video information
function updateVideoInfo() {
    const videoData = player.getVideoData();
    document.getElementById('video-title').textContent = videoData.title;
    document.getElementById('channel-name').textContent = videoData.author;
}

// Play next video
function playNextVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % playlist.length;
    player.loadVideoById(playlist[currentVideoIndex]);
    updateVideoInfo();
}

// Play previous video
function playPreviousVideo() {
    currentVideoIndex = (currentVideoIndex - 1 + playlist.length) % playlist.length;
    player.loadVideoById(playlist[currentVideoIndex]);
    updateVideoInfo();
}

// Toggle play/pause
function togglePlayPause() {
    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

// Event listeners
document.getElementById('play-pause-button').addEventListener('click', togglePlayPause);
document.getElementById('next-button').addEventListener('click', playNextVideo);
document.getElementById('prev-button').addEventListener('click', playPreviousVideo);

// Progress bar click handler
document.querySelector('.progress-container').addEventListener('click', (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = (e.pageX - progressBar.offsetLeft) / progressBar.offsetWidth;
    const newTime = clickPosition * player.getDuration();
    player.seekTo(newTime, true);
});

// Toggle menu (placeholder function)
function toggleMenu() {
    console.log('Menu toggled');
    // Implement menu functionality as needed
}

// Add event listener for the menu button
document.querySelector('.wheel-button.menu').addEventListener('click', () => {
    // Implement menu functionality if needed
    console.log('Menu clicked');
}); 