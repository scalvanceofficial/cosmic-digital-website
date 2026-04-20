/**
 * COSMIC DIGITAL - MULTI-PAGE LOGIC
 * Tracking, Animations, and Navigation
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. TRACKING SYSTEM (Persistent across pages) ---
    const captureTrackingParams = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const trackingFields = [
            'utm_source',
            'utm_medium',
            'utm_campaign',
            'utm_term',
            'gclid'
        ];

        trackingFields.forEach(field => {
            const value = urlParams.get(field);
            if (value) {
                // Store in localStorage to persist across navigation between pages
                localStorage.setItem(`cd_${field}`, value);
                const input = document.getElementById(field);
                if (input) input.value = value;
            } else {
                // Fill from localStorage if present
                const persisted = localStorage.getItem(`cd_${field}`);
                if (persisted) {
                    const input = document.getElementById(field);
                    if (input) input.value = persisted;
                }
            }
        });
    };

    captureTrackingParams();

    // --- 2. HEADER SCROLL EFFECT ---
    const header = document.getElementById('main-header');

    const handleScroll = () => {
        // Some pages start with .scrolled already if they are subpages
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else if (!header.dataset.alwaysScrolled) {
            // Only remove if it's the home page hero area
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                header.classList.remove('scrolled');
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init on load

    // --- 3. ACTIVE NAV LINK HANDLING ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- 4. FORM SUBMISSION (Universal) ---
    const leadForm = document.getElementById('lead-form');
    const formStatus = document.getElementById('form-status');

    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = leadForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // UI Feedback
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            if (formStatus) {
                formStatus.style.display = 'block';
                formStatus.textContent = 'Processing your request...';
                formStatus.style.color = 'var(--text-main)';
            }

            const formData = new FormData(leadForm);
            const data = Object.fromEntries(formData.entries());

            // Replace with Google Apps Script URL
            const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL';

            try {
                if (GOOGLE_SCRIPT_URL.includes('YOUR_GOOGLE_SCRIPT') || GOOGLE_SCRIPT_URL === '') {
                    throw new Error('URL Not Configured');
                }

                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (formStatus) {
                    formStatus.textContent = 'Success! Our team will contact you shortly.';
                    formStatus.style.color = 'var(--accent)';
                }
                leadForm.reset();
                captureTrackingParams(); // Refill from localStorage

            } catch (error) {
                console.error('Submission error:', error);
                if (formStatus) {
                    if (error.message === 'URL Not Configured') {
                        formStatus.textContent = 'Setup Required: Please add your Google Apps Script URL to script.js';
                    } else {
                        formStatus.textContent = 'Oops! Something went wrong. Please try again.';
                    }
                    formStatus.style.color = '#ef4444';
                }
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;

            }
        });
    }

    // --- 5. MOBILE MENU TOGGLE ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-nav-overlay';
    document.body.appendChild(mobileOverlay);

    const mobileDrawer = document.createElement('div');
    mobileDrawer.className = 'mobile-nav-drawer';
    mobileDrawer.innerHTML = `
        <a href="index.html" class="logo">
            <i class="ri-rocket-2-line"></i>
            Cosmic Digital
        </a>
        <div class="mobile-nav-links">
            <a href="index.html">Home</a>
            <a href="about.html">About</a>
            <a href="services.html">Services</a>
            <a href="contact.html">Contact</a>
        </div>
        <a href="contact.html" class="btn btn-primary" style="margin-top: 20px;">Get Consultation</a>
    `;
    document.body.appendChild(mobileDrawer);

    const toggleMenu = (show) => {
        mobileOverlay.classList.toggle('active', show);
        mobileDrawer.classList.toggle('active', show);
        document.body.style.overflow = show ? 'hidden' : '';
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', () => toggleMenu(true));
    }

    mobileOverlay.addEventListener('click', () => toggleMenu(false));

    // Handle Active State in Mobile Menu
    mobileDrawer.querySelectorAll('.mobile-nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
        link.addEventListener('click', () => toggleMenu(false));
    });

    // --- 6. FAQ ACCORDION LOGIC ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other FAQ items
            faqItems.forEach(faq => faq.classList.remove('active'));

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- 7. STATS COUNTER ANIMATION ---
    const stats = document.querySelectorAll('.stat-item h2');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseFloat(target.innerText.replace(/[^0-9.]/g, ''));
                const suffix = target.innerText.replace(/[0-9.]/g, '');
                let curr = 0;
                const duration = 2000;
                const start = performance.now();

                const animate = (time) => {
                    const progress = Math.min((time - start) / duration, 1);
                    curr = progress * countTo;
                    target.innerText = (countTo > 1000 ? curr.toFixed(0) : curr.toFixed(1)) + suffix;
                    if (progress < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(s => observer.observe(s));
});
