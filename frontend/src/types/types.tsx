export interface EnemyProps {
  x: number;
  y: number;
  radius: number;
  color: string;
  velocity: {
    x: number;
    y: number;
  };
}

export interface ProjectileProps {
  x: number;
  y: number;
  radius: number;
  color?: string;
  velocity: {
    x: number;
    y: number;
  };
}
