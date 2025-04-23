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
        const sliderHandle = document.querySelector('.slider-handle');
        const slideToGenerate = document.querySelector('.slide-to-generate');
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }
        
        if (sliderHandle && slideToGenerate) {
            this.setupSlider(sliderHandle, slideToGenerate, fileInput);
        }
    }

    setupSlider(sliderHandle, slideToGenerate, fileInput) {
        let isDragging = false;
        let startX;
        let sliderLeft;
        let hasTriggeredUpload = false;

        // Handle mouse/touch events for slider
        sliderHandle.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);

        sliderHandle.addEventListener('touchstart', startDragging, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', stopDragging);

        function startDragging(e) {
            isDragging = true;
            hasTriggeredUpload = false;
            startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
            sliderLeft = sliderHandle.offsetLeft;

            if (e.type === 'touchstart') {
                e.preventDefault();
            }
        }

        function drag(e) {
            if (!isDragging) return;

            e.preventDefault();
            const x = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
            const walk = x - startX;
            let newLeft = sliderLeft + walk;

            const sliderWidth = slideToGenerate.offsetWidth;
            newLeft = Math.max(2, Math.min(newLeft, sliderWidth - 48));
            sliderHandle.style.left = `${newLeft}px`;

            if (newLeft > (sliderWidth * 0.75) && !hasTriggeredUpload) {
                slideToGenerate.classList.add('active');
                triggerImageUpload();
                hasTriggeredUpload = true;
            }
        }

        function stopDragging() {
            if (!isDragging) return;
            isDragging = false;

            const sliderWidth = slideToGenerate.offsetWidth;
            if (sliderHandle.offsetLeft < (sliderWidth * 0.75)) {
                resetSlider();
            }
        }

        function resetSlider() {
            sliderHandle.style.transition = 'left 0.3s ease';
            sliderHandle.style.left = '2px';
            slideToGenerate.classList.remove('active');
            setTimeout(() => {
                sliderHandle.style.transition = '';
            }, 300);
        }

        function triggerImageUpload() {
            if (fileInput) {
                fileInput.click();
            }
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