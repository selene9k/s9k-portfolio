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
        const generateButton = document.getElementById('generate-button');
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }
        
        if (generateButton) {
            generateButton.addEventListener('click', () => this.generateASCII());
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
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    processImage(img) {
        // Preview the uploaded image
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

document.addEventListener('DOMContentLoaded', function() {
    const sliderHandle = document.querySelector('.slider-handle');
    const slideToGenerate = document.querySelector('.slide-to-generate');
    const imageInput = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const asciiOutput = document.getElementById('ascii-output');
    let isDragging = false;
    let startX;
    let sliderLeft;
    let hasTriggeredUpload = false;

    // ASCII characters from dark to light
    const asciiChars = '@%#*+=-:. ';

    // Handle mouse/touch events for slider
    sliderHandle.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    sliderHandle.addEventListener('touchstart', startDragging);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', stopDragging);

    function startDragging(e) {
        isDragging = true;
        hasTriggeredUpload = false;
        startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
        sliderLeft = sliderHandle.offsetLeft;

        // Prevent default behavior for touch events
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

        // Constrain the slider movement
        const sliderWidth = slideToGenerate.offsetWidth;
        newLeft = Math.max(2, Math.min(newLeft, sliderWidth - 48));
        sliderHandle.style.left = `${newLeft}px`;

        // If slider is dragged to the end and hasn't triggered upload yet
        if (newLeft > (sliderWidth * 0.75) && !hasTriggeredUpload) {
            slideToGenerate.classList.add('active');
            triggerImageUpload();
            hasTriggeredUpload = true;
        }
    }

    function stopDragging() {
        if (!isDragging) return;
        isDragging = false;

        // Reset position if not dragged far enough
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
        // Create and show a modal for file upload
        const modal = document.createElement('div');
        modal.className = 'upload-modal';
        modal.innerHTML = `
            <div class="upload-modal-content">
                <h3>Choose Image Source</h3>
                <div class="upload-options">
                    <button class="upload-option mobile-upload">
                        <i class="fas fa-mobile-alt"></i>
                        <span>Take Photo</span>
                    </button>
                    <button class="upload-option desktop-upload">
                        <i class="fas fa-folder-open"></i>
                        <span>Choose File</span>
                    </button>
                </div>
            </div>
        `;

        // Add styles for the modal
        const style = document.createElement('style');
        style.textContent = `
            .upload-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .upload-modal-content {
                background: rgba(255, 255, 255, 0.95);
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                transform: translateY(20px);
                transition: transform 0.3s ease;
            }
            .upload-modal h3 {
                color: #000;
                margin-bottom: 20px;
                font-size: 18px;
                font-weight: 500;
            }
            .upload-options {
                display: flex;
                gap: 20px;
                justify-content: center;
            }
            .upload-option {
                background: none;
                border: 1px solid rgba(0, 0, 0, 0.2);
                padding: 15px 25px;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                transition: all 0.3s ease;
            }
            .upload-option:hover {
                background: rgba(0, 0, 0, 0.05);
                transform: translateY(-2px);
            }
            .upload-option i {
                font-size: 24px;
                color: #000;
            }
            .upload-option span {
                font-size: 14px;
                color: #000;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Fade in the modal
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modal.querySelector('.upload-modal-content').style.transform = 'translateY(0)';
        });

        // Handle upload options
        modal.querySelector('.mobile-upload').addEventListener('click', () => {
            imageInput.setAttribute('capture', 'environment');
            imageInput.click();
            modal.remove();
        });

        modal.querySelector('.desktop-upload').addEventListener('click', () => {
            imageInput.removeAttribute('capture');
            imageInput.click();
            modal.remove();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                resetSlider();
            }
        });
    }

    // Handle image upload and ASCII conversion
    imageInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) {
            resetSlider();
            return;
        }

        // Preview the image
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            
            // Convert to ASCII after image is loaded
            imagePreview.onload = () => {
                convertToAscii(imagePreview);
                // Keep the slider at the end position for 1 second before resetting
                setTimeout(resetSlider, 1000);
            };
        };
        reader.readAsDataURL(file);
    });

    async function convertToAscii(image) {
        // Create canvas to process the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Wait for image to load
        await new Promise(resolve => {
            if (image.complete) {
                resolve();
            } else {
                image.onload = resolve;
            }
        });

        // Set canvas size (adjust these values to control ASCII art size)
        const width = 100;
        const height = Math.floor(width * (image.height / image.width));
        canvas.width = width;
        canvas.height = height;

        // Draw and get image data
        ctx.drawImage(image, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;

        // Convert to ASCII
        let ascii = '';
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const idx = (i * width + j) * 4;
                const brightness = Math.floor(
                    (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3
                );
                const charIndex = Math.floor(
                    (brightness / 255) * (asciiChars.length - 1)
                );
                ascii += asciiChars[charIndex];
            }
            ascii += '\n';
        }

        // Display result with animation
        asciiOutput.style.opacity = '0';
        asciiOutput.textContent = ascii;
        requestAnimationFrame(() => {
            asciiOutput.style.transition = 'opacity 0.5s ease';
            asciiOutput.style.opacity = '1';
        });
    }
}); 