document.addEventListener('DOMContentLoaded', function() {
    const vinylGallery = document.getElementById('vinyl-gallery');
    const vinyls = document.querySelectorAll('.vinyl');

    // Add click/touch handlers for each vinyl
    vinyls.forEach(vinyl => {
        vinyl.addEventListener('click', handleVinylClick);
        vinyl.addEventListener('touchend', handleVinylClick);
    });

    function handleVinylClick(event) {
        event.preventDefault();
        
        // Remove active class from all vinyls
        vinyls.forEach(v => v.classList.remove('active'));
        
        // Add active class to clicked vinyl
        const vinyl = event.currentTarget;
        vinyl.classList.add('active');

        // Show title
        const title = vinyl.querySelector('.title');
        if (title) {
            title.style.opacity = '1';
        }

        // Add effects to the image
        const img = vinyl.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1.1)';
            img.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 255, 255, 0.1)';
            img.style.filter = 'brightness(1.1)';
            img.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }
    }

    // Reset vinyl when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.vinyl')) {
            resetVinyls();
        }
    });

    function resetVinyls() {
        vinyls.forEach(vinyl => {
            vinyl.classList.remove('active');
            
            const img = vinyl.querySelector('img');
            if (img) {
                img.style.transform = '';
                img.style.boxShadow = '';
                img.style.filter = '';
                img.style.borderColor = '';
            }

            const title = vinyl.querySelector('.title');
            if (title) {
                title.style.opacity = '';
            }
        });
    }
}); 