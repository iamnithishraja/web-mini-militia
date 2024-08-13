export interface Position {
  x: number;
  y: number;
}

export interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface PlayerProps {
  position: Position;
}

export interface WorldProps {
  position: Position;
  width: number;
  height: number;
}
