(function() {
  if (document.getElementById('spaceship')) return;

  const ship = document.createElement('div');
  ship.id = 'spaceship';
  ship.style.position = 'fixed';
  ship.style.width = '60px';
  ship.style.height = '60px';
  ship.style.background = "url('https://upload.wikimedia.org/wikipedia/commons/4/4f/Pixel_spaceship.png') no-repeat center";
  ship.style.backgroundSize = 'contain';
  ship.style.top = '50%';
  ship.style.left = '50%';
  ship.style.transform = 'translate(-50%, -50%)';
  ship.style.pointerEvents = 'none';
  ship.style.zIndex = '999999';
  document.body.appendChild(ship);

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  const speed = 10;

  window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      if (e.key === 'ArrowUp') y -= speed;
      if (e.key === 'ArrowDown') y += speed;
      if (e.key === 'ArrowLeft') x -= speed;
      if (e.key === 'ArrowRight') x += speed;
      ship.style.left = `${x}px`;
      ship.style.top = `${y}px`;
    }
  });
})();
