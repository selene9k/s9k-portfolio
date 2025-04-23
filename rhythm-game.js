// Game state variables
let gameActive = false;
let score = 0;
let combo = 0;
let notes = [];
let lastNoteTime = 0;

// Define available songs
const songs = {
    song1: {
        title: "8 Bit Dream",
        artist: "Tristan Lohengrin",
        url: "https://freemusicarchive.org/music/Tristan_Lohengrin/8_Bit_Dream/8_Bit_Dream"
    }
};

let selectedSong = null;
let audioContext;
let audioBuffer;
let noteTiming = [];
let currentNoteIndex = 0;

// Key mapping
const keyMap = {
    'ArrowLeft': 'left',
    'ArrowDown': 'down',
    'ArrowUp': 'up',
    'ArrowRight': 'right'
};

// Add event listeners for song selection
document.querySelectorAll('.song-option').forEach(button => {
    button.addEventListener('click', function() {
        // Remove selected class from all buttons
        document.querySelectorAll('.song-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selected class to clicked button
        this.classList.add('selected');
        
        // Get the selected song
        const songId = this.dataset.song;
        selectedSong = songs[songId];
        
        // Load the selected song
        loadSong(selectedSong.url);
    });
});

// Add event listeners for game controls
document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('pause-button').addEventListener('click', pauseGame);

// Add touch support for mobile devices
document.querySelectorAll('.arrow-receptor').forEach((receptor, index) => {
    receptor.addEventListener('touchstart', function(e) {
        e.preventDefault(); // Prevent default touch behavior
        if (!gameActive) return;
        
        const direction = Object.values(keyMap)[index];
        receptor.style.transform = 'scale(1.2)';
        
        if (!hitNote(index, direction)) {
            missNote();
        }
    });
    
    receptor.addEventListener('touchend', function(e) {
        e.preventDefault();
        receptor.style.transform = '';
    });
});

// Detect device type
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Adjust game settings based on device
function adjustForDevice() {
    if (isMobile) {
        // Make arrows bigger and more spaced for touch
        document.querySelectorAll('.lane').forEach(lane => {
            lane.style.flex = '0 0 70px';
        });
        
        document.querySelectorAll('.arrow-receptor, .note').forEach(arrow => {
            arrow.style.fontSize = '36px';
        });
        
        // Adjust note speed for mobile
        document.documentElement.style.setProperty('--note-speed', '2.5s');
    }
}

// Call device adjustment on load
window.addEventListener('load', adjustForDevice);

// Handle orientation change
window.addEventListener('orientationchange', function() {
    setTimeout(adjustForDevice, 100);
});

// Prevent default touch behavior to avoid scrolling while playing
document.querySelector('.game-area').addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

// Update the startGame function to include device-specific setup
const originalStartGame = startGame;
startGame = function() {
    if (isMobile) {
        // Show touch instructions
        const instructions = document.createElement('div');
        instructions.className = 'touch-instructions';
        instructions.textContent = 'Tap the arrows to play!';
        document.querySelector('.game-info').appendChild(instructions);
        setTimeout(() => instructions.remove(), 3000);
    }
    originalStartGame();
}

function loadSong(url) {
    // Create audio context if it doesn't exist
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Fetch and decode the audio file
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(buffer => {
            audioBuffer = buffer;
            analyzeMusic(buffer);
            console.log('Song loaded successfully');
        })
        .catch(error => {
            console.error('Error loading song:', error);
            alert('Error loading song. Please try again.');
        });
}

function createNote(direction) {
    const note = document.createElement('div');
    note.className = 'note';
    note.dataset.direction = direction;
    note.textContent = getArrowSymbol(direction);
    note.style.animation = 'noteMove 2s linear';
    return note;
}

function getArrowSymbol(direction) {
    const arrows = {
        'left': '⮜',
        'down': '⮟',
        'up': '⮝',
        'right': '⮞'
    };
    return arrows[direction];
}

function spawnNote(lane, direction) {
    const laneElement = document.querySelectorAll('.lane')[lane];
    const noteContainer = laneElement.querySelector('.note-container');
    const note = createNote(direction);
    noteContainer.appendChild(note);
    
    note.addEventListener('animationend', () => {
        if (note.parentNode) {
            note.parentNode.removeChild(note);
            missNote();
        }
    });
}

function hitNote(lane, direction) {
    const laneElement = document.querySelectorAll('.lane')[lane];
    const notes = laneElement.querySelectorAll('.note');
    const receptor = laneElement.querySelector('.arrow-receptor');
    
    for (const note of notes) {
        const rect = note.getBoundingClientRect();
        const receptorRect = receptor.getBoundingClientRect();
        
        if (Math.abs(rect.top - receptorRect.top) < 30) {
            note.classList.add('hit');
            combo++;
            score += 100 * combo;
            updateScore();
            updateCombo();
            setTimeout(() => {
                if (note.parentNode) {
                    note.parentNode.removeChild(note);
                }
            }, 100);
            return true;
        }
    }
    return false;
}

function updateGame() {
    if (!gameActive) return;
    
    const currentTime = audioContext.currentTime;
    
    // Spawn notes based on the analyzed timing
    while (currentNoteIndex < noteTiming.length && 
           noteTiming[currentNoteIndex] <= currentTime + 2) { // 2 seconds ahead
        const lane = Math.floor(Math.random() * 4);
        const direction = Object.values(keyMap)[lane];
        spawnNote(lane, direction);
        currentNoteIndex++;
    }
    
    requestAnimationFrame(updateGame);
}

function pauseGame() {
    gameActive = !gameActive;
    if (gameActive) {
        requestAnimationFrame(updateGame);
    }
}

function missNote() {
    combo = 0;
    updateCombo();
}

function updateScore() {
    const scoreElement = document.querySelector('.score');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

function updateCombo() {
    const comboElement = document.querySelector('.combo');
    if (comboElement) {
        comboElement.textContent = combo;
    }
}

function analyzeMusic(buffer) {
    // Simple beat detection algorithm
    const sampleRate = buffer.sampleRate;
    const channelData = buffer.getChannelData(0);
    const blockSize = Math.floor(sampleRate / 10); // Analyze 100ms blocks
    const threshold = 0.1; // Adjust this value based on your music
    
    noteTiming = [];
    
    for (let i = 0; i < channelData.length; i += blockSize) {
        let sum = 0;
        for (let j = 0; j < blockSize && i + j < channelData.length; j++) {
            sum += Math.abs(channelData[i + j]);
        }
        const average = sum / blockSize;
        
        if (average > threshold) {
            const time = i / sampleRate;
            noteTiming.push(time);
        }
    }
    
    console.log('Analyzed music, found', noteTiming.length, 'notes');
    
    // Reset game state
    currentNoteIndex = 0;
    score = 0;
    combo = 0;
    updateScore();
    updateCombo();
} 