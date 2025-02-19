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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSocketFromRoom = removeSocketFromRoom;
exports.startSendingUpdates = startSendingUpdates;
const __1 = require("..");
function removeSocketFromRoom(roomId, ws) {
    const room = __1.roomSockets.get(roomId);
    if (room) {
        room.delete(ws);
        // console.log(`WebSocket removed from room: ${roomId}`);
    }
    else {
        console.log(`Room ${roomId} does not exist.`);
    }
}
function startSendingUpdates(roomId, updatedRoom, clients) {
    return __awaiter(this, void 0, void 0, function* () {
        const timeInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            const progress = yield Promise.all(updatedRoom.players.map((player) => __awaiter(this, void 0, void 0, function* () {
                const progress = yield __1.redis.get(`progress:${roomId}-${player.id}`);
                return {
                    progress: progress
                        ? JSON.parse(progress)
                        : { time: 0, wpm: 0, accuracy: 0, totalTyped: 0 },
                    userName: player.userName,
                    id: player.id,
                };
            })));
            // console.log("progress:", progress);
            clients.forEach((client) => {
                client.send(JSON.stringify({
                    event: "progress-update",
                    data: { progress },
                }));
            });
        }), 800);
        __1.clearIntervals.set(roomId, timeInterval);
    });
}
