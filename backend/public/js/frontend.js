const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const minimapCanvas = document.getElementById("minimapCanvas");
const minimapCtx = minimapCanvas.getContext("2d");

const socket = io();

const scoreEl = document.querySelector("#scoreEl");

const devicePixelRatio = window.devicePixelRatio || 1;

canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;

c.scale(devicePixelRatio, devicePixelRatio);

const x = canvas.width / 2;
const y = canvas.height / 2;

const frontEndPlayers = {};
const frontEndProjectiles = {};

socket.on("updateProjectiles", (backEndProjectiles) => {
  for (const id in backEndProjectiles) {
    const backEndProjectile = backEndProjectiles[id];

    if (!frontEndProjectiles[id]) {
      frontEndProjectiles[id] = new Projectile({
        x: backEndProjectile.x,
        y: backEndProjectile.y,
        radius: 5,
        color: frontEndPlayers[backEndProjectile.playerId]?.color,
        velocity: backEndProjectile.velocity,
      });
    } else {
      frontEndProjectiles[id].x += backEndProjectiles[id].velocity.x;
      frontEndProjectiles[id].y += backEndProjectiles[id].velocity.y;
    }
  }

  for (const frontEndProjectileId in frontEndProjectiles) {
    if (!backEndProjectiles[frontEndProjectileId]) {
      delete frontEndProjectiles[frontEndProjectileId];
    }
  }
});

socket.on("updatePlayers", (backEndPlayers) => {
  for (const id in backEndPlayers) {
    const backEndPlayer = backEndPlayers[id];

    if (!frontEndPlayers[id]) {
      frontEndPlayers[id] = new Player({
        x: backEndPlayer.x,
        y: backEndPlayer.y,
        radius: 10,
        color: backEndPlayer.color,
        username: backEndPlayer.username,
      });

      document.querySelector(
        "#playerLabels"
      ).innerHTML += `<div data-id="${id}" data-score="${backEndPlayer.score}">${backEndPlayer.username}: ${backEndPlayer.score}</div>`;
    } else {
      document.querySelector(
        `div[data-id="${id}"]`
      ).innerHTML = `${backEndPlayer.username}: ${backEndPlayer.score}`;

      document
        .querySelector(`div[data-id="${id}"]`)
        .setAttribute("data-score", backEndPlayer.score);

      // sorts the players divs
      const parentDiv = document.querySelector("#playerLabels");
      const childDivs = Array.from(parentDiv.querySelectorAll("div"));

      childDivs.sort((a, b) => {
        const scoreA = Number(a.getAttribute("data-score"));
        const scoreB = Number(b.getAttribute("data-score"));

        return scoreB - scoreA;
      });

      // removes old elements
      childDivs.forEach((div) => {
        parentDiv.removeChild(div);
      });

      // adds sorted elements
      childDivs.forEach((div) => {
        parentDiv.appendChild(div);
      });

      frontEndPlayers[id].target = {
        x: backEndPlayer.x,
        y: backEndPlayer.y,
      };

      if (id === socket.id) {
        const lastBackendInputIndex = playerInputs.findIndex((input) => {
          return backEndPlayer.sequenceNumber === input.sequenceNumber;
        });

        if (lastBackendInputIndex > -1)
          playerInputs.splice(0, lastBackendInputIndex + 1);

        playerInputs.forEach((input) => {
          frontEndPlayers[id].target.x += input.dx;
          frontEndPlayers[id].target.y += input.dy;
        });
      }
    }
  }

  // this is where we delete frontend players
  for (const id in frontEndPlayers) {
    if (!backEndPlayers[id]) {
      const divToDelete = document.querySelector(`div[data-id="${id}"]`);
      divToDelete.parentNode.removeChild(divToDelete);
      const angle = calculateAngle(
        event.clientX,
        event.clientY,
        frontEndPlayers[socket.id].x,
        frontEndPlayers[socket.id].y
      );

      if (id === socket.id) {
        document.querySelector("#usernameForm").style.display = "block";
      }

      delete frontEndPlayers[id];
    }
  }
});

let animationId;
let cameraX = 0;
let cameraY = 0;
const ARENA_WIDTH = 10000;
const ARENA_HEIGHT = 10000;

const MINIMAP_SIZE = 150;
minimapCanvas.width = MINIMAP_SIZE;
minimapCanvas.height = MINIMAP_SIZE;
const minimapScale = MINIMAP_SIZE / Math.max(ARENA_WIDTH, ARENA_HEIGHT);

function animate() {
  animationId = requestAnimationFrame(animate);
  // c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.clearRect(0, 0, canvas.width, canvas.height);
  if (frontEndPlayers[socket.id]) {
    cameraX =
      frontEndPlayers[socket.id].x - canvas.width / (2 * devicePixelRatio);
    cameraY =
      frontEndPlayers[socket.id].y - canvas.height / (2 * devicePixelRatio);

    // Clamp camera position to arena bounds
    cameraX = Math.max(
      0,
      Math.min(cameraX, ARENA_WIDTH - canvas.width / devicePixelRatio)
    );
    cameraY = Math.max(
      0,
      Math.min(cameraY, ARENA_HEIGHT - canvas.height / devicePixelRatio)
    );
  }
  c.save();
  c.translate(-cameraX, -cameraY);
  minimapCtx.clearRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);
  minimapCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
  minimapCtx.fillRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);
  for (const id in frontEndPlayers) {
    const frontEndPlayer = frontEndPlayers[id];

    minimapCtx.beginPath();
    minimapCtx.arc(
      frontEndPlayer.x * minimapScale,
      frontEndPlayer.y * minimapScale,
      3,
      0,
      Math.PI * 2
    );
    minimapCtx.fillStyle = frontEndPlayer.color;
    minimapCtx.fill();

    // linear interpolation
    if (frontEndPlayer.target) {
      frontEndPlayers[id].x +=
        (frontEndPlayers[id].target.x - frontEndPlayers[id].x) * 0.5;
      frontEndPlayers[id].y +=
        (frontEndPlayers[id].target.y - frontEndPlayers[id].y) * 0.5;
    }

    frontEndPlayer.draw();
  }

  const viewportWidth = canvas.width / devicePixelRatio;
  const viewportHeight = canvas.height / devicePixelRatio;
  minimapCtx.strokeStyle = "white";
  minimapCtx.strokeRect(
    cameraX * minimapScale,
    cameraY * minimapScale,
    viewportWidth * minimapScale,
    viewportHeight * minimapScale
  );

  for (const id in frontEndProjectiles) {
    const frontEndProjectile = frontEndProjectiles[id];
    frontEndProjectile.draw();
  }
  c.restore();
  // for (let i = frontEndProjectiles.length - 1; i >= 0; i--) {
  //   const frontEndProjectile = frontEndProjectiles[i]
  //   frontEndProjectile.update()
  // }
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  c.scale(devicePixelRatio, devicePixelRatio);
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const SPEED = 5;
const playerInputs = [];
let sequenceNumber = 0;
setInterval(() => {
  if (keys.w.pressed) {
    sequenceNumber++;
    playerInputs.push({ sequenceNumber, dx: 0, dy: -SPEED });
    // frontEndPlayers[socket.id].y -= SPEED
    socket.emit("keydown", { keycode: "KeyW", sequenceNumber });
  }

  if (keys.a.pressed) {
    sequenceNumber++;
    playerInputs.push({ sequenceNumber, dx: -SPEED, dy: 0 });
    // frontEndPlayers[socket.id].x -= SPEED
    socket.emit("keydown", { keycode: "KeyA", sequenceNumber });
  }

  if (keys.s.pressed) {
    sequenceNumber++;
    playerInputs.push({ sequenceNumber, dx: 0, dy: SPEED });
    // frontEndPlayers[socket.id].y += SPEED
    socket.emit("keydown", { keycode: "KeyS", sequenceNumber });
  }

  if (keys.d.pressed) {
    sequenceNumber++;
    playerInputs.push({ sequenceNumber, dx: SPEED, dy: 0 });
    // frontEndPlayers[socket.id].x += SPEED
    socket.emit("keydown", { keycode: "KeyD", sequenceNumber });
  }
}, 15);

window.addEventListener("keydown", (event) => {
  if (!frontEndPlayers[socket.id]) return;

  switch (event.code) {
    case "KeyW":
      keys.w.pressed = true;
      break;

    case "KeyA":
      keys.a.pressed = true;
      break;

    case "KeyS":
      keys.s.pressed = true;
      break;

    case "KeyD":
      keys.d.pressed = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  if (!frontEndPlayers[socket.id]) return;

  switch (event.code) {
    case "KeyW":
      keys.w.pressed = false;
      break;

    case "KeyA":
      keys.a.pressed = false;
      break;

    case "KeyS":
      keys.s.pressed = false;
      break;

    case "KeyD":
      keys.d.pressed = false;
      break;
  }
});

document.querySelector("#usernameForm").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#usernameForm").style.display = "none";
  socket.emit("initGame", {
    width: canvas.width,
    height: canvas.height,
    devicePixelRatio,
    username: document.querySelector("#usernameInput").value,
  });
});
