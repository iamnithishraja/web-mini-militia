import { useRecoilState, useRecoilValue } from "recoil";
import { WorldProps } from "../types/types";
import {
  bulletsAtom,
  playerAtom,
  playerRotationAtom,
  // playerRotationAtom,
} from "../atoms/gameAtoms";
import { useEffect } from "react";
import Bullet from "./particle";

const World: React.FC<WorldProps> = ({ position, width, height }) => {
  const playerPosition = useRecoilValue(playerAtom);
  const playerRotation = useRecoilValue(playerRotationAtom);

  const [bullets, setBullets] = useRecoilState(bulletsAtom);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        fireBullet();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playerPosition]);

  const fireBullet = () => {
    const newBullet = {
      x: playerPosition.x,
      y: playerPosition.y,
      vx: Math.cos(playerRotation) * 5,
      vy: Math.sin(playerRotation) * 5,
    };

    // Add new bullet to the state
    setBullets((prevBullets) => [...prevBullets, newBullet]);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBullets((prevBullets) =>
        prevBullets
          .map((bullet) => ({
            ...bullet,
            x: bullet.x + bullet.vx,
            y: bullet.y + bullet.vy,
          }))
          .filter(
            (bullet) =>
              bullet.x > 0 &&
              bullet.x < width &&
              bullet.y > 0 &&
              bullet.y < height
          )
      );
    }, 16); // roughly 60 fps

    return () => clearInterval(intervalId);
  }, [width, height]);

  return (
    <div
      className="absolute bg-black"
      style={{
        opacity: "80%",
        width: `${width}px`,
        height: `${height}px`,
        left: `${-position.x}px`,
        top: `${-position.y}px`,
        transition: "all 0.1s",
      }}
    >
      {/* Stars */}
      <div
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{ left: "100px", top: "50px" }}
      />
      <div
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{ left: "300px", top: "150px" }}
      />
      <div
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{ left: "500px", top: "250px" }}
      />
      <div
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{ left: "700px", top: "100px" }}
      />
      <div
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{ left: "900px", top: "200px" }}
      />
      <div
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{ left: "1100px", top: "300px" }}
      />
      <div
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{ left: "1300px", top: "150px" }}
      />
      <div
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{ left: "1500px", top: "250px" }}
      />
      <div
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{ left: "1700px", top: "50px" }}
      />
      <div
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{ left: "1900px", top: "350px" }}
      />

      {/* Planets */}
      <div
        className="absolute bg-red-600 rounded-full"
        style={{ width: "40px", height: "40px", left: "200px", top: "400px" }}
      />
      <div
        className="absolute bg-blue-400 rounded-full"
        style={{ width: "60px", height: "60px", left: "800px", top: "600px" }}
      />
      <div
        className="absolute bg-yellow-300 rounded-full"
        style={{ width: "30px", height: "30px", left: "1400px", top: "200px" }}
      />
      <div
        className="absolute bg-green-500 rounded-full"
        style={{ width: "50px", height: "50px", left: "2000px", top: "500px" }}
      />
      <div
        className="absolute bg-purple-400 rounded-full"
        style={{ width: "35px", height: "35px", left: "2600px", top: "300px" }}
      />

      {/* Asteroids */}
      <div
        className="absolute bg-gray-600 rounded-lg"
        style={{ width: "10px", height: "8px", left: "500px", top: "300px" }}
      />
      <div
        className="absolute bg-gray-700 rounded-lg"
        style={{ width: "12px", height: "10px", left: "1100px", top: "700px" }}
      />
      <div
        className="absolute bg-gray-500 rounded-lg"
        style={{ width: "8px", height: "6px", left: "1700px", top: "500px" }}
      />
      <div
        className="absolute bg-gray-800 rounded-lg"
        style={{ width: "14px", height: "12px", left: "2300px", top: "200px" }}
      />
      <div
        className="absolute bg-gray-400 rounded-lg"
        style={{ width: "9px", height: "7px", left: "2900px", top: "600px" }}
      />

      {/* Nebulae */}
      <div
        className="absolute bg-purple-300 opacity-30 rounded-full"
        style={{ width: "200px", height: "100px", left: "300px", top: "800px" }}
      />
      <div
        className="absolute bg-blue-200 opacity-30 rounded-full"
        style={{
          width: "180px",
          height: "120px",
          left: "1200px",
          top: "400px",
        }}
      />
      {/* Render Bullets */}
      {bullets.map((bullet, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${bullet.x - position.x}px`,
            top: `${bullet.y - position.y}px`,
            transform: `translate(-50%, -50%)`,
          }}
        >
          <Bullet />
        </div>
      ))}
      <div
        className="absolute bg-red-200 opacity-30 rounded-full"
        style={{
          width: "220px",
          height: "140px",
          left: "2100px",
          top: "700px",
        }}
      />

      {/* Comets */}
      <div
        className="absolute bg-white rounded-full transform rotate-45"
        style={{ width: "20px", height: "4px", left: "600px", top: "100px" }}
      />
      <div
        className="absolute bg-white rounded-full transform -rotate-30"
        style={{ width: "24px", height: "4px", left: "1500px", top: "600px" }}
      />
      <div
        className="absolute bg-white rounded-full transform rotate-15"
        style={{ width: "18px", height: "3px", left: "2400px", top: "400px" }}
      />

      {/* Space stations */}
      <div
        className="absolute bg-gray-300"
        style={{ width: "30px", height: "10px", left: "900px", top: "350px" }}
      />
      <div
        className="absolute bg-gray-400"
        style={{ width: "25px", height: "15px", left: "1800px", top: "250px" }}
      />
      <div
        className="absolute bg-gray-200"
        style={{ width: "35px", height: "12px", left: "2700px", top: "450px" }}
      />

      {/* Alien structures */}
      <div
        className="absolute bg-green-700"
        style={{ width: "40px", height: "60px", left: "400px", top: "500px" }}
      />
      <div
        className="absolute bg-purple-800"
        style={{ width: "50px", height: "40px", left: "1300px", top: "300px" }}
      />
      <div
        className="absolute bg-blue-900"
        style={{ width: "45px", height: "55px", left: "2200px", top: "600px" }}
      />

      {/* Black holes */}
      <div
        className="absolute bg-black border-4 border-white rounded-full"
        style={{ width: "80px", height: "80px", left: "700px", top: "200px" }}
      />
      <div
        className="absolute bg-black border-4 border-white rounded-full"
        style={{
          width: "100px",
          height: "100px",
          left: "1600px",
          top: "500px",
        }}
      />
      <div
        className="absolute bg-black border-4 border-white rounded-full"
        style={{ width: "70px", height: "70px", left: "2500px", top: "300px" }}
      />

      {/* Galaxies */}
      <div
        className="absolute bg-yellow-100 opacity-40 rounded-full transform rotate-45"
        style={{ width: "150px", height: "100px", left: "100px", top: "700px" }}
      />
      <div
        className="absolute bg-blue-100 opacity-40 rounded-full transform -rotate-30"
        style={{
          width: "180px",
          height: "120px",
          left: "1000px",
          top: "200px",
        }}
      />
      <div
        className="absolute bg-red-100 opacity-40 rounded-full transform rotate-15"
        style={{
          width: "200px",
          height: "140px",
          left: "1900px",
          top: "600px",
        }}
      />

      {/* Space debris */}
      <div
        className="absolute bg-gray-500"
        style={{ width: "5px", height: "5px", left: "250px", top: "450px" }}
      />
      <div
        className="absolute bg-gray-600"
        style={{ width: "4px", height: "4px", left: "750px", top: "550px" }}
      />
      <div
        className="absolute bg-gray-400"
        style={{ width: "6px", height: "6px", left: "1250px", top: "350px" }}
      />
      <div
        className="absolute bg-gray-700"
        style={{ width: "3px", height: "3px", left: "1750px", top: "650px" }}
      />
      <div
        className="absolute bg-gray-300"
        style={{ width: "5px", height: "5px", left: "2250px", top: "250px" }}
      />

      {/* Add more elements as needed to reach about 100 lines */}
    </div>
  );
};

export default World;
