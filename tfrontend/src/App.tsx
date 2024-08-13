import React, { useState, useCallback, useEffect } from "react";
import World from "./components/world";
import Player from "./components/player";
import {
  worldHeight,
  worldWidth,
  viewportHeight,
  viewportWidth,
  playerWidth,
  playerHeight,
} from "./constents/worldContents";
import { playerAtom } from "./atoms/gameAtoms";
import { Position } from "./types/types";
import { useRecoilState } from "recoil";

const App: React.FC = () => {
  const [worldPosition, setWorldPosition] = useState<Position>({ x: 0, y: 0 });
  const [playerPosition, setplayerPosition] =
    useRecoilState<Position>(playerAtom);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  const moveCube = useCallback(
    (dx: number, dy: number) => {
      setplayerPosition((prev) => {
        const newX = Math.max(
          0,
          Math.min(prev.x + dx, viewportWidth - playerWidth)
        );
        const newY = Math.max(
          0,
          Math.min(prev.y + dy, viewportHeight - playerHeight)
        );
        return { x: newX, y: newY };
      });

      setWorldPosition((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        if (
          playerPosition.x > viewportWidth * 0.3 &&
          playerPosition.x < viewportWidth * 0.7
        ) {
          newX = Math.max(0, Math.min(prev.x + dx, worldWidth - viewportWidth));
        }
        if (
          playerPosition.y > viewportHeight * 0.3 &&
          playerPosition.y < viewportHeight * 0.7
        ) {
          newY = Math.max(
            0,
            Math.min(prev.y + dy, worldHeight - viewportHeight)
          );
        }

        return { x: newX, y: newY };
      });
    },
    [
      playerPosition,
      viewportWidth,
      viewportHeight,
      worldWidth,
      worldHeight,
      playerPosition,
      setplayerPosition,
      setWorldPosition,
    ]
  );

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    setKeysPressed((prev) => {
      const newSet = new Set(prev);
      newSet.delete(event.key.toLowerCase());
      return newSet;
    });
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    setKeysPressed((prev) => new Set(prev).add(event.key.toLowerCase()));
  }, []);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      let dx = 0;
      let dy = 0;

      if (keysPressed.has("w")) dy -= 5;
      if (keysPressed.has("s")) dy += 5;
      if (keysPressed.has("a")) dx -= 5;
      if (keysPressed.has("d")) dx += 5;

      if (dx !== 0 || dy !== 0) {
        moveCube(dx, dy);
      }
    }, 16);
    return () => clearInterval(moveInterval);
  }, [keysPressed, moveCube]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div
        className="relative overflow-hidden bg-gray-300 border-4 border-gray-400"
        style={{ width: `${viewportWidth}px`, height: `${viewportHeight}px` }}
      >
        <World
          position={worldPosition}
          width={worldWidth}
          height={worldHeight}
        />
        <Player position={playerPosition} />
      </div>
    </div>
  );
};

export default App;
