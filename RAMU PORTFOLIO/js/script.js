// Particle System
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = document.getElementById('particles');
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
        this.handleResize();
    }

    createParticles() {
        const particleCount = window.innerWidth < 768 ? 30 : 80;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.8 + 0.2,
                twinkle: Math.random() * 0.02 + 0.01
            });
        }

        this.renderParticles();
    }

    renderParticles() {
        this.container.innerHTML = '';
        
        this.particles.forEach((particle, index) => {
            const particleEl = document.createElement('div');
            particleEl.className = 'particle';
            
            const twinkleOpacity = Math.sin(Date.now() * particle.twinkle + index) * 0.3 + particle.opacity;
            
            particleEl.style.cssText = `
                left: ${particle.x}px;
                top: ${particle.y}px;
                width: ${particle.size}px;
                height: ${particle.size}px;
                opacity: ${Math.max(0.1, twinkleOpacity)};
                background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(79,70,229,0.4) 50%, transparent 100%);
                box-shadow: 0 0 ${particle.size * 2}px rgba(255,255,255,0.3);
            `;
            this.container.appendChild(particleEl);
        });
    }

    animate() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x > window.innerWidth) particle.x = 0;
            if (particle.x < 0) particle.x = window.innerWidth;
            if (particle.y > window.innerHeight) particle.y = 0;
            if (particle.y < 0) particle.y = window.innerHeight;
        });

        this.renderParticles();
        requestAnimationFrame(() => this.animate());
    }

    handleResize() {
        window.addEventListener('resize', utils.debounce(() => {
            this.particles = [];
            this.createParticles();
        }, 250));
    }
}

// Theme Controller
class ThemeController {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    setTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            this.themeIcon.className = 'fas fa-sun';
        } else {
            document.body.classList.remove('light-theme');
            this.themeIcon.className = 'fas fa-moon';
        }
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// Enhanced Mobile Navigation
class MobileNav {
    constructor() {
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        if (!this.mobileMenu || !this.navMenu) return;

        // Toggle mobile menu
        this.mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close menu when clicking on nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.mobileMenu.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        const isActive = this.navMenu.classList.contains('active');
        
        if (isActive) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.navMenu.classList.add('active');
        this.mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Scroll Spy Navigation
class ScrollSpy {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link[data-scroll]');
        this.navbar = document.getElementById('navbar');
        this.init();
    }

    init() {
        this.updateActiveLink();
        this.handleScroll();
        this.handleSmoothScroll();
    }

    updateActiveLink() {
        const scrollPosition = window.scrollY + 100;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-scroll') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    handleScroll() {
        window.addEventListener('scroll', utils.throttle(() => {
            this.updateActiveLink();

            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }, 16));
    }

    handleSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-scroll');
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Typewriter Effect
class TypewriterEffect {
    constructor() {
        this.element = document.getElementById('typewriter');
        this.text = 'RAMA KRISHNA';
        this.speed = 150;
        this.init();
    }

    init() {
        if (!this.element) return;
        
        this.element.textContent = '';
        
        setTimeout(() => {
            this.typeText();
        }, 1000);
    }

    typeText() {
        let i = 0;
        const timer = setInterval(() => {
            this.element.textContent += this.text[i];
            i++;
            
            if (i >= this.text.length) {
                clearInterval(timer);
                setTimeout(() => {
                    this.element.style.borderRight = 'none';
                }, 1000);
            }
        }, this.speed);
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.init();
    }

    init() {
        this.observe();
        this.checkElements();
    }

    observe() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, parseInt(delay));
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(el => observer.observe(el));
    }

    checkElements() {
        this.elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const delay = element.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    element.classList.add('aos-animate');
                }, parseInt(delay));
            }
        });
    }
}

// Skills Animation
class SkillsAnimation {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.init();
    }

    init() {
        this.observe();
    }

    observe() {
        const observer =new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.getAttribute('data-progress');
                    setTimeout(() => {
                        entry.target.style.width = `${progress}%`;
                    }, 300);
                }
            });
        }, {
            threshold: 0.5
        });

        this.skillBars.forEach(bar => observer.observe(bar));
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            this.showSuccessMessage();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.form.reset();
        }, 2000);
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 199, 190, 0.9);
            backdrop-filter: blur(20px);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            z-index: 10000;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            opacity: 0;
            transition: all 0.3s ease;
        `;
        message.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
            <h3 style="margin-bottom: 0.5rem;">Message Sent!</h3>
            <p>Thank you for your message. I'll get back to you soon.</p>
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.style.opacity = '1';
            message.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);

        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                if (document.body.contains(message)) {
                    document.body.removeChild(message);
                }
            }, 300);
        }, 3000);
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeAnimations();
        this.preloadCriticalResources();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    optimizeAnimations() {
        const isLowEndDevice = navigator.hardwareConcurrency < 4 || 
                               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isLowEndDevice) {
            document.body.classList.add('reduced-motion');
            
            const style = document.createElement('style');
            style.textContent = `
                .reduced-motion * {
                    animation-duration: 0.5s !important;
                    transition-duration: 0.3s !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    preloadCriticalResources() {
        const criticalImages = ['/RAMU.jpg'];
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
}

// Cursor Effects
class CursorEffects {
    constructor() {
        this.cursor = null;
        this.cursorFollower = null;
        this.init();
    }

    init() {
        if (window.innerWidth < 1024 || 'ontouchstart' in window) return;

        this.createCursor();
        this.addEventListeners();
    }

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            mix-blend-mode: difference;
        `;
        
        this.cursorFollower = document.createElement('div');
        this.cursorFollower.style.cssText = `
            position: fixed;
            width: 30px;
            height: 30px;
            border: 2px solid rgba(102, 126, 234, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transition: all 0.15s ease;
            transform: translate(-50%, -50%);
        `;

        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorFollower);
    }

    addEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = `${e.clientX - 5}px`;
            this.cursor.style.top = `${e.clientY - 5}px`;
            
            this.cursorFollower.style.left = `${e.clientX}px`;
            this.cursorFollower.style.top = `${e.clientY}px`;
        });

        const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-link, .project-card, .glass-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(1.5)';
                this.cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });

        document.addEventListener('mousedown', () => {
            this.cursor.style.transform = 'scale(0.8)';
            this.cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.8)';
        });

        document.addEventListener('mouseup', () => {
            this.cursor.style.transform = 'scale(1)';
            this.cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }
}

// Page Loading Handler
class PageLoader {
    constructor() {
        this.init();
    }

    init() {
        this.createLoader();
        this.handlePageLoad();
    }

    createLoader() {
        if (document.readyState === 'complete') return;

        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0a0a, #1a1a2e);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.5s ease;
        `;
        
        loader.innerHTML = `
            <div style="text-align: center; color: white;">
                <div class="loader-spinner" style="width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid #4f46e5; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p style="font-family: 'Poppins', sans-serif; font-size: 1.1rem;">Loading Portfolio...</p>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(loader);
    }

    handlePageLoad() {
        window.addEventListener('load', () => {
            const loader = document.getElementById('page-loader');
            if (loader) {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        if (document.body.contains(loader)) {
                            document.body.removeChild(loader);
                        }
                    }, 500);
                }, 100);
            }
        });
    }
}

// Smooth Scroll Polyfill for older browsers
class SmoothScrollPolyfill {
    constructor() {
        this.init();
    }

    init() {
        if (!('scrollBehavior' in document.documentElement.style)) {
            this.polyfill();
        }
    }

    polyfill() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    this.smoothScrollTo(target.offsetTop - 80, 800);
                }
            });
        });
    }

    smoothScrollTo(to, duration) {
        const start = window.pageYOffset;
        const change = to - start;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutQuad(timeElapsed, start, change, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animateScroll);
        };

        requestAnimationFrame(animateScroll);
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
}

// Error Handler
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.logError(event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.logError(event.reason);
            event.preventDefault();
        });
    }

    logError(error) {
        // In production, you might want to send this to a logging service
        const errorInfo = {
            message: error.message || error,
            stack: error.stack,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        // For now, just log to console
        console.log('Error logged:', errorInfo);
    }
}

// Utility functions
const utils = {
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    scrollToElement(element, offset = 80) {
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    },

    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new PageLoader();
    new ParticleSystem();
    new ThemeController();
    new ScrollSpy();
    new MobileNav();
    new TypewriterEffect();
    new ScrollAnimations();
    new SkillsAnimation();
    new ContactForm();
    new PerformanceMonitor();
    new CursorEffects();
    new SmoothScrollPolyfill();
    new ErrorHandler();
    
    console.log('🚀 Portfolio loaded successfully!');
});

// Service Worker Registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // Skip to main content on Tab key
    if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        const mainContent = document.getElementById('home');
        if (mainContent) {
            mainContent.focus();
        }
    }
});

// Add focus indicators for keyboard navigation
const style = document.createElement('style');
style.textContent = `
    .nav-link:focus,
    .btn:focus,
    .project-link:focus,
    .social-link:focus,
    .contact-link:focus {
        outline: 2px solid var(--accent-primary);
        outline-offset: 2px;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
        outline: 2px solid var(--accent-primary);
        outline-offset: 2px;
    }
`;
document.head.appendChild(style);

// Add ARIA labels for better accessibility
document.addEventListener('DOMContentLoaded', () => {
    // Add ARIA labels to navigation
    const nav = document.querySelector('.navbar');
    if (nav) nav.setAttribute('aria-label', 'Main navigation');
    
    // Add ARIA labels to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const heading = section.querySelector('h2');
        if (heading) {
            section.setAttribute('aria-labelledby', heading.id || heading.textContent.toLowerCase().replace(/\s+/g, '-'));
        }
    });
    
    // Add ARIA labels to form elements
    const form = document.getElementById('contact-form');
    if (form) {
        form.setAttribute('aria-label', 'Contact form');
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                input.setAttribute('aria-describedby', label.textContent);
            }
        });
    }
});

// Preload critical resources
const preloadResources = () => {
    const criticalResources = [
        '/RAMU.jpg',
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.includes('.jpg') ? 'image' : 'style';
        document.head.appendChild(link);
    });
};

// Initialize preloading
preloadResources();

// Add viewport height fix for mobile browsers
const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

setVH();
window.addEventListener('resize', utils.throttle(setVH, 100));

// Add touch device detection
const addTouchClass = () => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
    }
};

addTouchClass();

// Add connection speed detection
const addConnectionClass = () => {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            document.body.classList.add('slow-connection');
        }
    }
};

addConnectionClass();

// Add battery status detection (for performance optimization)
const addBatteryOptimization = () => {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            if (battery.level < 0.2) {
                document.body.classList.add('low-battery');
                // Reduce animations for battery saving
                const style = document.createElement('style');
                style.textContent = `
                    .low-battery * {
                        animation-duration: 0.1s !important;
                        transition-duration: 0.1s !important;
                    }
                `;
                document.head.appendChild(style);
            }
        });
    }
};

addBatteryOptimization();

// Add print styles handler
const handlePrint = () => {
    window.addEventListener('beforeprint', () => {
        document.body.classList.add('printing');
    });
    
    window.addEventListener('afterprint', () => {
        document.body.classList.remove('printing');
    });
};

handlePrint();

// Add copy to clipboard functionality
const addCopyToClipboard = () => {
    const copyButtons = document.querySelectorAll('[data-copy]');
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const text = button.getAttribute('data-copy');
            try {
                await navigator.clipboard.writeText(text);
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });
    });
};

addCopyToClipboard();

// Add share API functionality
const addShareAPI = () => {
    if ('share' in navigator) {
        const shareButton = document.createElement('button');
        shareButton.className = 'btn btn-outline glass-btn-outline share-btn';
        shareButton.innerHTML = '<i class="fas fa-share"></i> Share Portfolio';
        shareButton.style.cssText = 'position: fixed; bottom: 2rem; right: 2rem; z-index: 1000;';
        
        shareButton.addEventListener('click', async () => {
            try {
                await navigator.share({
                    title: 'Rama Krishna - Portfolio',
                    text: 'Check out my portfolio!',
                    url: window.location.href
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        });
        
        document.body.appendChild(shareButton);
    }
};

// Only add share button on mobile devices
if (window.innerWidth < 768) {
    addShareAPI();
}

// Add back to top button
const addBackToTop = () => {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top glass-btn';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', utils.throttle(() => {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    }, 100));
    
    document.body.appendChild(backToTop);
};

addBackToTop();

// Add keyboard shortcuts
const addKeyboardShortcuts = () => {
    document.addEventListener('keydown', (e) => {
        // Alt + H = Home
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Alt + A = About
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Alt + P = Projects
        if (e.altKey && e.key === 'p') {
            e.preventDefault();
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Alt + C = Contact
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Alt + T = Toggle theme
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            document.getElementById('theme-toggle').click();
        }
    });
};

addKeyboardShortcuts();

// Add progress indicator
const addProgressIndicator = () => {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
        z-index: 10001;
        transition: width 0.3s ease;
    `;
    
    document.body.appendChild(progress);
    
    window.addEventListener('scroll', utils.throttle(() => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progress.style.width = `${scrolled}%`;
    }, 16));
};

addProgressIndicator();

// Add easter egg
const addEasterEgg = () => {
    let sequence = [];
    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', (e) => {
        sequence.push(e.code);
        sequence = sequence.slice(-konami.length);
        
        if (sequence.join(',') === konami.join(',')) {
            // Easter egg activated!
            document.body.style.animation = 'rainbow 2s infinite';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 5000);
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            
            console.log('🎉 Easter egg activated! You found the secret!');
        }
    });
};

addEasterEgg();

// Final initialization message
console.log(`
🚀 Portfolio Loaded Successfully!
📱 Mobile Responsive: ✅
🍔 Hamburger Menu: ✅
🎨 Theme Toggle: ✅
✨ Animations: ✅
🔍 SEO Optimized: ✅
♿ Accessibility: ✅
⚡ Performance: ✅

Keyboard Shortcuts:
Alt + H = Home
Alt + A = About  
Alt + P = Projects
Alt + C = Contact
Alt + T = Toggle Theme

Try the Konami Code for a surprise! 😉
`);


