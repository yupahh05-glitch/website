/* ===============================================
   SCROLL ANIMATION WITH INTERSECTION OBSERVER
   =============================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Elements to animate on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections (except hero which is already visible)
    const sections = document.querySelectorAll('.section:not(.hero-section)');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Observe overview image and text
    const overviewItems = document.querySelectorAll('.overview-text, .overview-image');
    overviewItems.forEach((item, index) => {
        item.classList.add('fade-in');
        observer.observe(item);
    });

    // Observe lab cards with staggered animation
    const labCards = document.querySelectorAll('.lab-card');
    labCards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease-out ${0.05 * index}s backwards`;
        card.classList.add('card-fade');
        observer.observe(card);
    });

    // Observe stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });

    // Smooth scroll for mobile
    if (window.innerWidth < 768) {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Enhanced hover effects on larger screens
    if (window.innerWidth > 768) {
        const interactiveCards = document.querySelectorAll(
            '.area-card, .lab-card, .stat-card, .res-feature, .facility-item'
        );

        interactiveCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
        });
    }
});

/* Page load animation */
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});

/* Adaptive image loading */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.transition = 'opacity 0.5s ease-in-out';
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => {
        img.style.opacity = '0.8';
        imageObserver.observe(img);
    });
}

/* Handle resize for responsive adjustments */
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Recalculate animations if needed
    }, 250);
});;