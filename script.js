// Global Variables
let canvas, ctx, particles, mouse;
const particleCount = 80;
const connectionDistance = 120;
const particleSpeed = 0.3;
let animationId;

// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.remove();
            initializePortfolio();
        }, 500);
    }, 2000);
});

// Initialize Portfolio
function initializePortfolio() {
    initParticles();
    initCursor();
    initNavigation();
    initAnimations();
    initTypewriter();
    initCounters();
    initSkillBars();
    initContactForm();
    initScrollEffects();
    initScrollProgress();
    initProjectLoadMore();
    initTestimonialSlider();
    initResumeDownload();
    
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
}

// Scroll Progress Bar
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Enhanced Custom Cursor with Moncy.dev Style Sidebar Effect
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    // Smooth follower animation
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
    
    // Enhanced cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item, .experience-card, .service-card, .testimonial-card, .nav-link, .resume-btn');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
    
    // Moncy.dev Style Sidebar Cursor Effect
    const sidebarPill = document.querySelector('.sidebar-pill');
    const socialIcons = document.querySelectorAll('.social-icon');
    
    if (sidebarPill) {
        sidebarPill.addEventListener('mouseenter', () => {
            cursor.classList.add('sidebar-hover');
            follower.classList.add('sidebar-hover');
            
            // Position cursor to match sidebar pill
            const rect = sidebarPill.getBoundingClientRect();
            cursor.style.left = (rect.left + rect.width / 2 - 40) + 'px';
            cursor.style.top = (rect.top + rect.height / 2 - 150) + 'px';
        });
        
        sidebarPill.addEventListener('mouseleave', () => {
            cursor.classList.remove('sidebar-hover');
            follower.classList.remove('sidebar-hover');
        });
        
        sidebarPill.addEventListener('mousemove', (e) => {
            if (cursor.classList.contains('sidebar-hover')) {
                const rect = sidebarPill.getBoundingClientRect();
                cursor.style.left = (rect.left + rect.width / 2 - 40) + 'px';
                cursor.style.top = (rect.top + rect.height / 2 - 150) + 'px';
            }
        });
    }
    
    // Individual social icon effects
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            if (!cursor.classList.contains('sidebar-hover')) {
                cursor.style.background = 'var(--accent-2)';
                cursor.style.transform = 'scale(2.5)';
                follower.style.borderColor = 'var(--accent-2)';
                follower.style.transform = 'scale(2.5)';
            }
        });
        
        icon.addEventListener('mouseleave', () => {
            if (!cursor.classList.contains('sidebar-hover')) {
                cursor.style.background = 'var(--accent-1)';
                cursor.style.transform = 'scale(1)';
                follower.style.borderColor = 'var(--accent-1)';
                follower.style.transform = 'scale(1)';
            }
        });
    });
}

// Enhanced Particle System
function initParticles() {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    
    const container = document.getElementById('particles-container');
    container.appendChild(canvas);
    
    function resize() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        createParticles();
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    mouse = { x: null, y: null };
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    createParticles();
    animate();
}

function createParticles() {
    particles = [];
    for(let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * particleSpeed,
            vy: (Math.random() - 0.5) * particleSpeed,
            color: getRandomColor(),
            originalRadius: Math.random() * 2 + 1
        });
    }
}

function getRandomColor() {
    const colors = [
        'rgba(0, 255, 170, 0.8)',
        'rgba(138, 43, 226, 0.8)',
        'rgba(0, 212, 255, 0.8)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Mouse interaction
        if (mouse.x && mouse.y) {
            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += dx * force * 0.01;
                particle.vy += dy * force * 0.01;
                particle.radius = particle.originalRadius * (1 + force);
            } else {
                particle.radius = particle.originalRadius;
            }
        }
        
        // Boundary collision
        if (particle.x < 0 || particle.x > canvas.width) {
            particle.vx *= -0.8;
            particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
            particle.vy *= -0.8;
            particle.y = Math.max(0, Math.min(canvas.height,  particle.y));
        }
        
        // Apply friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        
        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
            if (index !== otherIndex) {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    const opacity = (1 - distance / connectionDistance) * 0.3;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 255, 170, ${opacity})`;
                    ctx.lineWidth = opacity * 2;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            }
        });
        
        // Draw particle glow
        const glowGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.radius * 3
        );
        glowGradient.addColorStop(0, particle.color);
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.fillStyle = glowGradient;
        ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = particle.color;
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    
    animationId = requestAnimationFrame(animate);
}

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
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

// Resume Download
function initResumeDownload() {
    const resumeBtn = document.getElementById('resume-btn');
    
    if (resumeBtn) {
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create a temporary download link
            const link = document.createElement('a');
            link.href = '#'; // Replace with actual resume file path
            link.download = 'Shaik_Nihal_Resume.pdf';
            
            // Add loading animation
            const originalContent = resumeBtn.innerHTML;
            resumeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Downloading...</span>';
            resumeBtn.style.pointerEvents = 'none';
            
            // Simulate download delay
            setTimeout(() => {
                // In a real scenario, you would trigger the actual download here
                // link.click();
                
                // Show success message
                resumeBtn.innerHTML = '<i class="fas fa-check"></i><span>Downloaded!</span>';
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    resumeBtn.innerHTML = originalContent;
                    resumeBtn.style.pointerEvents = 'auto';
                }, 2000);
            }, 1000);
        });
    }
}

// Typewriter Effect
function initTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    const texts = [
        'Full-Stack Developer',
        'Problem Solver',
        'Tech Enthusiast',
        'Innovation Seeker',
        'Code Craftsman'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    // Start typewriter after hero animations
    setTimeout(typeWriter, 3000);
}

// Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = current.toFixed(target % 1 === 0 ? 0 : 2);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toFixed(target % 1 === 0 ? 0 : 2);
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Skill Bars Animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const proficiencyBars = document.querySelectorAll('.proficiency-fill');
    
    const animateSkillBar = (bar) => {
        const skillItem = bar.closest('.skill-item');
        const level = skillItem ? skillItem.getAttribute('data-skill') : 0;
        
        setTimeout(() => {
            bar.style.width = level + '%';
        }, 500);
    };
    
    const animateProficiencyBar = (bar) => {
        const level = bar.getAttribute('data-level');
        
        setTimeout(() => {
            bar.style.width = level + '%';
        }, 500);
    };
    
    // Intersection Observer for skill bars
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('skill-progress')) {
                    animateSkillBar(entry.target);
                } else if (entry.target.classList.contains('proficiency-fill')) {
                    animateProficiencyBar(entry.target);
                }
                skillObserver.unobserve(entry.target);
            }
        });
    });
    
    [...skillBars, ...proficiencyBars].forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Project Load More Functionality
function initProjectLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const hiddenProjects = document.querySelectorAll('.project-card.hidden');
    
    if (loadMoreBtn && hiddenProjects.length > 0) {
        loadMoreBtn.addEventListener('click', () => {
            // Add loading state
            const originalContent = loadMoreBtn.innerHTML;
            loadMoreBtn.innerHTML = '<span>Loading...</span><i class="fas fa-spinner fa-spin"></i>';
            loadMoreBtn.disabled = true;
            
            // Show hidden projects with animation
            setTimeout(() => {
                hiddenProjects.forEach((project, index) => {
                    setTimeout(() => {
                        project.classList.remove('hidden');
                        project.classList.add('visible');
                        project.style.animation = `fadeInUp 0.6s ease forwards`;
                        project.style.animationDelay = `${index * 0.1}s`;
                    }, index * 100);
                });
                
                // Hide the load more button
                setTimeout(() => {
                    loadMoreBtn.style.transform = 'scale(0)';
                    loadMoreBtn.style.opacity = '0';
                    setTimeout(() => {
                        loadMoreBtn.style.display = 'none';
                    }, 300);
                }, hiddenProjects.length * 100 + 500);
            }, 1000);
        });
    }
}

// Testimonial Slider
function initTestimonialSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    
    let currentSlide = 0;
    
    function showSlide(index) {
        // Hide all cards
        testimonialCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide
        if (testimonialCards[index]) {
            testimonialCards[index].classList.add('active');
        }
        
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonialCards.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
        showSlide(currentSlide);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto-play testimonials
    setInterval(nextSlide, 5000);
    
    // Initialize first slide
    showSlide(0);
}

// Contact Form
function initContactForm() {
    const form = document.querySelector('.contact-form');
    const submitBtn = document.querySelector('.submit-btn');
    
    if (form && submitBtn) {
        form.addEventListener('submit', (e) => {
            // Add loading state
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Reset after form submission (handled by FormSubmit)
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
                submitBtn.disabled = false;
            }, 2000);
        });
        
        // Form validation
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim() === '') {
                    input.style.borderColor = '#ff4757';
                } else {
                    input.style.borderColor = 'var(--accent-1)';
                }
            });
            
            input.addEventListener('focus', () => {
                input.style.borderColor = 'var(--accent-1)';
            });
        });
    }
}

// Enhanced Scroll Effects
function initScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        // Parallax for other sections
        const parallaxElements = document.querySelectorAll('.about-card, .service-card, .experience-card');
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const speed = 0.05;
            const yPos = -(rect.top * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Scroll reveal animations
    const revealElements = document.querySelectorAll('.about-card, .skill-category, .experience-card, .project-card, .contact-card, .service-card, .testimonial-card');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger effect for grid items
                const parent = entry.target.parentElement;
                if (parent.classList.contains('services-grid') || 
                    parent.classList.contains('skills-grid') || 
                    parent.classList.contains('projects-grid')) {
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        revealObserver.observe(el);
    });
    
    // Scroll direction detection
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            document.body.classList.add('scroll-down');
            document.body.classList.remove('scroll-up');
        } else {
            // Scrolling up
            document.body.classList.add('scroll-up');
            document.body.classList.remove('scroll-down');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

// Additional Animations
function initAnimations() {
    // Floating animation for hero stats
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        item.classList.add('floating');
    });
    
    // Stagger animation for skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Hover effects for cards
    const cards = document.querySelectorAll('.about-card, .experience-card, .project-card, .contact-card, .service-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('pulse');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('pulse');
        });
    });
    
    // Service card icon rotation
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Social sidebar animations
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${2.5 + index * 0.1}s`;
        icon.style.opacity = '0';
        icon.style.transform = 'translateX(-50px)';
        icon.style.animation = 'slideInLeft 0.6s ease forwards';
    });
}

// Mobile Navigation Toggle
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Utility Functions
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

// Performance optimization
const debouncedResize = debounce(() => {
    if (canvas) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        createParticles();
    }
}, 250);

window.addEventListener('resize', debouncedResize);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});

// Add CSS for mobile navigation toggle and animations
const style = document.createElement('style');
style.textContent = `
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .floating {
        animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .scroll-down .navbar {
        transform: translateY(-100%);
    }
    
    .scroll-up .navbar {
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    initializePortfolio();
}

// Initialize mobile navigation
initMobileNav();