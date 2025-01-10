// Particle System
let canvas, ctx, particles, mouse;
const particleCount = 100; // Reduced for clearer connections
const connectionDistance = 250; // Increased for more connections
const particleSpeed = 0.2; // Reduced for smoother movement
const connectionStrength = 0.9; // Increased connection opacity
const mouseRadius = 300; // Larger mouse influence
const mouseConnectionRadius = 350; // Radius for special mouse connections
const maxConnections = 5; // Maximum connections per particle

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

function drawParticles() {
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

    // Draw connections
    particles.forEach(particle => {
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
}

function animate() {
    drawParticles();
    requestAnimationFrame(animate);
}

// Initialize everything when the page loads
window.addEventListener('load', () => {
    initParticles();
    const typewriterElement = document.querySelector('.typewriter');
    typeWriter(typewriterElement, typewriterElement.textContent);
});

// Typewriter effect
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Handle navbar active state
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const hash = window.location.hash || '#home';
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Update active state on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Initial call to set active state
updateActiveNavLink();
window.addEventListener('hashchange', updateActiveNavLink); 

// Smooth scroll function with animation
function smoothScroll(target, duration) {
    const targetSection = document.querySelector(target);
    const targetPosition = targetSection.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Easing function for smooth animation
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Add click event listeners to all navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        
        // Add fade out effect to current section
        const currentSection = document.querySelector(target);
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0.5';
            section.style.transform = 'scale(0.99)';
            section.style.transition = 'all 0.3s ease';
        });

        // Smooth scroll with animation
        smoothScroll(target, 1000);

        // Add fade in effect to target section
        setTimeout(() => {
            document.querySelectorAll('section').forEach(section => {
                section.style.opacity = '1';
                section.style.transform = 'scale(1)';
            });
            currentSection.style.opacity = '1';
            currentSection.style.transform = 'scale(1)';
        }, 300);
    });
}); 

// Enhanced smooth scroll with professional animations
function smoothScrollWithEffects(target) {
    const targetSection = document.querySelector(target);
    const allSections = document.querySelectorAll('section');
    
    // Set initial perspective and prepare for transition
    document.body.style.perspective = '3000px';
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Add transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'transition-overlay';
    document.body.appendChild(overlay);

    // Elegant exit for current sections
    allSections.forEach(section => {
        if (section !== targetSection) {
            section.classList.add('section-super-exit');
            section.style.pointerEvents = 'none';
        }
    });

    // Prepare target section
    targetSection.classList.add('section-super-entrance');
    targetSection.style.pointerEvents = 'all';
    
    // Smooth scroll with enhanced timing
    setTimeout(() => {
        window.scrollTo({
            top: targetSection.offsetTop - 80,
            behavior: 'smooth'
        });
        
        // Add ripple and glow effects
        const ripple = document.createElement('div');
        ripple.className = 'section-ripple-enhanced';
        targetSection.appendChild(ripple);

        const glow = document.createElement('div');
        glow.className = 'section-glow';
        targetSection.appendChild(glow);
    }, 300);

    // Clean up animations with perfect timing
    setTimeout(() => {
        allSections.forEach(section => {
            section.classList.remove('section-super-exit');
            section.style.pointerEvents = 'all';
        });
        targetSection.classList.remove('section-super-entrance');
        document.body.removeChild(overlay);
        const ripple = targetSection.querySelector('.section-ripple-enhanced');
        const glow = targetSection.querySelector('.section-glow');
        if (ripple) ripple.remove();
        if (glow) glow.remove();
    }, 1800);
}

// Update click event listeners for navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        
        // Add active class to clicked link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        this.classList.add('active');

        smoothScrollWithEffects(target);
    });
}); 

document.querySelectorAll('.skill-item').forEach(item => {
    const frameworks = item.getAttribute('data-frameworks');
    const revealDiv = item.querySelector('.framework-reveal');
    
    item.addEventListener('mouseenter', () => {
        revealDiv.textContent = frameworks;
        revealDiv.style.opacity = '1';
        revealDiv.style.transform = 'translateY(0)';
    });

    item.addEventListener('mouseleave', () => {
        revealDiv.style.opacity = '0';
        revealDiv.style.transform = 'translateY(100%)';
    });
}); 