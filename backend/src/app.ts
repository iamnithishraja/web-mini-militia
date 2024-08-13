import { Server } from "./server";
import { SocketManager } from "./socketManager";
import { GameState } from "./gameState";

class App {
  private static instance: App;
  private server: Server;
  private socketManager: SocketManager;
  private gameState: GameState;

  private constructor() {
    this.server = Server.getInstance();
    this.gameState = GameState.getInstance();
    this.socketManager = SocketManager.getInstance();

    this.initialize();
  }

  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  private initialize(): void {
    this.server.start();
    this.startGameLoop();
  }

  private startGameLoop(): void {
    setInterval(() => {
      this.gameState.updateProjectiles();
      this.socketManager.emitGameState();
    }, 15);
  }
}

const app = App.getInstance();
