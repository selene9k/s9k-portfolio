// Gallery Animation
document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const progressBar = document.querySelector('.progress-bar');
    const currentCounter = document.querySelector('.current');
    const totalCounter = document.querySelector('.total');
    
    let currentIndex = 0;
    const slideInterval = 3000; // 3 seconds per slide
    let slideTimer;

    // Initialize counters
    if (totalCounter) totalCounter.textContent = galleryItems.length;
    if (currentCounter) currentCounter.textContent = currentIndex + 1;

    function updateProgress() {
        if (progressBar) {
            const progress = ((currentIndex + 1) / galleryItems.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    function showSlide(index) {
        galleryItems.forEach((item, i) => {
            item.style.transform = `translateX(${100 * (i - index)}%)`;
        });
        
        if (currentCounter) currentCounter.textContent = index + 1;
        updateProgress();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        showSlide(currentIndex);
    }

    function startSlideshow() {
        slideTimer = setInterval(nextSlide, slideInterval);
    }

    function pauseSlideshow() {
        clearInterval(slideTimer);
    }

    // Initialize first slide
    showSlide(0);

    // Start automatic slideshow
    startSlideshow();

    // Pause on hover
    if (galleryGrid) {
        galleryGrid.addEventListener('mouseenter', pauseSlideshow);
        galleryGrid.addEventListener('mouseleave', startSlideshow);
    }

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    galleryGrid.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        pauseSlideshow();
    }, { passive: true });

    galleryGrid.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > 50) { // Minimum swipe distance
            if (difference > 0) {
                // Swipe left
                currentIndex = (currentIndex + 1) % galleryItems.length;
            } else {
                // Swipe right
                currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            }
            showSlide(currentIndex);
        }
        startSlideshow();
    }, { passive: true });
});

// Logo click animation
document.addEventListener('DOMContentLoaded', function() {
    const logoImages = document.querySelectorAll('.logo img');
    
    logoImages.forEach(img => {
        img.addEventListener('click', function() {
            this.classList.add('zoomed');
            
            // Remove the zoomed class after animation completes
            setTimeout(() => {
                this.classList.remove('zoomed');
            }, 300);
        });
    });
});

// PDF Viewer Functionality
document.addEventListener('DOMContentLoaded', function() {
    const pdfContainer = document.querySelector('.pdf-container');
    const overlay = document.querySelector('.overlay') || document.createElement('div');
    
    if (!document.querySelector('.overlay')) {
        overlay.classList.add('overlay');
        document.body.appendChild(overlay);
    }

    if (pdfContainer) {
        pdfContainer.addEventListener('click', function() {
            this.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', function() {
            pdfContainer.classList.remove('active');
            this.classList.remove('active');
        });
    }
});

// Video interaction functionality
document.addEventListener('DOMContentLoaded', function() {
    const videoItems = document.querySelectorAll('.video-item');
    
    function handleVideoInteraction(item, isActive) {
        const row = item.closest('.video-row');
        
        if (isActive) {
            item.classList.add('active');
            row.classList.add('has-active');
        } else {
            item.classList.remove('active');
            row.classList.remove('has-active');
        }
    }
    
    videoItems.forEach(item => {
        // Mouse events
        item.addEventListener('mouseenter', function() {
            handleVideoInteraction(this, true);
        });
        
        item.addEventListener('mouseleave', function() {
            handleVideoInteraction(this, false);
        });
        
        // Touch events
        let touchTimeout;
        
        item.addEventListener('touchstart', function(e) {
            e.preventDefault();
            clearTimeout(touchTimeout);
            
            // Remove active state from all other videos
            videoItems.forEach(video => {
                if (video !== this) {
                    handleVideoInteraction(video, false);
                }
            });
            
            handleVideoInteraction(this, true);
        });
        
        item.addEventListener('touchend', function(e) {
            e.preventDefault();
            
            // Keep the effect for a moment after touch
            touchTimeout = setTimeout(() => {
                handleVideoInteraction(this, false);
            }, 1500); // Effect remains for 1.5 seconds after touch
        });
    });
});

// Helper function to create overlay
function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'video-overlay';
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', function() {
        const activeVideo = document.querySelector('.video-item.active');
        const activePdf = document.querySelector('.pdf-container.active');
        
        if (activeVideo) activeVideo.classList.remove('active');
        if (activePdf) activePdf.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    return overlay;
}

// Logo animation
document.addEventListener('DOMContentLoaded', function() {
    const homeLogo = document.querySelector('.home-logo-link img');
    if (homeLogo) {
        homeLogo.addEventListener('mouseover', function() {
            this.style.animation = 'none';
        });
        
        homeLogo.addEventListener('mouseout', function() {
            this.style.animation = 'glowPulse 3s infinite';
        });
    }
});

// PDF Viewer functionality
document.addEventListener('DOMContentLoaded', function() {
    const pdfViewer = document.getElementById('pdfViewer');
    const pdfLoading = document.getElementById('pdfLoading');
    const pdfFallback = document.getElementById('pdfFallback');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const pdfWrapper = document.getElementById('pdfWrapper');
    const pdfViewerContainer = document.getElementById('pdfViewerContainer');

    // Check if device is mobile - REMOVE THIS CHECK
    // const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Function to handle PDF load
    window.handlePdfLoad = function() {
        // REMOVE MOBILE-SPECIFIC LOGIC
        // const pdfFallbackLink = document.getElementById('pdfFallbackLink');
        // const fullPdfPath = window.location.origin + '/your-pdf-file.pdf';

        // if (isMobile) {
        //     // On mobile, set the fallback link and show the fallback message
        //     const viewerUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(fullPdfPath)}`;
        //     if(pdfFallbackLink) pdfFallbackLink.href = viewerUrl;

        //     // Show fallback immediately instead of trying iframe which might fail silently
        //     pdfLoading.style.display = 'none';
        //     if (pdfFallback) pdfFallback.style.display = 'flex'; // Check if fallback exists
        //     pdfViewer.style.display = 'none';
        //     return;
        // }
        
        // Always try to show iframe on successful load
        pdfLoading.style.display = 'none';
        if (pdfFallback) pdfFallback.style.display = 'none'; // Hide fallback if it exists
        pdfViewer.style.display = 'block';
    };

    // Function to handle PDF load error (for iframe)
    window.handlePdfError = function() {
        console.log('Iframe PDF load error. Potentially show fallback if needed.');
        // Optionally, implement a fallback here if the iframe fails everywhere
        // For now, just hide loading and ensure iframe is hidden
        pdfLoading.style.display = 'none';
        pdfViewer.style.display = 'none';
        // If you re-add a fallback mechanism, show it here:
        // if (pdfFallback) pdfFallback.style.display = 'flex'; 
    };

    // Check if PDF exists and is accessible
    function checkPDF() {
        const pdfUrl = '/your-pdf-file.pdf'; // Use root path
        // REMOVE MOBILE-SPECIFIC LOGIC
        // const pdfFallbackLink = document.getElementById('pdfFallbackLink');
        // const fullPdfPath = window.location.origin + pdfUrl;

        // if (isMobile) {
        //      // On mobile, immediately set fallback link and show fallback section
        //     const viewerUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(fullPdfPath)}`;
        //     if(pdfFallbackLink) pdfFallbackLink.href = viewerUrl;
        //     pdfLoading.style.display = 'none';
        //     if (pdfFallback) pdfFallback.style.display = 'flex'; // Check if fallback exists
        //     pdfViewer.style.display = 'none';
        //     return; // Don't attempt iframe load on mobile
        // }
        
        // Always set the iframe src
        // The onload/onerror handlers attached in HTML will manage visibility
        pdfViewer.src = pdfUrl + '#view=FitH&toolbar=0&navpanes=0&scrollbar=0';

        // Optional timeout for loading indicator
        // setTimeout(() => {
        //     if (pdfLoading.style.display !== 'none') {
        //        console.log("PDF loading timeout, triggering error handler.");
        //        handlePdfError(); 
        //     }
        // }, 8000); 
    }

    // Add error handling (already attached in HTML via onerror)
    // pdfViewer.addEventListener('error', handlePdfError);

    // Fullscreen functionality
    fullscreenBtn.addEventListener('click', function() {
        if (!document.fullscreenElement) {
            pdfWrapper.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });

    // Start checking PDF
    checkPDF();
});

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const headerRight = document.querySelector('.header-right');
    const body = document.body;

    if (mobileMenuToggle && headerRight) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            headerRight.classList.toggle('active');
            body.style.overflow = headerRight.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!headerRight.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                mobileMenuToggle.classList.remove('active');
                headerRight.classList.remove('active');
                body.style.overflow = '';
            }
        });

        // Close menu when clicking on a link
        const navLinks = headerRight.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                headerRight.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }
});

// Art Gallery Functionality
document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.gallery-container');
    const galleryGrid = document.querySelector('.gallery-grid');
    const progressBar = document.querySelector('.progress-bar');
    const currentCounter = document.querySelector('.image-counter .current');
    const totalCounter = document.querySelector('.image-counter .total');

    // Clone items for infinite loop
    const items = document.querySelectorAll('.gallery-item');
    const itemWidth = items[0].offsetWidth;
    const gap = 20;
    
    // Clone first set of items
    items.forEach(item => {
        const clone = item.cloneNode(true);
        galleryGrid.appendChild(clone);
    });

    const allItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;
    let isAnimating = true;
    let animationFrame;
    let currentTranslate = 0;
    const slideSpeed = 1; // Pixels per frame

    // Set total count
    if (totalCounter) totalCounter.textContent = items.length;

    // Create navigation dots
    const galleryNav = document.querySelector('.gallery-nav');
    items.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        dot.setAttribute('data-index', index);
        dot.addEventListener('click', () => {
            jumpToSlide(index);
        });
        galleryNav.appendChild(dot);
    });

    function updateUI(index) {
        // Update nav dots
        document.querySelectorAll('.nav-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Update counter
        if (currentCounter) {
            currentCounter.textContent = index + 1;
        }

        // Update progress bar
        if (progressBar) {
            const progress = ((index + 1) / items.length) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Update center state
        allItems.forEach(item => item.classList.remove('center'));
        const centerIndex = Math.floor(allItems.length / 2);
        allItems[centerIndex].classList.add('center');
    }

    function animate() {
        if (!isAnimating) return;

        currentTranslate -= slideSpeed;
        const totalWidth = itemWidth + gap;

        if (Math.abs(currentTranslate) >= totalWidth) {
            currentTranslate = 0;
            galleryGrid.style.transform = `translateX(0)`;
            
            // Move first item to end
            const firstItem = galleryGrid.firstElementChild;
            galleryGrid.appendChild(firstItem);
            
            // Update index
            currentIndex = (currentIndex + 1) % items.length;
            updateUI(currentIndex);
        } else {
            galleryGrid.style.transform = `translateX(${currentTranslate}px)`;
        }

        animationFrame = requestAnimationFrame(animate);
    }

    function jumpToSlide(index) {
        // Calculate difference between current and target index
        const diff = index - currentIndex;
        if (diff === 0) return;

        // Move items in the grid
        if (diff > 0) {
            for (let i = 0; i < diff; i++) {
                const firstItem = galleryGrid.firstElementChild;
                galleryGrid.appendChild(firstItem);
            }
        } else {
            for (let i = 0; i < Math.abs(diff); i++) {
                const lastItem = galleryGrid.lastElementChild;
                galleryGrid.prepend(lastItem);
            }
        }

        currentIndex = index;
        currentTranslate = 0;
        galleryGrid.style.transform = `translateX(0)`;
        updateUI(currentIndex);
    }

    // Start animation
    animate();

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            const prevIndex = (currentIndex - 1 + items.length) % items.length;
            jumpToSlide(prevIndex);
        } else if (e.key === 'ArrowRight') {
            const nextIndex = (currentIndex + 1) % items.length;
            jumpToSlide(nextIndex);
        }
    });

    // Initial UI update
    updateUI(currentIndex);
});

// Initialize Swiper
document.addEventListener('DOMContentLoaded', function() {
    const swiper = new Swiper('.swiper', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        
        // Responsive breakpoints
        breakpoints: {
            // when window width is >= 320px
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            // when window width is >= 768px
            768: {
                slidesPerView: 1,
                spaceBetween: 30
            },
            // when window width is >= 1024px
            1024: {
                slidesPerView: 1,
                spaceBetween: 40
            }
        }
    });
});

// ... existing code ...