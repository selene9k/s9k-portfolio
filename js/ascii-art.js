document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generate-ascii');
    const imageInput = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const asciiOutput = document.getElementById('ascii-output');
    const fingerprint = document.querySelector('.fingerprint-icon');

    // Function to handle the file input click
    function triggerFileInput(e) {
        e.preventDefault();
        e.stopPropagation();
        imageInput.click();
    }

    // Add both click and touch events to the fingerprint icon
    fingerprint.addEventListener('click', triggerFileInput);
    fingerprint.addEventListener('touchend', triggerFileInput, { passive: false });

    // Prevent default touch behavior to avoid any conflicts
    fingerprint.addEventListener('touchstart', function(e) {
        e.preventDefault();
    }, { passive: false });

    // Handle file selection
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                generateASCII(e.target.result);
            };
            reader.onerror = function() {
                alert('Error reading file. Please try again.');
            };
            reader.readAsDataURL(file);
        }
    });

    // Function to generate ASCII art
    function generateASCII(imageData) {
        const img = new Image();
        
        img.onload = function() {
            try {
                // Create a canvas to process the image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas size (adjust for better ASCII art quality)
                const maxWidth = 100;
                const maxHeight = 100;
                let width = img.width;
                let height = img.height;
                
                // Calculate aspect ratio preserving dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.floor(height * (maxWidth / width));
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.floor(width * (maxHeight / height));
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw image on canvas
                ctx.drawImage(img, 0, 0, width, height);
                
                // Get image data
                const imageData = ctx.getImageData(0, 0, width, height);
                const data = imageData.data;
                
                // ASCII characters from darkest to lightest
                const asciiChars = '@%#*+=-:. ';
                
                // Generate ASCII art
                let asciiArt = '';
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const offset = (y * width + x) * 4;
                        const r = data[offset];
                        const g = data[offset + 1];
                        const b = data[offset + 2];
                        
                        // Calculate brightness
                        const brightness = (r + g + b) / 3;
                        
                        // Map brightness to ASCII character
                        const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
                        asciiArt += asciiChars[charIndex];
                    }
                    asciiArt += '\n';
                }
                
                // Display ASCII art
                asciiOutput.textContent = asciiArt;
                
                // Scroll to the output
                asciiOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } catch (error) {
                console.error('Error generating ASCII art:', error);
                alert('Error generating ASCII art. Please try again with a different image.');
            }
        };

        img.onerror = function() {
            console.error('Error loading image');
            alert('Error loading image. Please try again with a different image.');
        };

        img.src = imageData;
    }

    // Add visual feedback for touch devices
    if ('ontouchstart' in window) {
        fingerprint.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });

        fingerprint.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    }
});
