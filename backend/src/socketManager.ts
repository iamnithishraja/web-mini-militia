import { Server as SocketIOServer, Socket } from "socket.io";
import { GameState } from "./gameState";
import { Server } from "./server";
import { ARENA_HEIGHT, ARENA_WIDTH } from "./constents";

export class SocketManager {
  private static instance: SocketManager;
  private io: SocketIOServer;
  private gameState: GameState;

  private constructor() {
    this.io = Server.getInstance().getIO();
    this.gameState = GameState.getInstance();
    this.setupSocketEvents();
  }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  private setupSocketEvents(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log("a user connected");

      this.emitGameState();

      socket.on("shoot", ({ x, y, angle }) => {
        this.gameState.addProjectile(socket.id, x, y, angle);
      });

      socket.on("initGame", ({ username }) => {
        this.gameState.addPlayer(
          socket.id,
          username,
          ARENA_WIDTH,
          ARENA_HEIGHT
        );
      });

      socket.on("disconnect", (reason) => {
        console.log(reason);
        this.gameState.removePlayer(socket.id);
        this.emitGameState();
      });

      socket.on("keydown", ({ keycode, sequenceNumber }) => {
        this.gameState.updatePlayerPosition(socket.id, keycode, sequenceNumber);
      });
    });
  }

  public emitGameState(): void {
    this.io.emit("updatePlayers", this.gameState.getPlayers());
    this.io.emit("updateProjectiles", this.gameState.getProjectiles());
  }
}
