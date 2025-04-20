// ... existing code ...

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
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryNav = document.querySelector('.gallery-nav');
    const progressBar = document.querySelector('.progress-bar');
    const currentCounter = document.querySelector('.image-counter .current');
    const totalCounter = document.querySelector('.image-counter .total');

    let autoScrollInterval;
    let isUserInteracting = false;
    let lastInteractionTime = Date.now();
    const interactionTimeout = 5000; // Resume auto-scroll after 5 seconds of no interaction
    const scrollSpeed = 1; // Pixels per frame for smooth scrolling

    // Set total count
    totalCounter.textContent = galleryItems.length;

    // Create navigation dots
    galleryItems.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        dot.setAttribute('data-index', index + 1);
        dot.addEventListener('click', () => {
            stopAutoScroll();
            scrollToIndex(index);
            updateActiveState(index + 1);
        });
        galleryNav.appendChild(dot);
    });

    const navDots = document.querySelectorAll('.nav-dot');

    // Intersection Observer for gallery items
    const options = {
        root: galleryContainer,
        threshold: 0.7
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = entry.target.getAttribute('data-index');
                updateUI(index);
            }
        });
    }, options);

    galleryItems.forEach(item => observer.observe(item));

    // Update UI elements
    function updateUI(index) {
        // Update nav dots
        navDots.forEach(dot => dot.classList.remove('active'));
        navDots[index - 1].classList.add('active');

        // Update counter
        currentCounter.textContent = index;

        // Update progress bar
        const progress = (index / galleryItems.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Update active state of gallery items
    function updateActiveState(index) {
        galleryItems.forEach(item => item.classList.remove('active'));
        galleryItems[index - 1].classList.add('active');
    }

    // Smooth scroll to specific index
    function scrollToIndex(index) {
        const item = galleryItems[index];
        const containerWidth = galleryContainer.clientWidth;
        const scrollPosition = item.offsetLeft - (containerWidth - item.offsetWidth) / 2;
        
        galleryContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }

    // Auto-scroll functionality
    function startAutoScroll() {
        if (autoScrollInterval) return;
        
        autoScrollInterval = setInterval(() => {
            if (isUserInteracting) return;
            
            const currentScroll = galleryContainer.scrollLeft;
            const maxScroll = galleryContainer.scrollWidth - galleryContainer.clientWidth;
            
            if (currentScroll >= maxScroll) {
                // Reset to beginning
                galleryContainer.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                // Smooth scroll right
                galleryContainer.scrollBy({
                    left: scrollSpeed,
                    behavior: 'smooth'
                });
            }
        }, 16); // ~60fps
    }

    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
        isUserInteracting = true;
        lastInteractionTime = Date.now();
    }

    function checkResumeAutoScroll() {
        if (Date.now() - lastInteractionTime > interactionTimeout) {
            isUserInteracting = false;
            startAutoScroll();
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const currentIndex = parseInt(currentCounter.textContent);
        
        if (e.key === 'ArrowLeft' && currentIndex > 1) {
            stopAutoScroll();
            scrollToIndex(currentIndex - 2);
            updateActiveState(currentIndex - 1);
        } else if (e.key === 'ArrowRight' && currentIndex < galleryItems.length) {
            stopAutoScroll();
            scrollToIndex(currentIndex);
            updateActiveState(currentIndex + 1);
        }
    });

    // Touch and mouse interaction
    let touchStartX = 0;
    let touchEndX = 0;

    galleryContainer.addEventListener('touchstart', (e) => {
        stopAutoScroll();
        touchStartX = e.touches[0].clientX;
        const index = parseInt(currentCounter.textContent);
        updateActiveState(index);
    }, false);

    galleryContainer.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    }, false);

    galleryContainer.addEventListener('touchend', () => {
        const currentIndex = parseInt(currentCounter.textContent);
        const swipeDistance = touchStartX - touchEndX;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0 && currentIndex < galleryItems.length) {
                scrollToIndex(currentIndex);
                updateActiveState(currentIndex + 1);
            } else if (swipeDistance < 0 && currentIndex > 1) {
                scrollToIndex(currentIndex - 2);
                updateActiveState(currentIndex - 1);
            }
        }

        setTimeout(checkResumeAutoScroll, interactionTimeout);
    }, false);

    // Mouse interaction
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            stopAutoScroll();
            const index = parseInt(item.getAttribute('data-index'));
            updateActiveState(index);
        });

        item.addEventListener('mouseleave', () => {
            setTimeout(checkResumeAutoScroll, interactionTimeout);
        });
    });

    // Scroll interaction
    let scrollTimeout;
    galleryContainer.addEventListener('scroll', () => {
        stopAutoScroll();
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(checkResumeAutoScroll, interactionTimeout);
    });

    // Start auto-scroll on page load
    setTimeout(startAutoScroll, 1000);

    // Initial UI update
    updateUI(1);
});

// ... existing code ...