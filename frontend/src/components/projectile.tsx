import React from "react";
import { ProjectileProps } from "../types/types";

const Projectile: React.FC<ProjectileProps> = ({
  x,
  y,
  radius,
  color = "white",
  velocity,
}) => {
  const [position, setPosition] = React.useState({ x, y });

  React.useEffect(() => {
    const updatePosition = () => {
      setPosition((prevPosition) => ({
        x: prevPosition.x + velocity.x,
        y: prevPosition.y + velocity.y,
      }));
    };

    const intervalId = setInterval(updatePosition, 16); 

    return () => clearInterval(intervalId);
  }, [velocity]);

  return (
    <div
      className="absolute rounded-full"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        backgroundColor: color,
        boxShadow: `0 0 20px ${color}`,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};

export default Projectile;
