import React, { useRef, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const App = () => {
  const canvasRef = useRef(null);
  const [socket, setSocket] = useState<null | Socket>(null);
  const [frontEndPlayers, setFrontEndPlayers] = useState({});
  const [frontEndProjectiles, setFrontEndProjectiles] = useState({});
  const [keys, setKeys] = useState({
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
  });

  useEffect(() => {
    setSocket(io());

    const canvas = canvasRef.current;
    const c = canvas.getContext("2d");
    const devicePixelRatio = window.devicePixelRatio || 1;

    canvas.width = 1024 * devicePixelRatio;
    canvas.height = 576 * devicePixelRatio;
    c.scale(devicePixelRatio, devicePixelRatio);

    newSocket.on("updateProjectiles", handleUpdateProjectiles);
    newSocket.on("updatePlayers", handleUpdatePlayers);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      newSocket.off("updateProjectiles", handleUpdateProjectiles);
      newSocket.off("updatePlayers", handleUpdatePlayers);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (gameState) {
      animate();
    }
  }, [gameState]);

  const handleUpdateProjectiles = (backEndProjectiles) => {
    // Update frontEndProjectiles based on backEndProjectiles
    // (Similar to the original updateProjectiles logic)
  };

  const handleUpdatePlayers = (backEndPlayers) => {
    // Update frontEndPlayers based on backEndPlayers
    // (Similar to the original updatePlayers logic)
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const c = canvas.getContext("2d");

    c.clearRect(0, 0, canvas.width, canvas.height);

    Object.values(frontEndPlayers).forEach((player) => {
      // Update player positions
      player.draw(c);
    });

    Object.values(frontEndProjectiles).forEach((projectile) => {
      projectile.draw(c);
    });
  };

  const handleKeyDown = (event) => {
    if (!frontEndPlayers[socket.id]) return;

    const newKeys = { ...keys };
    switch (event.code) {
      case "KeyW":
        newKeys.w.pressed = true;
        break;
      case "KeyA":
        newKeys.a.pressed = true;
        break;
      case "KeyS":
        newKeys.s.pressed = true;
        break;
      case "KeyD":
        newKeys.d.pressed = true;
        break;
    }
    setKeys(newKeys);
  };

  const handleKeyUp = (event) => {
    if (!frontEndPlayers[socket.id]) return;

    const newKeys = { ...keys };
    switch (event.code) {
      case "KeyW":
        newKeys.w.pressed = false;
        break;
      case "KeyA":
        newKeys.a.pressed = false;
        break;
      case "KeyS":
        newKeys.s.pressed = false;
        break;
      case "KeyD":
        newKeys.d.pressed = false;
        break;
    }
    setKeys(newKeys);
  };

  const handleUsernameSubmit = (event) => {
    event.preventDefault();
    const usernameInput = event.target.elements.usernameInput;
    socket.emit("initGame", {
      width: canvasRef.current.width,
      height: canvasRef.current.height,
      devicePixelRatio: window.devicePixelRatio || 1,
      username: usernameInput.value,
    });
    // Hide the form
    event.target.style.display = "none";
  };

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      <div id="playerLabels"></div>
      <form id="usernameForm" onSubmit={handleUsernameSubmit}>
        <input id="usernameInput" type="text" placeholder="Username" required />
        <button type="submit">Start Game</button>
      </form>
    </div>
  );
};

export default App;
