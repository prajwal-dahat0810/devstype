import express, { Application } from "express";
import jwt from "jsonwebtoken";
import { createClient } from "redis";
import { createServer } from "http";
import { Router, Request, Response } from "express";
import { WebSocketServer, WebSocket } from "ws";
import { userRouter } from "./routes/userRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { parse } from "url";
import { userEvents } from "./events/userEvents";
import { gameEvents } from "./events/gameEvents";
import { userWebSocket } from "./types";
const port = process.env.PORT || 8080;
export const app = express();
const server = createServer(app);

const wss = new WebSocketServer({ noServer: true });

export const roomSockets: Map<string, Set<userWebSocket>> = new Map<
  string,
  Set<userWebSocket>
>();
export const clearIntervals = new Map<string, NodeJS.Timeout>();

const JWT_SECRET = process.env.JWT_SECRET;
app.use(cookieParser());
app.use(express.json());
const origins = [process.env.FRONTED_URL as string, "http://localhost:5173"];
app.use(
  cors({
    origin: origins,
    credentials: true,
  })
);
app.use("/", userRouter);

export const redis = createClient({
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
  },
  ...(process.env.REDIS_USERNAME
    ? { username: process.env.REDIS_USERNAME }
    : {}),
  ...(process.env.REDIS_PASSWORD
    ? { password: process.env.REDIS_PASSWORD }
    : {}),
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redis.on("ready", () => {
  console.log("Connected to Redis");
});

(async () => {
  try {
    await redis.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
})();

function onSocketError(err: any) {
  console.error(err);
}

server.on("upgrade", (req: any, socket, head) => {
  const { query } = parse(req.url!, true);
  const token = query.token as string;

  if (!token) {
    console.log(`token not found while upgrading`);
    socket.destroy(); // Reject upgrade if no token
    return;
  }
  socket.on("error", onSocketError);
  try {
    const payload = jwt.verify(token, JWT_SECRET as string) as {
      userId: string;
    };
    const userId = payload.userId;
    console.log(`Upgrading connection for user ${userId}`);

    // Upgrade the connection to WebSocket
    wss.handleUpgrade(req, socket, head, (ws: any) => {
      ws.userId = userId;
      console.log("connecting ws:", ws.userId);
      wss.emit("connection", ws, req);
    });
  } catch (error) {
    console.log("Invalid token, rejecting WebSocket upgrade.");
    socket.destroy();
  }
});

wss.on("connection", (ws: userWebSocket, req: Request) => {
  console.log(`User ${ws.userId} connected to WebSocket`);

  ws.send(JSON.stringify({ message: `Welcome ${ws.userId}` }));

  ws.onmessage = (event) => {
    userEvents(ws, event.data);
    gameEvents(ws, event.data);
  };
  ws.onclose = (event) => {};
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
