// Page Transition Handler
document.addEventListener('DOMContentLoaded', () => {
    // Create transition overlay
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition';
    document.body.appendChild(transitionOverlay);

    // Add page-content class to main content
    const mainContent = document.querySelector('main, .animation-container, .content');
    if (mainContent) {
        mainContent.classList.add('page-content');
        setTimeout(() => {
            mainContent.classList.add('visible');
        }, 100);
    }

    // Handle all internal links
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto:')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.currentTarget.getAttribute('href');
                
                // Start transition
                document.body.classList.add('transitioning');
                transitionOverlay.classList.add('active');

                // Navigate after transition
                setTimeout(() => {
                    window.location.href = target;
                }, 600);
            });
        }
    });

    // Handle browser back/forward
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            transitionOverlay.classList.remove('active');
            document.body.classList.remove('transitioning');
        }
    });
}); 