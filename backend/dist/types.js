"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomId = exports.signinZodSchema = exports.signupZodSchema = void 0;
exports.createRoom = createRoom;
exports.addSocketToRoom = addSocketToRoom;
exports.checkPlayer = checkPlayer;
const zod_1 = __importDefault(require("zod"));
const _1 = require(".");
exports.signupZodSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(5),
    userName: zod_1.default.string().min(3).max(20),
});
exports.signinZodSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(5),
});
const getRoomId = () => {
    const length = 6;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let roomId = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        roomId += characters[randomIndex];
    }
    return roomId;
};
exports.getRoomId = getRoomId;
function createRoom(roomId) {
    if (!_1.roomSockets.has(roomId)) {
        _1.roomSockets.set(roomId, new Set());
        console.log(`Room ${roomId} created.`);
    }
}
function addSocketToRoom(roomId, ws) {
    var _a;
    // Check if room exists
    if (!_1.roomSockets.has(roomId)) {
        console.log(`Room ${roomId} does not exist. Creating room...`);
        createRoom(roomId); // Create room if it doesn't exist
    }
    // Add the WebSocket to the room
    (_a = _1.roomSockets.get(roomId)) === null || _a === void 0 ? void 0 : _a.add(ws);
    console.log(`WebSocket added to room: ${roomId}`);
}
function checkPlayer(userId, room) {
    room.players.map((player) => {
        if (player.id === userId) {
            return true;
        }
    });
    return false;
}
