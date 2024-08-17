import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import cors from "cors";

export class Server {
  private static instance: Server;
  private app: express.Application;
  private server: http.Server;
  private io: SocketIOServer;
  private port: number = 80;

  private constructor() {
    this.app = express();
    this.app.use(
      cors({
        origin: "*",
        allowedHeaders: "*",
      })
    );

    this.server = http.createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: "*",
        allowedHeaders: "*",
      },
      pingInterval: 2000,
      pingTimeout: 5000,
    });

    this.configureApp();
  }

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }

  private configureApp(): void {
    this.app.use(express.static("public"));
    this.app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../public/index.html"));
    });
  }

  public start(): void {
    this.server.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }

  public getIO(): SocketIOServer {
    return this.io;
  }
}
