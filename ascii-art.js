// ASCII Art Generator
class ASCIIArtGenerator {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.asciiCharacters = '@%#*+=-:. ';
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const fileInput = document.getElementById('image-upload');
        const fingerprintIcon = document.getElementById('generate-ascii');
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }
        
        if (fingerprintIcon) {
            fingerprintIcon.addEventListener('click', () => {
                if (fileInput) {
                    fileInput.click();
                }
            });
        }
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.processImage(img);
                this.generateASCII();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    processImage(img) {
        const preview = document.getElementById('image-preview');
        if (preview) {
            preview.src = img.src;
            preview.style.display = 'block';
        }
    }

    generateASCII() {
        const img = document.getElementById('image-preview');
        if (!img || !img.src) {
            alert('Please upload an image first!');
            return;
        }

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
    new ASCIIArtGenerator();
}); 