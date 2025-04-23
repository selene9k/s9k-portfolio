// ASCII Art Generator
class ASCIIArtGenerator {
    constructor() {
        console.log('ASCIIArtGenerator initialized');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.asciiCharacters = '@%#*+=-:. ';
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        console.log('Initializing event listeners');
        const fileInput = document.getElementById('image-upload');
        const fingerprintIcon = document.getElementById('generate-ascii');
        
        console.log('File input found:', !!fileInput);
        console.log('Fingerprint icon found:', !!fingerprintIcon);
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                console.log('File input changed');
                this.handleImageUpload(e);
            });
        }
        
        if (fingerprintIcon) {
            fingerprintIcon.addEventListener('click', () => {
                console.log('Fingerprint icon clicked');
                if (fileInput) {
                    fileInput.click();
                }
            });
        }
    }

    handleImageUpload(event) {
        console.log('Handling image upload');
        const file = event.target.files[0];
        if (!file) {
            console.log('No file selected');
            return;
        }

        console.log('File selected:', file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log('File read successfully');
            const img = new Image();
            img.onload = () => {
                console.log('Image loaded successfully');
                this.processImage(img);
                this.generateASCII();
            };
            img.onerror = (error) => {
                console.error('Error loading image:', error);
            };
            img.src = e.target.result;
        };
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
        };
        reader.readAsDataURL(file);
    }

    processImage(img) {
        console.log('Processing image');
        const preview = document.getElementById('image-preview');
        if (preview) {
            preview.src = img.src;
            preview.style.display = 'block';
            console.log('Preview updated');
        }
    }

    generateASCII() {
        console.log('Generating ASCII art');
        const img = document.getElementById('image-preview');
        if (!img || !img.src) {
            console.error('No image available for ASCII generation');
            alert('Please upload an image first!');
            return;
        }

        try {
            const width = Math.min(img.width, window.innerWidth > 768 ? 100 : 50);
            const scale = width / img.width;
            const height = Math.floor(img.height * scale);

            this.canvas.width = width;
            this.canvas.height = height;
            this.ctx.drawImage(img, 0, 0, width, height);

            const pixels = this.ctx.getImageData(0, 0, width, height).data;
            let ascii = '';

            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    const idx = (i * width + j) * 4;
                    const brightness = Math.floor(
                        (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3
                    );
                    const character = this.getASCIICharacter(brightness);
                    ascii += character;
                }
                ascii += '\n';
            }

            const output = document.getElementById('ascii-output');
            if (output) {
                output.textContent = ascii;
                output.style.display = 'block';
                console.log('ASCII art generated successfully');
            }
        } catch (error) {
            console.error('Error generating ASCII art:', error);
        }
    }

    getASCIICharacter(brightness) {
        const len = this.asciiCharacters.length;
        const index = Math.floor((brightness / 255) * (len - 1));
        return this.asciiCharacters[index];
    }
}

// Initialize the ASCII Art Generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    new ASCIIArtGenerator();
}); 