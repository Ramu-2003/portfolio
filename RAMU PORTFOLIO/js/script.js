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
        const particleCount = window.innerWidth < 768 ? 50 : 100;
        
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
            
            // Create twinkling effect
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

            // Wrap around screen
            if (particle.x > window.innerWidth) particle.x = 0;
            if (particle.x < 0) particle.x = window.innerWidth;
            if (particle.y > window.innerHeight) particle.y = 0;
            if (particle.y < 0) particle.y = window.innerHeight;
        });

        this.renderParticles();
        requestAnimationFrame(() => this.animate());
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.particles = [];
            this.createParticles();
        });
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
        window.addEventListener('scroll', () => {
            // Update active navigation
            this.updateActiveLink();

            // Add scrolled class to navbar
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
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

                // Close mobile menu if open
                const mobileMenu = document.getElementById('nav-menu');
                const mobileToggle = document.getElementById('mobile-menu');
                
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            });
        });
    }
}

// Mobile Navigation
class MobileNav {
    constructor() {
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navMenu = document.getElementById('nav-menu');
        this.init();
    }

    init() {
        this.mobileMenu.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.mobileMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.mobileMenu.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.navMenu.classList.remove('active');
                this.mobileMenu.classList.remove('active');
            }
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
        
        // Clear the text first
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
                // Remove the typing cursor after animation
                setTimeout(() => {
                    this.element.style.borderRight = 'none';
                }, 1000);
            }
        }, this.speed);
    }
}

// Scroll Animations (Simple AOS implementation)
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.init();
    }

    init() {
        this.observe();
        // Initial check for elements already in view
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
        const observer = new IntersectionObserver((entries) => {
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

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.showSuccessMessage();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.form.reset();
        }, 2000);
    }

    showSuccessMessage() {
        // Create success message
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
        `;
        message.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
            <h3 style="margin-bottom: 0.5rem;">Message Sent!</h3>
            <p>Thank you for your message. I'll get back to you soon.</p>
        `;

        document.body.appendChild(message);

        // Fade in
        setTimeout(() => {
            message.style.opacity = '1';
            message.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(message);
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
        // Lazy load images
        this.lazyLoadImages();
        
        // Optimize animations based on performance
        this.optimizeAnimations();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }

    optimizeAnimations() {
        // Reduce animations on low-end devices
        const isLowEndDevice = navigator.hardwareConcurrency < 4 || 
                               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isLowEndDevice) {
            document.body.classList.add('reduced-motion');
            
            // Add CSS for reduced motion
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
}

// Cursor Effects
class CursorEffects {
    constructor() {
        this.cursor = null;
        this.cursorFollower = null;
        this.init();
    }

    init() {
        if (window.innerWidth < 1024) return; // Skip on mobile

        this.createCursor();
        this.addEventListeners();
    }

    createCursor() {
        // Main cursor
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
        `;
        
        // Cursor follower
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

        // Scale cursor on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-link, .project-card');
        
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
    }
}

// Page Loading Handler
class PageLoader {
    constructor() {
        this.init();
    }

    init() {
        // Hide loading screen
        window.addEventListener('load', () => {
            this.hideLoader();
        });
    }

    hideLoader() {
        const loader = document.createElement('div');
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea, #764ba2);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.5s ease;
        `;
        
        loader.innerHTML = `
            <div style="text-align: center; color: white;">
                <div style="width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p>Loading...</p>
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

        if (document.readyState === 'loading') {
            document.body.appendChild(loader);
            
            window.addEventListener('load', () => {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        if (document.body.contains(loader)) {
                            document.body.removeChild(loader);
                        }
                    }, 500);
                }, 100);
            });
        }
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
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
    new PageLoader();
    
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

// Additional utility functions
const utils = {
    // Debounce function for performance
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

    // Throttle function for scroll events
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

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Smooth scroll to element
    scrollToElement(element, offset = 80) {
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
};

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});