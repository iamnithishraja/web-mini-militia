function calculateAngle(mouseX, mouseY, playerX, playerY) {
  const worldMouseX = mouseX + cameraX;
  const worldMouseY = mouseY + cameraY;

  return Math.atan2(worldMouseY - playerY, worldMouseX - playerX);
}

addEventListener("click", (event) => {
  const canvas = document.querySelector("canvas");
  const { top, left } = canvas.getBoundingClientRect();
  const playerPosition = {
    x: frontEndPlayers[socket.id].x,
    y: frontEndPlayers[socket.id].y,
  };

  const angle = calculateAngle(
    event.clientX,
    event.clientY,
    frontEndPlayers[socket.id].x,
    frontEndPlayers[socket.id].y
  );

  // const velocity = {
  //   x: Math.cos(angle) * 5,
  //   y: Math.sin(angle) * 5
  // }

  socket.emit("shoot", {
    x: playerPosition.x,
    y: playerPosition.y,
    angle,
  });
  // frontEndProjectiles.push(
  //   new Projectile({
  //     x: playerPosition.x,
  //     y: playerPosition.y,
  //     radius: 5,
  //     color: 'white',
  //     velocity
  //   })
  // )
});
