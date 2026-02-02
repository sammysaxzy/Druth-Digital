// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.querySelector('.header');
const statNumbers = document.querySelectorAll('.stat-number');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger menu
    const bars = navToggle.querySelectorAll('.bar');
    bars[0].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(-5px, 6px)' : '';
    bars[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
    bars[2].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(-5px, -6px)' : '';
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        
        // Reset hamburger menu
        const bars = navToggle.querySelectorAll('.bar');
        bars[0].style.transform = '';
        bars[1].style.opacity = '1';
        bars[2].style.transform = '';
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Check if it's an internal page link or anchor link
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
        // If it's a page link, let it navigate normally
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Start counting animation for stats
            if (entry.target.classList.contains('stat-number')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

// Observe elements for animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .plan-card, .stat-item');
    animatedElements.forEach(el => observer.observe(el));
    
    // Observe stat numbers specifically
    statNumbers.forEach(stat => observer.observe(stat));
});

// Counter animation for statistics
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Speed meter animation
function animateSpeedMeter() {
    const speedCircle = document.querySelector('.speed-circle');
    const speedValue = document.querySelector('.speed-value');
    
    if (speedCircle && speedValue) {
        // Animate speed value from 0 to 1
        let speed = 0;
        const targetSpeed = 10;
        const increment = 0.08;
        
        const speedAnimation = setInterval(() => {
            speed += increment;
            if (speed >= targetSpeed) {
                speed = targetSpeed;
                clearInterval(speedAnimation);
            }
            
            speedValue.textContent = speed.toFixed(1);
            
            // Update conic gradient
            const degrees = speed * 360;
            speedCircle.style.background = `conic-gradient(var(--primary-dark-red) 0deg ${degrees}deg, var(--accent-light-gray) ${degrees}deg 360deg)`;
        }, 30);
    }
}

// Parallax scrolling effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-bg');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Form validation and submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formDataObj = Object.fromEntries(formData);
        
        // Simple validation
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const phone = contactForm.querySelector('input[type="tel"]').value;
        const service = contactForm.querySelector('select').value;
        const message = contactForm.querySelector('textarea').value;
        
        if (!name || !email || !service) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you for your inquiry! We will contact you soon.', 'success');
        contactForm.reset();
    });
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--primary-dark-red)' : 'var(--secondary-midnight-blue)'};
        color: white;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease-in-out;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Button hover effects
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('mouseenter', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            button.removeChild(ripple);
        }, 600);
    });
});

// Add ripple animation to styles
const rippleStyles = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = rippleStyles;
document.head.appendChild(styleSheet);

// Service cards hover animation
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-12px) rotateX(5deg)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateX(0)';
        card.style.boxShadow = 'var(--shadow-md)';
    });
});

// Plan cards comparison
document.querySelectorAll('.plan-card').forEach(card => {
    card.addEventListener('click', () => {
        // Remove featured class from all cards
        document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('featured'));
        
        // Add featured class to clicked card
        card.classList.add('featured');
        
        // Scroll to card
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

// Loading states for buttons
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(button => {
    button.addEventListener('click', function(e) {
        // Check if button has a valid href (is a link)
        if (this.tagName === 'A' && this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) {
            return; // Let the link work normally
        }
        
        const buttonText = this.textContent.toLowerCase();
        
        // Handle check availability button
        if (this.classList.contains('check-availability')) {
            e.preventDefault();
            const originalText = this.textContent;
            this.innerHTML = '<span class="loading-spinner"></span> Checking...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
                showNotification('Checking availability in your area... Please visit our contact page for complete details!', 'success');
                
                // Redirect to contact page for full availability check
                setTimeout(() => {
                    window.location.href = 'contact.html';
                }, 2000);
            }, 2000);
        }
        
        // Handle plan selection buttons
        else if (this.classList.contains('plan-button')) {
            e.preventDefault();
            const plan = this.getAttribute('data-plan');
            const originalText = this.textContent;
            
            this.innerHTML = '<span class="loading-spinner"></span> Processing...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
                showNotification(`Great choice! ${plan} plan selected. Redirecting to contact form...`, 'success');
                
                // Redirect to contact page after a short delay
                setTimeout(() => {
                    window.location.href = 'contact.html';
                }, 1500);
            }, 1500);
        }
        
        // Handle generic action buttons
        else if (buttonText.includes('get started') || 
                 buttonText.includes('choose plan') ||
                 buttonText.includes('learn more')) {
            
            // If it's a "Learn More" button on services page, do nothing special
            if (buttonText.includes('learn more')) {
                return;
            }
            
            e.preventDefault();
            const originalText = this.textContent;
            this.innerHTML = '<span class="loading-spinner"></span> Processing...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
                showNotification('Action completed successfully!', 'success');
                
                // If it's a "Get Started" button, redirect to contact page
                if (buttonText.includes('get started') && !this.getAttribute('href')) {
                    setTimeout(() => {
                        window.location.href = 'contact.html';
                    }, 1000);
                }
            }, 1500);
        }
        
        // Handle live chat button
        else if (this.classList.contains('live-chat-button')) {
            e.preventDefault();
            const originalText = this.textContent;
            this.innerHTML = '<span class="loading-spinner"></span> Connecting...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
                showNotification('Live chat is connecting... An agent will be with you shortly!', 'info');
            }, 2000);
        }
        
        // Handle view services button
        else if (buttonText.includes('view services')) {
            e.preventDefault();
            window.location.href = 'services.html';
        }
        
        // Handle contact us button
        else if (buttonText.includes('contact us') || buttonText.includes('contact sales')) {
            e.preventDefault();
            window.location.href = 'contact.html';
        }
    });
});

// Initialize animations when page loads
window.addEventListener('load', () => {
    // Start speed meter animation
    setTimeout(() => {
        animateSpeedMeter();
    }, 500);
    
    // Add fade-in class to elements
    document.querySelectorAll('.hero-title, .hero-subtitle, .section-title').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        
        // Reset hamburger menu
        const bars = navToggle.querySelectorAll('.bar');
        bars[0].style.transform = '';
        bars[1].style.opacity = '1';
        bars[2].style.transform = '';
    }
});

// Performance optimization - Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handler
const debouncedScroll = debounce(() => {
    // Scroll-based animations
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Animate elements based on scroll position
    document.querySelectorAll('.fade-in').forEach(el => {
        const elementTop = el.offsetTop;
        const elementVisible = elementTop - windowHeight + 100;
        
        if (scrolled > elementVisible) {
            el.classList.add('visible');
        }
    });
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Touch device detection
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
if (isTouchDevice) {
    document.body.classList.add('touch-device');
}

// Print functionality
function printPage() {
    window.print();
}

// Add print button dynamically
// const printButton = document.createElement('button');
// printButton.innerHTML = '<i class="fas fa-print"></i> Print';
// printButton.className = 'btn-secondary';
// printButton.style.cssText = 'position: fixed; bottom: 20px; left: 20px; z-index: 1000;';
// printButton.addEventListener('click', printPage);
// document.body.appendChild(printButton);

// Hide print button on print
// window.addEventListener('beforeprint', () => {
//     printButton.style.display = 'none';
// });

// window.addEventListener('afterprint', () => {
//     printButton.style.display = 'block';
// });

console.log('Druth ISP Website - All scripts loaded successfully!');