"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = exports.clearIntervals = exports.roomSockets = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("redis");
const http_1 = require("http");
const ws_1 = require("ws");
const userRoutes_1 = require("./routes/userRoutes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const url_1 = require("url");
const userEvents_1 = require("./events/userEvents");
const gameEvents_1 = require("./events/gameEvents");
const port = process.env.PORT || 8080;
exports.app = (0, express_1.default)();
const server = (0, http_1.createServer)(exports.app);
const wss = new ws_1.WebSocketServer({ noServer: true });
exports.roomSockets = new Map();
exports.clearIntervals = new Map();
const JWT_SECRET = process.env.JWT_SECRET;
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({
    origin: process.env.FRONTED_URL || "http://localhost:5173",
    credentials: true,
}));
exports.app.use("/", userRoutes_1.userRouter);
// app.get("/", (req: Request, res: Response): any => {
//   return res.status(200).json({
//     message: "hi",
//   });
// });
exports.redis = (0, redis_1.createClient)(Object.assign(Object.assign({ socket: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    } }, (process.env.REDIS_USERNAME
    ? { username: process.env.REDIS_USERNAME }
    : {})), (process.env.REDIS_PASSWORD
    ? { password: process.env.REDIS_PASSWORD }
    : {})));
exports.redis.on("error", (err) => {
    console.error("Redis connection error:", err);
});
exports.redis.on("ready", () => {
    console.log("Connected to Redis");
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.redis.connect();
        console.log("Connected to Redis");
    }
    catch (error) {
        console.error("Failed to connect to Redis:", error);
    }
}))();
function onSocketError(err) {
    console.error(err);
}
server.on("upgrade", (req, socket, head) => {
    const { query } = (0, url_1.parse)(req.url, true);
    const token = query.token;
    if (!token) {
        console.log(`token not found while upgrading`);
        socket.destroy(); // Reject upgrade if no token
        return;
    }
    socket.on("error", onSocketError);
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const userId = payload.userId;
        console.log("printing starting");
        console.log(`Upgrading connection for user ${userId}`);
        // Upgrade the connection to WebSocket
        wss.handleUpgrade(req, socket, head, (ws) => {
            ws.userId = userId;
            console.log("connecting ws:", ws.userId);
            wss.emit("connection", ws, req);
        });
    }
    catch (error) {
        console.log("Invalid token, rejecting WebSocket upgrade.");
        socket.destroy();
    }
});
wss.on("connection", (ws, req) => {
    console.log(`User ${ws.userId} connected to WebSocket`);
    ws.send(JSON.stringify({ message: `Welcome ${ws.userId}` }));
    ws.onmessage = (event) => {
        (0, userEvents_1.userEvents)(ws, event.data);
        (0, gameEvents_1.gameEvents)(ws, event.data);
    };
    ws.onclose = (event) => { };
});
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
