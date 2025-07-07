// Global Variables
let canvas, ctx, particles, mouse;
const particleCount = 100; // Reduced for clearer connections
const connectionDistance = 250; // Increased for more connections
const particleSpeed = 0.2; // Reduced for smoother movement
const connectionStrength = 0.9; // Increased connection opacity
const mouseRadius = 300; // Larger mouse influence
const mouseConnectionRadius = 350; // Radius for special mouse connections
const maxConnections = 5; // Maximum connections per particle
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

// Track if portfolio has been initialized
let portfolioInitialized = false;

// Initialize Portfolio
function initializePortfolio() {
    if (portfolioInitialized) return;
    portfolioInitialized = true;
    
    initParticles();
    initCursor();
    initNavigation();
    initAnimations();
    initTypewriter();
    initCounters();
    initSkillBars();
    initSkillItemHoverEffects();
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
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    // Highly responsive and fast cursor/follower animation
    function animateCursor() {
        // Cursor moves almost instantly to mouse
        cursorX += (mouseX - cursorX) * 0.85;
        cursorY += (mouseY - cursorY) * 0.85;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Follower trails closely behind cursor, but still smooth
        followerX += (mouseX - followerX) * 0.35;
        followerY += (mouseY - followerY) * 0.35;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

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

// Enhanced Globe Particle System
function initParticles() {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    
    // Replace globe container with canvas
    const container = document.getElementById('globe-container');
    container.innerHTML = '';
    container.appendChild(canvas);
    
    // Set canvas size
    function resize() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        // Recreate particles on resize to maintain density
        createParticles();
    }
    resize();
    window.addEventListener('resize', resize);

    // Mouse interaction
    mouse = { x: null, y: null, radius: 200 };
    
    // Add all event listeners here
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Add click event listener here
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Create new particles on click
        for(let i = 0; i < 5; i++) {
            particles.push({
                x: x,
                y: y,
                radius: Math.random() * 2 + 1,
                vx: Math.random() * 4 - 2,
                vy: Math.random() * 4 - 2,
                color: getRandomColor()
            });
        }
        
        // Remove excess particles
        if(particles.length > particleCount + 20) {
            particles.splice(0, 5);
        }
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
            radius: Math.random() * 1.5 + 1,
            vx: (Math.random() - 0.5) * particleSpeed,
            vy: (Math.random() - 0.5) * particleSpeed,
            color: getRandomColor(),
            glow: 0
        });
    }
}

function getRandomColor() {
    const colors = [
        'rgba(0, 255, 136, 0.6)',  // accent-1 with higher opacity
        'rgba(107, 75, 255, 0.6)', // accent-2 with higher opacity
        'rgba(0, 166, 255, 0.6)'   // accent-3 with higher opacity
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create a map to store nearest particles for each particle
    const nearestParticles = new Map();

    // Find nearest particles for connections
    particles.forEach((particle, i) => {
        const distances = [];
        particles.forEach((otherParticle, j) => {
            if (i !== j) {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < connectionDistance) {
                    distances.push({ particle: otherParticle, distance });
                }
            }
        });
        // Sort by distance and keep only the closest ones
        distances.sort((a, b) => a.distance - b.distance);
        nearestParticles.set(particle, distances.slice(0, maxConnections));
    });

    // Draw connections and particles
    particles.forEach((particle, index) => {
        const connections = nearestParticles.get(particle) || [];
        
        // Draw connections to nearest particles
        connections.forEach(({ particle: otherParticle, distance }) => {
            let opacity = (1 - distance/connectionDistance) * connectionStrength;
            
            // Enhance connections near mouse
            if (mouse.x && mouse.y) {
                const midX = (particle.x + otherParticle.x) / 2;
                const midY = (particle.y + otherParticle.y) / 2;
                const mouseDistance = Math.sqrt(
                    Math.pow(mouse.x - midX, 2) +
                    Math.pow(mouse.y - midY, 2)
                );
                if (mouseDistance < mouseRadius) {
                    opacity = Math.min(1, opacity * 3); // Stronger connections near mouse
                }
            }

            // Create gradient for connection
            const gradient = ctx.createLinearGradient(
                particle.x, particle.y,
                otherParticle.x, otherParticle.y
            );
            gradient.addColorStop(0, `rgba(0, 255, 136, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(0, 166, 255, ${opacity * 1.2})`);
            gradient.addColorStop(1, `rgba(107, 75, 255, ${opacity})`);
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = opacity * 3;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
        });

        // Draw connections to mouse
        if (mouse.x && mouse.y) {
            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseConnectionRadius) {
                const opacity = Math.min(1, (1 - distance/mouseConnectionRadius) * 1.2);
                const gradient = ctx.createLinearGradient(
                    particle.x, particle.y,
                    mouse.x, mouse.y
                );
                gradient.addColorStop(0, `rgba(0, 255, 136, ${opacity})`);
                gradient.addColorStop(1, `rgba(107, 75, 255, ${opacity})`);
                
                ctx.beginPath();
                ctx.strokeStyle = gradient;
                ctx.lineWidth = opacity * 4;
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }

        // Update particle position with attraction to connected particles
        let dx = 0, dy = 0;
        connections.forEach(({ particle: otherParticle }) => {
            dx += (otherParticle.x - particle.x) * 0.001;
            dy += (otherParticle.y - particle.y) * 0.001;
        });
        
        particle.vx = (particle.vx + dx) * 0.99;
        particle.vy = (particle.vy + dy) * 0.99;
        
        // Mouse influence
        if (mouse.x && mouse.y) {
            const mdx = mouse.x - particle.x;
            const mdy = mouse.y - particle.y;
            const mouseDistance = Math.sqrt(mdx * mdx + mdy * mdy);
            
            if (mouseDistance < mouseRadius) {
                const force = (mouseRadius - mouseDistance) / mouseRadius;
                particle.vx += (mdx * force * 0.02);
                particle.vy += (mdy * force * 0.02);
            }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if(particle.x < 0 || particle.x > canvas.width) {
            particle.vx *= -0.5;
            particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if(particle.y < 0 || particle.y > canvas.height) {
            particle.vy *= -0.5;
            particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Draw particle
        const radius = particle.radius * (1 + (particle.glow || 0) * 2);
        
        // Glow effect
        const glowGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, radius * 4
        );
        glowGradient.addColorStop(0, particle.color.replace('0.6', '0.9'));
        glowGradient.addColorStop(0.5, particle.color.replace('0.6', '0.4'));
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.fillStyle = glowGradient;
        ctx.arc(particle.x, particle.y, radius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.fillStyle = particle.color.replace('0.6', '1');
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
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
    const mobileResumeBtn = document.getElementById('mobile-resume-btn');
    
    // Function to handle the download process
    const handleDownload = (e, button) => {
        e.preventDefault();
        
        // Convert Google Drive view URL to direct download URL
        const fileId = '1dXxiqcHPMUnRs61AnP18-dRcjCKQ4_52';
        const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        
        // Add loading animation
        const originalContent = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Downloading...</span>';
        button.style.pointerEvents = 'none';
        
        // For mobile compatibility, open in new tab if using touch device
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouchDevice) {
            // Mobile approach - open in new tab
            window.open(downloadUrl, '_blank');
            
            // Show success message
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check"></i><span>Downloaded!</span>';
                
                // Reset button after delay
                setTimeout(() => {
                    button.innerHTML = originalContent;
                    button.style.pointerEvents = 'auto';
                }, 2000);
            }, 1000);
            } else {
                // Desktop approach - create and click a download link
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = 'Shaik_Nihal_Resume.pdf';
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Show success message
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-check"></i><span>Downloaded!</span>';
                    
                    // Reset button after delay
                    setTimeout(() => {
                        button.innerHTML = originalContent;
                        button.style.pointerEvents = 'auto';
                    }, 2000);
                }, 1000);
            }
        };
        
        // Set up desktop resume button
        if (resumeBtn) {
            // Add both click and touch events for better compatibility
            resumeBtn.addEventListener('click', (e) => handleDownload(e, resumeBtn));
            resumeBtn.addEventListener('touchend', (e) => {
                // Prevent duplicate events if touch triggers click too
                e.preventDefault();
                handleDownload(e, resumeBtn);
            });
        }
        
        // Set up mobile resume button
        if (mobileResumeBtn) {
            mobileResumeBtn.addEventListener('click', (e) => handleDownload(e, mobileResumeBtn));
            mobileResumeBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                handleDownload(e, mobileResumeBtn);
            });
        }
    }


// Enhanced Typewriter effect with smooth fade-in and no glitches
function typeWriter(element, text, speed = 100) {
    if (!element || !text) return;
    
    // Smoothly show the element first
    element.classList.add('active');
    element.innerHTML = '';
    
    let i = 0;
    const cursor = '<span class="typing-cursor">|</span>';
    
    function type() {
        if (i < text.length) {
            const currentChar = text.charAt(i);
            
            // Add slight variation in speed for natural feel
            let currentSpeed = speed;
            if (currentChar === ' ') {
                currentSpeed = speed * 0.3; // Much faster for spaces
            } else if (currentChar === '|') {
                currentSpeed = speed * 2; // Slower for separators to create pause
            } else if (currentChar === ',') {
                currentSpeed = speed * 1.5; // Slight pause for commas
            }
            
            // Use innerHTML to support cursor element
            element.innerHTML = text.substring(0, i + 1) + cursor;
            i++;
            setTimeout(type, currentSpeed);
        } else {
            // Show text with cursor for a moment
            setTimeout(() => {
                element.innerHTML = text + cursor;
                // Then fade out cursor smoothly
                setTimeout(() => {
                    const cursorElement = element.querySelector('.typing-cursor');
                    if (cursorElement) {
                        cursorElement.style.transition = 'opacity 0.8s ease';
                        cursorElement.style.opacity = '0';
                        setTimeout(() => {
                            element.innerHTML = text;
                        }, 800);
                    }
                }, 1200);
            }, 300);
        }
    }
    
    // Start with just the cursor, then begin typing
    element.innerHTML = cursor;
    setTimeout(type, 800);
}

// Initialize typewriter effect for hero section
let typewriterInitialized = false;

function initTypewriter() {
    if (typewriterInitialized) return;
    typewriterInitialized = true;
    
    // Wait for hero content animation to complete first
    setTimeout(() => {
        const typewriterElement = document.querySelector('.typewriter');
        if (typewriterElement) {
            console.log('Starting smooth typewriter effect...');
            
            // Clean text - shorter and more impactful
            const text = 'Computer Science Student | Developer | Tech Enthusiast';
            
            // Start the smooth typewriter effect
            typeWriter(typewriterElement, text, 100);
        } else {
            console.error('Typewriter element not found');
        }
    }, 1800); // Start after hero animation
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

// Skill Item Hover Effects
function initSkillItemHoverEffects() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const progressBar = item.querySelector('.skill-progress');
            const level = item.getAttribute('data-skill');
            
            // Animate progress bar on hover
            if (progressBar) {
                progressBar.style.width = level + '%';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const progressBar = item.querySelector('.skill-progress');
            const level = item.getAttribute('data-skill');
            
            // Reset progress bar on mouse leave
            if (progressBar) {
                progressBar.style.width = '0%';
            }
        });
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

// Skill Item Hover Effects for About Section
function initSkillItemHoverEffects() {
    document.querySelectorAll('.skill-item').forEach(item => {
        const frameworks = item.getAttribute('data-frameworks');
        const revealDiv = item.querySelector('.framework-reveal');
        
        if (frameworks && revealDiv) {
            item.addEventListener('mouseenter', () => {
                revealDiv.textContent = frameworks;
                revealDiv.style.opacity = '1';
                revealDiv.style.transform = 'translateY(0)';
            });

            item.addEventListener('mouseleave', () => {
                revealDiv.style.opacity = '0';
                revealDiv.style.transform = 'translateY(100%)';
            });
        }
    });
}

// Initialize mobile navigation
//initMobileNav();


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