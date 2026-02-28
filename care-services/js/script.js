// ========================================
// Navigation and Scroll Effects
// ========================================

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

// Navbar background on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu?.classList.toggle('active');
    });
}

// Close menu when link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    });
});

// ========================================
// Scroll Animation (Fade-up)
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply observer to elements with fade-in-on-scroll class
document.querySelectorAll('.fade-in-on-scroll').forEach(element => {
    observer.observe(element);
});

// ========================================
// Smooth Scroll for Anchor Links
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const offsetTop = target.offsetTop - 70;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Initialize animations on page load
// ========================================

window.addEventListener('load', () => {
    // Trigger fade-up animations for initial elements
    document.querySelectorAll('.fade-up:not(.in-view)').forEach((element, index) => {
        // Already handled by CSS animations
    });
});

// ========================================
// Page visibility for animations
// ========================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - pause animations if needed
    } else {
        // Page is visible - resume animations
    }
});

// ========================================
// Dynamic year for footer (optional)
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    // You can update footer year dynamically if needed
});