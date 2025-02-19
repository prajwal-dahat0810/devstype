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
exports.gameEvents = void 0;
const ws_1 = require("ws");
const __1 = require("..");
const userRoutes_1 = require("../routes/userRoutes");
const redisEvents_1 = require("./redisEvents");
const paragraphs = {
    15: "The sun sets behind the hills, painting the sky in shades of orange and purple.",
    30: "The quick brown fox jumps over the lazy dog. Smooth and accurate typing is essential for efficiency. Consistent practice helps develop speed and precision, making typing a seamless skill over time.",
    40: "Learning to type efficiently improves productivity. Touch typing allows you to focus on your thoughts instead of searching for keys. Consistency is important. Keep practicing daily, and soon your typing speed and accuracy will significantly improve over time.",
};
const gameEvents = (ws, eventData) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ws.userId;
    const { event, data } = JSON.parse(eventData);
    if (event === "update-score") {
        const { roomId, time, wpm, accuracy, totalTyped, wordsLimit } = data;
        const getRoom = yield __1.redis.get(`progress:${roomId}-${userId}`);
        const parsedRoom = JSON.parse(getRoom);
        parsedRoom.time = time;
        parsedRoom.wpm = wpm;
        parsedRoom.accuracy = accuracy;
        parsedRoom.totalTyped = totalTyped;
        const updatedProgress = yield __1.redis.set(`progress:${roomId}-${userId}`, JSON.stringify(parsedRoom || { wpm: 0, time: 0, accuracy: 0, totalTyped: 0 }));
        // console.log("updated", updatedProgress);
        return;
    }
    if (event === "start-game") {
        const { roomId } = data;
        const getRoom = yield __1.redis.get(`room:${roomId}`);
        if (!getRoom) {
            console.log("room not found");
            //
            return ws.send(JSON.stringify({
                event: "game-error",
                data: {
                    message: "Room not found!!!",
                },
            }));
        }
        const parsedRoomData = JSON.parse(getRoom);
        // console.log(parsedRoomData.room.players);
        const wordsLimit = parsedRoomData.wordsLimit;
        const gameType = parsedRoomData.gameType;
        const timeLimit = wordsLimit === 40 ? 150 : wordsLimit === 30 ? 120 : 60;
        try {
            const updatedRoom = yield userRoutes_1.prisma.game.update({
                where: {
                    roomId: roomId,
                },
                data: {
                    state: "IN_PROGRESS",
                    startedAt: new Date().toISOString(),
                    players: {
                        set: parsedRoomData.room.players.map((p) => ({
                            id: Number(p.id),
                        })),
                    },
                },
                select: {
                    roomId: true,
                    startedAt: true,
                    finishAt: true,
                    state: true,
                    players: {
                        select: {
                            id: true,
                            userName: true,
                            email: true,
                        },
                    },
                    createdBy: true,
                },
            });
            parsedRoomData.room = updatedRoom;
            const updatedRedisRoom = yield __1.redis.set(`room:${roomId}`, JSON.stringify(parsedRoomData));
            // console.log(updatedRedisRoom);
            const progress = yield Promise.all(updatedRoom.players.map((player) => __awaiter(void 0, void 0, void 0, function* () {
                yield __1.redis.set(`progress:${roomId}-${player.id}`, JSON.stringify({ time: 0, wpm: 0, accuracy: 0, totalTyped: 0 }));
                return {
                    id: player.id,
                    userName: player.userName,
                    progress: { time: 0, wpm: 0, accuracy: 0, totalTyped: 0 },
                };
            })));
            const clients = __1.roomSockets.get(roomId);
            // console.log(clients?.size);
            if (!clients) {
                return ws.send(JSON.stringify({
                    event: "game-error",
                    data: {
                        message: "Some error happen!!!",
                    },
                }));
            }
            clients.forEach((client) => {
                client.send(JSON.stringify({
                    event: "game-started",
                    data: {
                        paragraph: paragraphs[parsedRoomData.wordsLimit || 15],
                        wordsLimit,
                        room: parsedRoomData.room,
                        gameType,
                    },
                }));
            });
            (0, redisEvents_1.startSendingUpdates)(roomId, updatedRoom, clients);
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                clearInterval(__1.clearIntervals.get(roomId));
                __1.clearIntervals.delete(roomId);
                console.log("Stop sending updates to client");
                (() => __awaiter(void 0, void 0, void 0, function* () {
                    const finishedRoom = yield userRoutes_1.prisma.game.update({
                        where: {
                            roomId: roomId,
                        },
                        data: {
                            state: "COMPLETED",
                            finishAt: new Date().toISOString(),
                        },
                        select: {
                            startedAt: true,
                            state: true,
                            roomId: true,
                            finishAt: true,
                            createdBy: true,
                            players: {
                                select: {
                                    id: true,
                                    userName: true,
                                    email: true,
                                },
                            },
                        },
                    });
                    yield Promise.all(finishedRoom.players.map((player) => __awaiter(void 0, void 0, void 0, function* () {
                        yield __1.redis.del(`progress:${roomId}-${player.id}`);
                    })));
                    const delRoom = yield __1.redis.del(`room:${roomId}`);
                }))();
                clients.forEach((client) => {
                    if (client.readyState === ws_1.WebSocket.OPEN)
                        client.send(JSON.stringify({
                            event: "game-end",
                            data: {
                                message: "Game completed and ended!!!",
                            },
                        }));
                    //
                });
                __1.roomSockets.delete(roomId);
            }), timeLimit * 1000);
        }
        catch (e) {
            return ws.send(JSON.stringify({
                event: "game-error",
                data: {
                    message: "Room not found!!!",
                    error: e,
                },
            }));
        }
        // "game-started"
    }
    // You can add more game logic here (e.g., typing progress, score updates)
});
exports.gameEvents = gameEvents;
