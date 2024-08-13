import React, { useEffect, useState } from "react";
import { PlayerProps } from "../types/types";
import { useRecoilState } from "recoil";
import { playerRotationAtom } from "../atoms/gameAtoms";

const SpaceShip: React.FC<PlayerProps> = ({ position }) => {
  const size = 80;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [playerRotation, setPlayerRotation] =
    useRecoilState(playerRotationAtom);
  const bodyWidth = size;
  const bodyHeight = size * 1.5;
  const cockpitSize = bodyWidth * 0.6;
  const engineSize = bodyWidth * 0.3;
  const wingWidth = bodyWidth * 0.8;
  const wingHeight = bodyHeight * 0.2;

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const dx = mousePosition.x - (position.x + bodyWidth / 2);
    const dy = mousePosition.y - (position.y + bodyHeight / 2);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    setPlayerRotation(angle + 90);
  }, [mousePosition, position]);

  return (
    <div
      className="absolute z-10"
      style={{
        width: `${bodyWidth}px`,
        height: `${bodyHeight}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: "all 0.1s",
        transform: `rotate(${playerRotation}deg)`,
      }}
    >
      {/* Main body */}
      <div
        className="absolute bg-gray-700 rounded-t-full"
        style={{
          width: `${bodyWidth}px`,
          height: `${bodyHeight}px`,
        }}
      />

      {/* Cockpit */}
      <div
        className="absolute bg-blue-400 rounded-full"
        style={{
          width: `${cockpitSize}px`,
          height: `${cockpitSize}px`,
          left: `${(bodyWidth - cockpitSize) / 2}px`,
          top: `${bodyHeight * 0.1}px`,
        }}
      >
        {/* Cockpit shine */}
        <div
          className="absolute bg-blue-200 rounded-full"
          style={{
            width: `${cockpitSize * 0.3}px`,
            height: `${cockpitSize * 0.3}px`,
            left: `${cockpitSize * 0.1}px`,
            top: `${cockpitSize * 0.1}px`,
          }}
        />
      </div>

      {/* Wings */}
      <div
        className="absolute bg-red-500"
        style={{
          width: `${wingWidth}px`,
          height: `${wingHeight}px`,
          left: `${(bodyWidth - wingWidth) / 2}px`,
          top: `${bodyHeight * 0.5}px`,
          clipPath: "polygon(0 50%, 50% 0, 100% 50%, 50% 100%)",
        }}
      />

      {/* Engines */}
      <div
        className="absolute bg-orange-500 rounded-b-full"
        style={{
          width: `${engineSize}px`,
          height: `${engineSize * 1.5}px`,
          left: `${bodyWidth * 0.2}px`,
          bottom: `0px`,
        }}
      >
        {/* Engine flame */}
        <div
          className="absolute bg-yellow-300 rounded-b-full animate-pulse"
          style={{
            width: `${engineSize * 0.6}px`,
            height: `${engineSize}px`,
            left: `${engineSize * 0.2}px`,
            bottom: `${-engineSize * 0.5}px`,
          }}
        />
      </div>
      <div
        className="absolute bg-orange-500 rounded-b-full"
        style={{
          width: `${engineSize}px`,
          height: `${engineSize * 1.5}px`,
          right: `${bodyWidth * 0.2}px`,
          bottom: `0px`,
        }}
      >
        {/* Engine flame */}
        <div
          className="absolute bg-yellow-300 rounded-b-full animate-pulse"
          style={{
            width: `${engineSize * 0.6}px`,
            height: `${engineSize}px`,
            left: `${engineSize * 0.2}px`,
            bottom: `${-engineSize * 0.5}px`,
          }}
        />
      </div>

      {/* Weapon */}
      <div
        className="absolute bg-gray-400 rounded-full"
        style={{
          width: `${bodyWidth * 0.1}px`,
          height: `${bodyWidth * 0.3}px`,
          left: `${bodyWidth * 0.45}px`,
          top: `${-bodyWidth * 0.2}px`,
        }}
      />
    </div>
  );
};

export default SpaceShip;
