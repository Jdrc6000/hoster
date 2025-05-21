(function() {
  if (document.getElementById('spacecruiser-overlay')) return;

  const ship = document.createElement('div');
  ship.id = 'spacecruiser-overlay';
  Object.assign(ship.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    width: '40px',
    height: '40px',
    backgroundImage: 'url("https://yourdomain.com/spaceship.png")',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    zIndex: 9999,
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%) rotate(0deg)',
  });
  document.body.appendChild(ship);

  let posX = window.innerWidth / 2;
  let posY = window.innerHeight / 2;
  let rotation = 0;       // Current rotation angle in degrees
  const speed = 5;
  const rotationSpeed = 4; // Degrees per frame when turning
  const keys = {};

  function moveShip() {
    // Rotate ship on left/right keys
    if (keys['ArrowLeft']) rotation -= rotationSpeed;
    if (keys['ArrowRight']) rotation += rotationSpeed;

    // Convert rotation to radians for movement direction
    const rad = rotation * Math.PI / 180;

    // Move forward/backward based on up/down keys and current rotation
    if (keys['ArrowUp']) {
      posX += speed * Math.cos(rad);
      posY += speed * Math.sin(rad);
    }
    if (keys['ArrowDown']) {
      posX -= speed * 0.5 * Math.cos(rad);
      posY -= speed * 0.5 * Math.sin(rad);
    }

    // Boundary checks
    posX = Math.max(0, Math.min(window.innerWidth, posX));
    posY = Math.max(0, Math.min(window.innerHeight, posY));

    // Apply position and rotation with transform
    ship.style.left = posX + 'px';
    ship.style.top = posY + 'px';
    ship.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

    requestAnimationFrame(moveShip);
  }

  window.addEventListener('keydown', e => keys[e.key] = true);
  window.addEventListener('keyup', e => keys[e.key] = false);

  moveShip();
})();
