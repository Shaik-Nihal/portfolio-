let canvas, ctx, particles, width, height;

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
        this.radius = Math.random() * 2;
        this.color = `rgba(${Math.random() < 0.5 ? '0, 255, 136' : '107, 75, 255'}, 0.6)`;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
        
        this.x += this.vx;
        this.y += this.vy;
    }
}

function init() {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    document.getElementById('particle-container').appendChild(canvas);
    
    resize();
    createParticles();
    animate();
    
    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
    
    canvas.addEventListener('mousemove', onMouseMove);
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function createParticles() {
    particles = [];
    const numberOfParticles = Math.floor((width * height) / 10000);
    
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

function onMouseMove(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    particles.forEach(particle => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
            const angle = Math.atan2(dy, dx);
            particle.vx = -Math.cos(angle) * 2;
            particle.vy = -Math.sin(angle) * 2;
        }
    });
}

function drawConnections() {
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 166, 255, ${1 - dist / 100})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
    });
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    drawConnections();
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animate);
}

// Initialize everything when the page loads
window.addEventListener('load', init);

// Keep the existing typewriter and scroll code...