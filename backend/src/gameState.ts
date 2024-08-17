import {
  SPEED,
  RADIUS,
  PROJECTILE_RADIUS,
  ARENA_WIDTH,
  ARENA_HEIGHT,
} from "./constents";

interface Player {
  x: number;
  y: number;
  color: string;
  sequenceNumber: number;
  score: number;
  username: string;
  canvas: { width: number; height: number };
  radius: number;
}

interface Projectile {
  x: number;
  y: number;
  velocity: { x: number; y: number };
  playerId: string;
}

export class GameState {
  private static instance: GameState;
  private players: { [key: string]: Player };
  private projectiles: { [key: string]: Projectile };
  private projectileId: number;

  private constructor() {
    this.players = {};
    this.projectiles = {};
    this.projectileId = 0;
  }

  public static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  public getPlayers(): { [key: string]: Player } {
    return this.players;
  }

  public getProjectiles(): { [key: string]: Projectile } {
    return this.projectiles;
  }

  public addPlayer(
    id: string,
    username: string,
    width: number,
    height: number
  ): void {
    this.players[id] = {
      // x: ARENA_WIDTH * Math.random(),
      // y: ARENA_HEIGHT * Math.random(),
      x: 0,
      y: 0,
      color: `hsl(${360 * Math.random()}, 100%, 50%)`,
      sequenceNumber: 0,
      score: 0,
      username,
      canvas: { width, height },
      radius: RADIUS,
    };
  }

  public removePlayer(id: string): void {
    delete this.players[id];
  }

  public addProjectile(
    playerId: string,
    x: number,
    y: number,
    angle: number
  ): void {
    this.projectileId++;
    this.projectiles[this.projectileId] = {
      x,
      y,
      velocity: {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5,
      },
      playerId,
    };
  }

  public updatePlayerPosition(
    id: string,
    keycode: string,
    sequenceNumber: number
  ): void {
    const player = this.players[id];
    if (!player) return;

    player.sequenceNumber = sequenceNumber;
    
    switch (keycode) {
      case "KeyW":
        player.y -= SPEED;
        break;
      case "KeyA":
        player.x -= SPEED;
        break;
      case "KeyS":
        player.y += SPEED;
        break;
      case "KeyD":
        player.x += SPEED;
        break;
    }

    this.keepPlayerInBounds(player);
  }

  private keepPlayerInBounds(player: Player): void {
    if (player.x - player.radius < 0) player.x = player.radius;
    if (player.x + player.radius > ARENA_WIDTH)
      player.x = ARENA_WIDTH - player.radius;
    if (player.y - player.radius < 0) player.y = player.radius;
    if (player.y + player.radius > ARENA_HEIGHT)
      player.y = ARENA_HEIGHT - player.radius;
  }

  public updateProjectiles(): void {
    for (const id in this.projectiles) {
      const projectile = this.projectiles[id];
      projectile.x += projectile.velocity.x;
      projectile.y += projectile.velocity.y;

      if (this.isProjectileOutOfBounds(projectile)) {
        delete this.projectiles[id];
        continue;
      }

      this.checkProjectileCollisions(id, projectile);
    }
  }

  private isProjectileOutOfBounds(projectile: Projectile): boolean {
    const player = this.players[projectile.playerId];
    if (!player) return true;

    return (
      projectile.x - PROJECTILE_RADIUS >= player.canvas.width ||
      projectile.x + PROJECTILE_RADIUS <= 0 ||
      projectile.y - PROJECTILE_RADIUS >= player.canvas.height ||
      projectile.y + PROJECTILE_RADIUS <= 0
    );
  }

  private checkProjectileCollisions(id: string, projectile: Projectile): void {
    for (const playerId in this.players) {
      const player = this.players[playerId];
      const distance = Math.hypot(
        projectile.x - player.x,
        projectile.y - player.y
      );

      if (
        distance < PROJECTILE_RADIUS + player.radius &&
        projectile.playerId !== playerId
      ) {
        if (this.players[projectile.playerId]) {
          this.players[projectile.playerId].score++;
        }
        delete this.projectiles[id];
        delete this.players[playerId];
        break;
      }
    }
  }
}
