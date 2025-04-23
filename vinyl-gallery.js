document.addEventListener('DOMContentLoaded', function() {
    const vinylGallery = document.getElementById('vinyl-gallery');
    const vinyls = document.querySelectorAll('.vinyl');
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let isScrolling = false;
    let activeVinyl = null;

    // Apply to all screen sizes
    // Touch events
    vinylGallery.addEventListener('touchstart', handleTouchStart, { passive: false });
    vinylGallery.addEventListener('touchmove', handleTouchMove, { passive: false });
    vinylGallery.addEventListener('touchend', handleTouchEnd);

    // Mouse events
    vinylGallery.addEventListener('mousedown', handleTouchStart);
    vinylGallery.addEventListener('mousemove', handleTouchMove);
    vinylGallery.addEventListener('mouseup', handleTouchEnd);
    vinylGallery.addEventListener('mouseleave', handleTouchEnd);

    function handleTouchStart(event) {
        if (event.type === 'touchstart') {
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        } else {
            startX = event.clientX;
            startY = event.clientY;
        }
        
        isDragging = true;
        isScrolling = false;

        // Find the clicked/touched vinyl
        const vinyl = event.target.closest('.vinyl');
        if (vinyl) {
            activeVinyl = vinyl;
        }
    }

    function handleTouchMove(event) {
        if (!isDragging) return;

        const currentX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
        const currentY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY;
        
        const deltaX = Math.abs(currentX - startX);
        const deltaY = Math.abs(currentY - startY);

        // Determine if user is trying to scroll vertically
        if (!isScrolling && deltaY > deltaX && deltaY > 10) {
            isScrolling = true;
            isDragging = false;
            return;
        }

        // If we're dragging horizontally, prevent scrolling
        if (isDragging && !isScrolling) {
            event.preventDefault();
        }
    }

    function handleTouchEnd(event) {
        if (!isDragging || isScrolling) return;

        isDragging = false;
        
        if (activeVinyl) {
            // Remove active class from all vinyls
            vinyls.forEach(v => v.classList.remove('active'));
            
            // Add active class to the touched vinyl
            activeVinyl.classList.add('active');

            // Trigger hover effect
            const currentTransform = activeVinyl.style.transform;
            activeVinyl.style.transform = 'translateY(-15px) scale(1.1)';
            activeVinyl.style.zIndex = '2';

            // Show title
            const title = activeVinyl.querySelector('.title');
            if (title) {
                title.style.opacity = '1';
                title.style.bottom = '-40px';
            }

            // Add hover effect to the image
            const img = activeVinyl.querySelector('img');
            if (img) {
                img.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 255, 255, 0.1)';
                img.style.filter = 'brightness(1.1)';
                img.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }

            // Move subsequent vinyls
            let nextVinyl = activeVinyl.nextElementSibling;
            while (nextVinyl) {
                nextVinyl.style.transform = 'translateX(45px)';
                nextVinyl = nextVinyl.nextElementSibling;
            }
        }
    }

    // Reset vinyl positions when touching/clicking elsewhere
    document.addEventListener('touchstart', function(event) {
        if (!event.target.closest('.vinyl')) {
            resetVinyls();
        }
    });

    document.addEventListener('mousedown', function(event) {
        if (!event.target.closest('.vinyl')) {
            resetVinyls();
        }
    });

    function resetVinyls() {
        vinyls.forEach(vinyl => {
            vinyl.classList.remove('active');
            vinyl.style.transform = '';
            vinyl.style.zIndex = '';
            
            const title = vinyl.querySelector('.title');
            if (title) {
                title.style.opacity = '';
                title.style.bottom = '';
            }

            const img = vinyl.querySelector('img');
            if (img) {
                img.style.boxShadow = '';
                img.style.filter = '';
                img.style.borderColor = '';
            }
        });
    }
}); 