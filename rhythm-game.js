// Game state variables
let gameActive = false;
let score = 0;
let combo = 0;
let notes = [];
let audioContext = null;
let audioBuffer = null;
let gameLoop = null;
let lastNoteTime = 0;
const NOTE_SPEED = 2; // Seconds to travel from top to bottom
const PERFECT_WINDOW = 0.1; // Timing window in seconds
const SPAWN_INTERVAL = 1.0; // Time between notes in seconds

// Key mappings
const keyMap = {
    'ArrowLeft': 'left',
    'ArrowDown': 'down',
    'ArrowUp': 'up',
    'ArrowRight': 'right'
};

// Available songs
const songs = {
    'song1': {
        title: '8 Bit Dream',
        artist: 'Tristan Lohengrin',
        url: 'path/to/8-bit-dream.mp3'
    }
};

// Initialize audio context
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Load selected song
async function loadSong(songKey) {
    try {
        const response = await fetch(songs[songKey].url);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
        console.error('Error loading song:', error);
    }
}

// Create a note
function createNote(direction) {
    const lane = document.querySelector(`.lane:has([data-direction="${direction}"])`);
    const note = document.createElement('div');
    note.className = 'note';
    note.textContent = getArrowSymbol(direction);
    note.dataset.direction = direction;
    note.style.top = '-80px';
    lane.appendChild(note);
    return note;
}

// Get arrow symbol based on direction
function getArrowSymbol(direction) {
    const symbols = {
        'left': '⮜',
        'down': '⮟',
        'up': '⮝',
        'right': '⮞'
    };
    return symbols[direction];
}

// Spawn a new note
function spawnNote() {
    const directions = ['left', 'down', 'up', 'right'];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const note = createNote(direction);
    const startTime = performance.now();
    notes.push({ element: note, direction, startTime });
}

// Handle note hit
function hitNote(direction, isTouch = false) {
    const receptor = document.querySelector(`[data-direction="${direction}"]`);
    const lane = receptor.closest('.lane');
    
    // Visual feedback for receptor
    receptor.style.transform = 'scale(1.2)';
    receptor.style.color = '#ffffff';
    setTimeout(() => {
        receptor.style.transform = '';
        receptor.style.color = '';
    }, 100);

    // Find closest note in the lane
    const laneNotes = notes.filter(note => 
        note.direction === direction && 
        note.element.closest('.lane') === lane
    );

    if (laneNotes.length > 0) {
        const closestNote = laneNotes[0];
        const timeDiff = Math.abs((performance.now() - closestNote.startTime) / 1000 - NOTE_SPEED);

        if (timeDiff <= PERFECT_WINDOW) {
            // Perfect hit
            score += 100 * (combo + 1);
            combo++;
            showHitIndicator('PERFECT!', 'perfect');
            closestNote.element.classList.add('hit');
            setTimeout(() => closestNote.element.remove(), 100);
            notes = notes.filter(note => note !== closestNote);
        }
    }

    updateDisplay();
}

// Show hit indicator
function showHitIndicator(text, type) {
    const indicator = document.createElement('div');
    indicator.className = `hit-indicator ${type}`;
    indicator.textContent = text;
    document.querySelector('.game-area').appendChild(indicator);
    setTimeout(() => indicator.remove(), 500);
}

// Update score and combo display
function updateDisplay() {
    document.querySelector('.score').textContent = score;
    document.querySelector('.combo').textContent = combo;
}

// Game loop
function updateGame() {
    if (!gameActive) return;

    const currentTime = performance.now();
    
    // Spawn new notes
    if (currentTime - lastNoteTime >= SPAWN_INTERVAL * 1000) {
        spawnNote();
        lastNoteTime = currentTime;
    }

    // Update note positions
    notes.forEach(note => {
        const elapsed = (currentTime - note.startTime) / 1000;
        const progress = elapsed / NOTE_SPEED;
        const yPos = progress * 600; // Game area height
        note.element.style.transform = `translateY(${yPos}px)`;

        // Remove missed notes
        if (progress > 1.2) {
            note.element.classList.add('miss');
            combo = 0;
            showHitIndicator('MISS', 'miss');
            setTimeout(() => note.element.remove(), 100);
            notes = notes.filter(n => n !== note);
            updateDisplay();
        }
    });

    gameLoop = requestAnimationFrame(updateGame);
}

// Start game
function startGame() {
    if (!gameActive) {
        initAudio();
        gameActive = true;
        score = 0;
        combo = 0;
        notes = [];
        lastNoteTime = performance.now();
        updateDisplay();
        updateGame();
    }
}

// Pause game
function pauseGame() {
    gameActive = false;
    if (gameLoop) {
        cancelAnimationFrame(gameLoop);
        gameLoop = null;
    }
    // Clear existing notes
    notes.forEach(note => note.element.remove());
    notes = [];
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Keyboard controls
    document.addEventListener('keydown', (event) => {
        if (gameActive && keyMap[event.key]) {
            event.preventDefault();
            hitNote(keyMap[event.key]);
        }
    });

    // Touch controls
    const receptors = document.querySelectorAll('.arrow-receptor');
    receptors.forEach(receptor => {
        receptor.addEventListener('touchstart', (event) => {
            event.preventDefault();
            if (gameActive) {
                hitNote(receptor.dataset.direction, true);
            }
        });
    });

    // Game controls
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('pause-button').addEventListener('click', pauseGame);

    // Song selection
    document.querySelectorAll('.song-option').forEach(option => {
        option.addEventListener('click', () => {
            const songKey = option.dataset.song;
            document.querySelectorAll('.song-option').forEach(opt => 
                opt.classList.remove('selected'));
            option.classList.add('selected');
            if (audioContext) {
                loadSong(songKey);
            }
        });
    });
});

// Device detection and adjustment
function adjustForDevice() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        // Adjust note speed and timing for mobile
        NOTE_SPEED = 2.5; // Slightly slower for mobile
        PERFECT_WINDOW = 0.15; // Slightly more forgiving timing
        
        // Add touch instructions
        const gameArea = document.querySelector('.game-area');
        if (!document.querySelector('.touch-instructions')) {
            const instructions = document.createElement('div');
            instructions.className = 'touch-instructions';
            instructions.textContent = 'Tap the arrows to play!';
            gameArea.appendChild(instructions);
        }
    }
}

// Call device adjustment on load and orientation change
window.addEventListener('load', adjustForDevice);
window.addEventListener('orientationchange', adjustForDevice); 