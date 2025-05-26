if(document.getElementById('gameCanvas')) return; // prevent duplicate inject
const canvas = document.createElement('canvas');
canvas.id = 'gameCanvas';
Object.assign(canvas.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
    display: 'block',
    background: 'radial-gradient(circle at center, #001122 0%, #000000 100%)'
});
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Ship object
const ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    angle: -Math.PI / 2, // Start facing up
    velocityX: 0,
    velocityY: 0,
    thrust: 0.3,
    maxSpeed: 8,
    rotationSpeed: 0.08,
    friction: 0.98,
    brakeForce: 0.95,
    size: 12
};

// Input handling
const keys = {
    left: false,
    right: false,
    up: false,
    down: false
};

document.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'ArrowLeft':
            keys.left = true;
            e.preventDefault();
            break;
        case 'ArrowRight':
            keys.right = true;
            e.preventDefault();
            break;
        case 'ArrowUp':
            keys.up = true;
            e.preventDefault();
            break;
        case 'ArrowDown':
            keys.down = true;
            e.preventDefault();
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.code) {
        case 'ArrowLeft':
            keys.left = false;
            break;
        case 'ArrowRight':
            keys.right = false;
            break;
        case 'ArrowUp':
            keys.up = false;
            break;
        case 'ArrowDown':
            keys.down = false;
            break;
    }
});

// Update ship physics
function updateShip() {
    // Rotation
    if (keys.left) {
        ship.angle -= ship.rotationSpeed;
    }
    if (keys.right) {
        ship.angle += ship.rotationSpeed;
    }
    
    // Thrust
    if (keys.up) {
        const thrustX = Math.cos(ship.angle) * ship.thrust;
        const thrustY = Math.sin(ship.angle) * ship.thrust;
        
        ship.velocityX += thrustX;
        ship.velocityY += thrustY;
    }
    
    // Brake
    if (keys.down) {
        ship.velocityX *= ship.brakeForce;
        ship.velocityY *= ship.brakeForce;
    }
    
    // Apply friction
    ship.velocityX *= ship.friction;
    ship.velocityY *= ship.friction;
    
    // Limit max speed
    const speed = Math.sqrt(ship.velocityX * ship.velocityX + ship.velocityY * ship.velocityY);
    if (speed > ship.maxSpeed) {
        ship.velocityX = (ship.velocityX / speed) * ship.maxSpeed;
        ship.velocityY = (ship.velocityY / speed) * ship.maxSpeed;
    }
    
    // Update position
    ship.x += ship.velocityX;
    ship.y += ship.velocityY;
    
    // Wrap around screen edges
    if (ship.x < 0) ship.x = canvas.width;
    if (ship.x > canvas.width) ship.x = 0;
    if (ship.y < 0) ship.y = canvas.height;
    if (ship.y > canvas.height) ship.y = 0;
}

// Draw ship
function drawShip() {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    
    // Ship body (triangle)
    ctx.beginPath();
    ctx.moveTo(ship.size, 0);
    ctx.lineTo(-ship.size / 2, -ship.size / 2);
    ctx.lineTo(-ship.size / 3, 0);
    ctx.lineTo(-ship.size / 2, ship.size / 2);
    ctx.closePath();
    
    // Fill ship
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    // Ship outline
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Thrust flame when accelerating
    if (keys.up) {
        ctx.beginPath();
        ctx.moveTo(-ship.size / 3, 0);
        ctx.lineTo(-ship.size * 1.5, -3);
        ctx.lineTo(-ship.size * 1.8, 0);
        ctx.lineTo(-ship.size * 1.5, 3);
        ctx.closePath();
        
        ctx.fillStyle = '#ff6600';
        ctx.fill();
        
        // Inner flame
        ctx.beginPath();
        ctx.moveTo(-ship.size / 3, 0);
        ctx.lineTo(-ship.size * 1.3, -2);
        ctx.lineTo(-ship.size * 1.5, 0);
        ctx.lineTo(-ship.size * 1.3, 2);
        ctx.closePath();
        
        ctx.fillStyle = '#ffff00';
        ctx.fill();
    }
    
    ctx.restore();
}

// Draw some stars for background
const stars = [];
for (let i = 0; i < 100; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        brightness: Math.random()
    });
}

function drawStars() {
    ctx.fillStyle = '#ffffff';
    for (const star of stars) {
        ctx.globalAlpha = star.brightness * 0.8;
        ctx.fillRect(star.x, star.y, 1, 1);
    }
    ctx.globalAlpha = 1;
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update canvas size if window was resized
    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        resizeCanvas();
        // Regenerate stars for new canvas size
        stars.length = 0;
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                brightness: Math.random()
            });
        }
    }
    
    // Draw background elements
    drawStars();
    
    // Update and draw ship
    updateShip();
    drawShip();
    
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
