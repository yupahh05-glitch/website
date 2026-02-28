// Fade-in on scroll using IntersectionObserver (subtle, 0.6s ease)
(function() {
    const items = document.querySelectorAll('.fade-in');
    if (!('IntersectionObserver' in window)) {
        items.forEach(i => i.classList.add('in-view'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // reveal the section
                entry.target.classList.add('in-view');

                // stagger skill cards if present
                const skills = entry.target.querySelectorAll('.skill-card');
                if (skills.length) {
                    skills.forEach((el, i) => setTimeout(() => el.classList.add('in-view'), i * 120));
                }

                // stagger table rows if present
                const rows = entry.target.querySelectorAll('table tbody tr');
                if (rows.length) {
                    rows.forEach((r, i) => setTimeout(() => r.classList.add('in-view'), i * 45));
                }

                io.unobserve(entry.target);
            }
        })
    }, { threshold: 0.12 });
    items.forEach(i => io.observe(i));

    // Smooth image reveal when loaded
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) img.classList.add('loaded');
        else img.addEventListener('load', () => img.classList.add('loaded'));
    });
})();