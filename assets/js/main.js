/**
 * Ristoro Alpino Monte Basso
 * Main JavaScript File
 * Dal 1970 - Casargo (LC)
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const preloader = document.getElementById('preloader');
    const navbar = document.getElementById('mainNav');
    const backToTopBtn = document.getElementById('backToTop');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // ============================================
    // Preloader
    // ============================================
    function hidePreloader() {
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('hide');
            }, 800);
        }
    }

    // ============================================
    // Navbar Scroll Effect
    // ============================================
    function handleNavbarScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ============================================
    // Back to Top Button
    // ============================================
    function handleBackToTop() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ============================================
    // Active Navigation Link
    // ============================================
    function updateActiveNavLink() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // ============================================
    // Smooth Scroll for Navigation
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                if (href !== '#' && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);

                    if (target) {
                        const navHeight = navbar.offsetHeight;
                        const targetPosition = target.offsetTop - navHeight;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });

                        // Close mobile menu if open
                        const navbarCollapse = document.querySelector('.navbar-collapse');
                        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                            if (bsCollapse) {
                                bsCollapse.hide();
                            }
                        }
                    }
                }
            });
        });
    }

    // ============================================
    // Gallery Lightbox
    // ============================================
    function initGalleryLightbox() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const galleryModal = document.getElementById('galleryModal');
        const galleryModalImage = document.getElementById('galleryModalImage');

        if (galleryItems.length && galleryModal && galleryModalImage) {
            galleryItems.forEach(item => {
                item.addEventListener('click', function() {
                    const imgSrc = this.getAttribute('data-img');
                    if (imgSrc) {
                        galleryModalImage.src = imgSrc;
                    }
                });
            });
        }
    }

    // ============================================
    // Toast Notifications
    // ============================================
    function showToast(message, type = 'success') {
        const toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) return;

        const toastId = 'toast-' + Date.now();
        const bgClass = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-info';
        const icon = type === 'success' ? 'bi-check-circle' : type === 'error' ? 'bi-x-circle' : 'bi-info-circle';

        const toastHTML = `
            <div class="toast align-items-center text-white ${bgClass} border-0" role="alert" id="${toastId}">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi ${icon} me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);

        const toastElement = document.getElementById(toastId);
        const bsToast = new bootstrap.Toast(toastElement, { delay: 4000 });
        bsToast.show();

        // Remove toast element after it's hidden
        toastElement.addEventListener('hidden.bs.toast', function() {
            this.remove();
        });
    }

    // Make showToast globally available
    window.showToast = showToast;

    // ============================================
    // Form Validation & Submission
    // ============================================
    function initFormHandlers() {
        // Reservation Form
        const reservationForm = document.getElementById('reservationForm');
        if (reservationForm) {
            reservationForm.addEventListener('submit', function(e) {
                e.preventDefault();

                if (validateForm(this)) {
                    // Simulate form submission
                    const submitBtn = this.querySelector('button[type="submit"]');
                    const originalText = submitBtn.innerHTML;

                    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Invio in corso...';
                    submitBtn.disabled = true;

                    setTimeout(() => {
                        showToast('Richiesta di prenotazione inviata con successo! Vi contatteremo presto.', 'success');
                        this.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 1500);
                }
            });
        }

        // Contact Form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();

                if (validateForm(this)) {
                    const submitBtn = this.querySelector('button[type="submit"]');
                    const originalText = submitBtn.innerHTML;

                    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Invio...';
                    submitBtn.disabled = true;

                    setTimeout(() => {
                        showToast('Messaggio inviato con successo! Grazie per averci contattato.', 'success');
                        this.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 1500);
                }
            });
        }
    }

    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('is-invalid');
            } else {
                field.classList.remove('is-invalid');
            }

            // Email validation
            if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    isValid = false;
                    field.classList.add('is-invalid');
                }
            }

            // Phone validation
            if (field.type === 'tel' && field.value) {
                const phoneRegex = /^[\d\s\+\-\(\)]{8,}$/;
                if (!phoneRegex.test(field.value)) {
                    isValid = false;
                    field.classList.add('is-invalid');
                }
            }
        });

        if (!isValid) {
            showToast('Per favore, compila tutti i campi obbligatori correttamente.', 'error');
        }

        return isValid;
    }

    // ============================================
    // Set Minimum Date for Date Inputs
    // ============================================
    function initDateInputs() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        const today = new Date().toISOString().split('T')[0];

        dateInputs.forEach(input => {
            input.setAttribute('min', today);
        });
    }

    // ============================================
    // Phone Number Formatting
    // ============================================
    function initPhoneFormatting() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');

        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/[^\d\+]/g, '');

                if (value.length > 0 && !value.startsWith('+')) {
                    if (value.startsWith('39')) {
                        value = '+' + value;
                    } else if (value.startsWith('0')) {
                        value = '+39 ' + value.substring(1);
                    }
                }

                e.target.value = value;
            });
        });
    }

    // ============================================
    // Scroll Animations (Intersection Observer)
    // ============================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(el => observer.observe(el));
        } else {
            // Fallback for older browsers
            animatedElements.forEach(el => el.classList.add('animated'));
        }
    }

    // ============================================
    // Lazy Loading Images
    // ============================================
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // ============================================
    // Counter Animation
    // ============================================
    function initCounters() {
        const counters = document.querySelectorAll('.counter-value');

        if ('IntersectionObserver' in window) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        const target = parseInt(counter.getAttribute('data-target'));
                        const duration = 2000;
                        const step = target / (duration / 16);
                        let current = 0;

                        const updateCounter = () => {
                            current += step;
                            if (current < target) {
                                counter.textContent = Math.ceil(current);
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.textContent = target;
                            }
                        };

                        updateCounter();
                        counterObserver.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(counter => counterObserver.observe(counter));
        }
    }

    // ============================================
    // Parallax Effect (for hero section)
    // ============================================
    function initParallax() {
        const heroBg = document.querySelector('.hero-bg');

        if (heroBg && window.innerWidth > 768) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                heroBg.style.transform = `translateY(${scrolled * 0.4}px) scale(1.1)`;
            }, { passive: true });
        }
    }

    // ============================================
    // Event Listeners
    // ============================================
    function initEventListeners() {
        // Window load
        window.addEventListener('load', hidePreloader);

        // Window scroll
        window.addEventListener('scroll', () => {
            handleNavbarScroll();
            handleBackToTop();
            updateActiveNavLink();
        }, { passive: true });

        // Back to top button click
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', scrollToTop);
        }

        // Remove invalid class on input
        document.querySelectorAll('.form-control, .form-select').forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('is-invalid');
            });
        });
    }

    // ============================================
    // Console Branding
    // ============================================
    function consoleBranding() {
        console.log('%c🏔️ Ristoro Alpino Monte Basso', 'font-size: 20px; font-weight: bold; color: #2D5A3D;');
        console.log('%cDal 1970 - Casargo (LC) - 1500m', 'font-size: 12px; color: #8B5A2B;');
        console.log('%cAttività Storica della Lombardia', 'font-size: 11px; color: #C75D24; font-style: italic;');
    }

    // ============================================
    // Initialize All Functions
    // ============================================
    function init() {
        initEventListeners();
        initSmoothScroll();
        initGalleryLightbox();
        initFormHandlers();
        initDateInputs();
        initPhoneFormatting();
        initScrollAnimations();
        initLazyLoading();
        initCounters();
        initParallax();
        consoleBranding();
    }

    // ============================================
    // Run on DOM Ready
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
