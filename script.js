document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isOpened = navToggle.getAttribute('aria-expanded') === 'true';
            
            navToggle.setAttribute('aria-expanded', !isOpened);
            primaryNav.classList.toggle('open');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = !isOpened ? 'hidden' : '';
        });

        // Close mobile nav when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                primaryNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!primaryNav.contains(e.target) && !navToggle.contains(e.target) && primaryNav.classList.contains('open')) {
                navToggle.setAttribute('aria-expanded', 'false');
                primaryNav.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // 2. Header Style on Scroll
    const header = document.querySelector('.header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // 3. Scrollspy: Highlight Active Nav Link
    const sections = document.querySelectorAll('section[id]');
    
    const scrollActive = () => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            // 80px offset for the fixed header
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const targetNavLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (targetNavLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    targetNavLink.classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', scrollActive);
    scrollActive(); // Initial check

    // 4. Scroll Animations (Intersection Observer)
    const animationElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    
    const animationOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, animationOptions);

    animationElements.forEach(el => {
        animationObserver.observe(el);
    });

    // 5. Smooth Scroll for Anchor Links (Double check / polyfill behavior)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 6. WhatsApp Floating Button Footer Collision Prevention
    const whatsappFloat = document.querySelector('.whatsapp-float');
    const footer = document.querySelector('.footer');
    const cookieConsent = document.getElementById('cookie-consent');

    const adjustWhatsappButton = () => {
        if (!whatsappFloat || !footer) return;

        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const baseBottom = window.innerWidth >= 768 ? 30 : 24;
        let additionalOffset = 0;

        // If cookie consent banner is visible, raise the button on mobile
        if (cookieConsent && !cookieConsent.classList.contains('hidden') && window.innerWidth < 768) {
            const cookieRect = cookieConsent.getBoundingClientRect();
            additionalOffset += cookieRect.height + 12;
        }

        // If the footer is visible in the viewport
        if (footerRect.top < windowHeight) {
            const visibleFooterHeight = windowHeight - footerRect.top;
            whatsappFloat.style.bottom = `${baseBottom + visibleFooterHeight + additionalOffset}px`;
        } else {
            whatsappFloat.style.bottom = `${baseBottom + additionalOffset}px`;
        }
    };

    if (whatsappFloat && footer) {
        window.addEventListener('scroll', adjustWhatsappButton);
        window.addEventListener('resize', adjustWhatsappButton);
        adjustWhatsappButton(); // Run initially
    }

    // 7. Cookie Consent Logic
    if (cookieConsent) {
        const acceptBtn = document.getElementById('cookie-accept');
        const rejectBtn = document.getElementById('cookie-reject');

        // Check localStorage
        const consent = localStorage.getItem('zeitz_cookies_accepted');
        if (!consent) {
            setTimeout(() => {
                cookieConsent.classList.remove('hidden');
                adjustWhatsappButton(); // Recalculate button offset once banner appears
            }, 1500);
        }

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('zeitz_cookies_accepted', 'true');
                cookieConsent.classList.add('hidden');
                setTimeout(adjustWhatsappButton, 400); // Recalculate after transition finishes
            });
        }

        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => {
                localStorage.setItem('zeitz_cookies_accepted', 'false');
                cookieConsent.classList.add('hidden');
                setTimeout(adjustWhatsappButton, 400); // Recalculate after transition finishes
            });
        }
    }

    // 8. Legal Modals Logic (Privacy Policy & Terms)
    const openPrivacidade = document.getElementById('open-privacidade');
    const openTermos = document.getElementById('open-termos');
    const cookiePrivacyLink = document.getElementById('cookie-privacy-link');
    const modalPrivacidade = document.getElementById('modal-privacidade');
    const modalTermos = document.getElementById('modal-termos');

    const openModal = (modal) => {
        if (!modal) return;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('open');
        // Only release scroll lock if mobile nav menu is not open
        const primaryNav = document.querySelector('.nav-menu');
        if (!primaryNav || !primaryNav.classList.contains('open')) {
            document.body.style.overflow = '';
        }
    };

    if (openPrivacidade && modalPrivacidade) {
        openPrivacidade.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(modalPrivacidade);
        });
    }

    if (cookiePrivacyLink && modalPrivacidade) {
        cookiePrivacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(modalPrivacidade);
        });
    }

    if (openTermos && modalTermos) {
        openTermos.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(modalTermos);
        });
    }

    // Close buttons event
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeModal(modalPrivacidade);
            closeModal(modalTermos);
        });
    });

    // Close modal clicking outside the card
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });
});
