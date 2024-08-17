import React from "react";
import { EnemyProps } from "../types/types";

const Enemy: React.FC<EnemyProps> = ({ x, y, radius, color, velocity }) => {
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
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};

export default Enemy;
