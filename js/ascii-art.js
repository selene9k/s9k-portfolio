document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generate-ascii');
    const imageInput = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const asciiOutput = document.getElementById('ascii-output');

    // Add click event to the fingerprint icon to trigger file input
    generateButton.addEventListener('click', function() {
        imageInput.click();
    });

    // Handle file selection
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                generateASCII(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Function to generate ASCII art
    function generateASCII(imageData) {
        const img = new Image();
        img.onload = function() {
            // Create a canvas to process the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size (adjust for better ASCII art quality)
            const maxWidth = 100;
            const maxHeight = 100;
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
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
        };
        img.src = imageData;
    }
});
