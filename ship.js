(function() {
  if (document.getElementById('spacecruiser-overlay')) return; // Prevent multiple instances

  // Create the spaceship element
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
    transform: 'translate(-50%, -50%)',
  });
  document.body.appendChild(ship);

  // Movement variables
  let posX = window.innerWidth / 2;
  let posY = window.innerHeight / 2;
  const speed = 5;
  const keys = {};

  // Update position
  function moveShip() {
    if (keys['ArrowUp']) posY -= speed;
    if (keys['ArrowDown']) posY += speed;
    if (keys['ArrowLeft']) posX -= speed;
    if (keys['ArrowRight']) posX += speed;

    // Boundary checks
    posX = Math.max(0, Math.min(window.innerWidth, posX));
    posY = Math.max(0, Math.min(window.innerHeight, posY));

    ship.style.left = posX + 'px';
    ship.style.top = posY + 'px';
    requestAnimationFrame(moveShip);
  }

  // Key event listeners
  window.addEventListener('keydown', (e) => keys[e.key] = true);
  window.addEventListener('keyup', (e) => keys[e.key] = false);

  moveShip();
})();
