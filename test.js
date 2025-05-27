const canvas = document.createElement('canvas');
canvas.id = 'gameCanvas';
Object.assign(canvas.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
    display: 'block',
    background: 'transparent'
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
    thrust: 0.4,
    maxSpeed: 12,
    rotationSpeed: 0.08,
    friction: 0.95,
    brakeForce: 0.9,
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

    // Car body
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.rect(-ship.size, -ship.size / 2, ship.size * 2, ship.size); // Main body
    ctx.fill();

    // Spoiler
    ctx.fillStyle = '#999999';
    ctx.beginPath();
    ctx.rect(ship.size * 0.9, -ship.size / 2 - 2, 4, ship.size + 4);
    ctx.fill();

    // Wheels (front + back)
    ctx.fillStyle = '#444444';
    const wheelOffset = ship.size * 0.8;
    ctx.beginPath(); // Front wheels
    ctx.rect(-ship.size * 0.9, -ship.size / 2 - 3, 3, 6);
    ctx.rect(-ship.size * 0.9, ship.size / 2 - 3, 3, 6);
    ctx.fill();
    ctx.beginPath(); // Rear wheels
    ctx.rect(ship.size * 0.9 - 3, -ship.size / 2 - 3, 3, 6);
    ctx.rect(ship.size * 0.9 - 3, ship.size / 2 - 3, 3, 6);
    ctx.fill();

    // Exhaust flames
    if (keys.up) {
        for (let side = -1; side <= 1; side += 2) {
            ctx.beginPath();
            ctx.moveTo(-ship.size - 2, side * 4);
            ctx.lineTo(-ship.size - 10, side * 2);
            ctx.lineTo(-ship.size - 12, side * 4);
            ctx.closePath();
            ctx.fillStyle = '#ff6600';
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(-ship.size - 2, side * 4);
            ctx.lineTo(-ship.size - 8, side * 2);
            ctx.lineTo(-ship.size - 10, side * 4);
            ctx.closePath();
            ctx.fillStyle = '#ffff00';
            ctx.fill();
        }
    }

    ctx.restore();
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw ship
    updateShip();
    drawShip();
    
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
