document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const fadeUpElements = document.querySelectorAll('.fade-up');
    const staggerParents = document.querySelectorAll('.stagger');

    function handleScroll() {
        if (navbar) {
            if (window.scrollY > 50) navbar.classList.add('solid');
            else navbar.classList.remove('solid');
        }

        fadeUpElements.forEach((element) => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (elementPosition < screenPosition) {
                const delay = parseInt(element.getAttribute('data-delay') || 0, 10);
                setTimeout(() => {
                    element.style.animation = 'fadeInUp 0.8s ease forwards';
                }, delay);
            }
        });

        staggerParents.forEach((parent) => {
            const children = Array.from(parent.children);
            const parentTop = parent.getBoundingClientRect().top;
            const trigger = window.innerHeight / 1.2;
            if (parentTop < trigger) {
                children.forEach((child, i) => {
                    child.style.animation = 'harvardFade 0.9s ease forwards';
                    child.style.animationDelay = `${i * 120}ms`;
                });
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach((link) => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const initialHarvard = document.querySelectorAll('.harvard-fade');
    initialHarvard.forEach((el, idx) => {
        el.style.animationDelay = `${idx * 120}ms`;
        el.style.animation = 'harvardFade 0.9s ease forwards';
    });

    // Harvard overlay menu controls
    const backdrop = document.querySelector('.harvard-backdrop');
    const harvardMenu = document.querySelector('.harvard-menu');
    const menuParents = document.querySelectorAll('.menu-parent');
    const hamburgerBtns = document.querySelectorAll('.hamburger');

    function openMenu(triggerBtn) {
        if (!harvardMenu || !backdrop) return;
        harvardMenu.setAttribute('aria-hidden', 'false');
        backdrop.classList.add('show');
        backdrop.hidden = false;
        document.body.style.overflow = 'hidden';
        if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'true');
        if (navbar) navbar.classList.add('open');
        const first = harvardMenu.querySelector('.menu-parent, a');
        if (first) first.focus();
    }

    function closeMenu() {
        if (!harvardMenu || !backdrop) return;
        harvardMenu.setAttribute('aria-hidden', 'true');
        backdrop.classList.remove('show');
        backdrop.hidden = true;
        document.body.style.overflow = '';
        hamburgerBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
        if (navbar) navbar.classList.remove('open');
        menuParents.forEach(mp => {
            mp.setAttribute('aria-expanded', 'false');
            const sub = mp.nextElementSibling;
            if (sub && sub.classList.contains('submenu')) sub.classList.remove('open');
        });
    }

    hamburgerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            if (expanded) closeMenu();
            else openMenu(btn);
        });
    });

    if (backdrop) backdrop.addEventListener('click', () => closeMenu());

    // Accordion submenu behavior: only one open at a time
    menuParents.forEach(mp => {
        mp.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = mp.getAttribute('aria-expanded') === 'true';
            menuParents.forEach(other => {
                if (other !== mp) {
                    other.setAttribute('aria-expanded', 'false');
                    const s = other.nextElementSibling;
                    if (s && s.classList.contains('submenu')) s.classList.remove('open');
                }
            });
            mp.setAttribute('aria-expanded', String(!isOpen));
            const sub = mp.nextElementSibling;
            if (sub && sub.classList.contains('submenu')) {
                if (isOpen) sub.classList.remove('open');
                else sub.classList.add('open');
            }
        });
    });

    // Desktop dropdown behavior
    const navParents = document.querySelectorAll('.nav-parent');
    navParents.forEach(parent => {
        parent.addEventListener('click', (e) => {
            e.preventDefault();
            const isExpanded = parent.getAttribute('aria-expanded') === 'true';
            // Close all other dropdowns
            navParents.forEach(other => {
                if (other !== parent) {
                    other.setAttribute('aria-expanded', 'false');
                    const sub = other.nextElementSibling;
                    if (sub && sub.classList.contains('sub-menu')) {
                        sub.classList.remove('open');
                    }
                }
            });
            // Toggle this one
            parent.setAttribute('aria-expanded', String(!isExpanded));
            const sub = parent.nextElementSibling;
            if (sub && sub.classList.contains('sub-menu')) {
                if (isExpanded) sub.classList.remove('open');
                else sub.classList.add('open');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item')) {
            navParents.forEach(parent => {
                parent.setAttribute('aria-expanded', 'false');
                const sub = parent.nextElementSibling;
                if (sub && sub.classList.contains('sub-menu')) {
                    sub.classList.remove('open');
                }
            });
        }
    });

    if (harvardMenu) {
        const menuLinks = harvardMenu.querySelectorAll('a');
        menuLinks.forEach(a => a.addEventListener('click', () => closeMenu()));
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const hidden = harvardMenu ? harvardMenu.getAttribute('aria-hidden') === 'true' : true;
            if (!hidden) closeMenu();
        }
    });
});