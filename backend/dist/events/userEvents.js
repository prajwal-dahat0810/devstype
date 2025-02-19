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
exports.userEvents = void 0;
const ws_1 = require("ws");
const __1 = require("..");
const userRoutes_1 = require("../routes/userRoutes");
const types_1 = require("../types");
const redisEvents_1 = require("./redisEvents");
const userEvents = (ws, eventData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = ws.userId;
    const { event, data } = JSON.parse(eventData);
    if (event === "leave-room") {
        const { roomId, gameType, wordsLimit, player } = data;
        const redisRoomData = yield __1.redis.get(`room:${roomId}`);
        const roomData = JSON.parse(redisRoomData);
        const room = roomData.room;
        // console.log(`room:`, room);
        if (!roomData) {
            ws.send(JSON.stringify({
                event: "game-error",
                data: {
                    message: "Room not found!!!",
                },
            }));
            return;
        }
        if (room.createdBy === Number(player.id)) {
            ///admin exit handle
            if (room.players.length === 1) {
                ///room deleted from db and redis
                try {
                    const deleteRoom = yield userRoutes_1.prisma.game.delete({
                        where: {
                            roomId: roomId,
                        },
                    });
                    yield __1.redis.del(`room:${roomId}`);
                    return ws.send(JSON.stringify({
                        event: "room-deleted",
                        data: { message: "Room deleted !" },
                    }));
                }
                catch (err) {
                    return ws.send(JSON.stringify({
                        event: "room-error",
                        data: { message: "Room deleted !", error: err },
                    }));
                }
            }
            else {
                try {
                    const filterPlayers = room.players.filter((p) => {
                        return p.id !== Number(player.id);
                    });
                    const admin = filterPlayers[0];
                    roomData.room.createdBy = admin.id;
                    roomData.room.players = filterPlayers;
                    const updatedRoomInDb = yield userRoutes_1.prisma.game.update({
                        where: {
                            roomId: roomId,
                        },
                        data: {
                            createdBy: Number(admin.id),
                            players: {
                                set: filterPlayers.map((p) => ({
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
                    yield __1.redis.set(`room:${roomId}`, JSON.stringify(roomData));
                    const clients = __1.roomSockets.get(roomId);
                    // console.log(clients?.size);
                    (0, redisEvents_1.removeSocketFromRoom)(roomId, ws);
                    ws.send(JSON.stringify({
                        event: "admin-leaved",
                        data: { message: "Room admin leaved!", room: updatedRoomInDb },
                    }));
                    return clients === null || clients === void 0 ? void 0 : clients.forEach((client) => {
                        client.send(JSON.stringify({
                            event: "admin-room-leaved",
                            data: {
                                message: "Room admin leaved!",
                                room: updatedRoomInDb,
                                player: player,
                                wordsLimit,
                                gameType,
                            },
                        }));
                    });
                }
                catch (err) {
                    // console.log(err);
                    ws.send(JSON.stringify({
                        event: "room-error",
                        data: { message: "Admin  leaved failed!", error: err },
                    }));
                }
            }
        }
        else {
            const filterPlayers = room.players.filter((p) => {
                return p.id !== Number(player.id);
            });
            roomData.room.players = filterPlayers;
            yield __1.redis.set(`room:${roomId}`, JSON.stringify(roomData));
            ws.send(JSON.stringify({
                event: "room-leaved",
                data: { message: "Room player leaved!", room: roomData.room, player },
            }));
            const clients = __1.roomSockets.get(roomId);
            (0, redisEvents_1.removeSocketFromRoom)(roomId, ws);
            if (clients) {
                clients.forEach((client) => {
                    client.send(JSON.stringify({
                        event: "room-leave",
                        data: {
                            message: "Room admin leaved!",
                            room: roomData.room,
                            player,
                        },
                    }));
                });
            }
        }
    }
    if (event === "join-room") {
        const { userId, roomId, email, userName } = data;
        const getRoom = yield __1.redis.get(`room:${roomId}`);
        if (!getRoom) {
            return ws.send(JSON.stringify({
                event: "room-error",
                data: { message: "Room not found!" },
            }));
        }
        const roomData = JSON.parse(getRoom);
        if (roomData.room.state !== "WAITING") {
            return ws.send(JSON.stringify({
                event: "room-error",
                data: {
                    message: `Room ${roomData.room.state === "COMPLETED" ? "completed" : "started"} already!!`,
                },
            }));
        }
        if (roomData.room.players.length + 1 > 10) {
            return ws.send(JSON.stringify({
                event: "room-error",
                data: { message: "Only 10 player allowed!" },
            }));
        }
        const newPlayer = { id: Number(userId), email, userName };
        const isPlayerJoined = roomData.room.players.some((r) => r.id === Number(userId));
        // console.log(`isjoined'`, isPlayerJoined);
        if (isPlayerJoined) {
            return ws.send(JSON.stringify({
                event: "room-joined-already",
                data: {
                    message: `Room joined already!`,
                    room: roomData.room,
                    gameType: roomData.gameType,
                    wordsLimit: roomData.wordsLimit,
                },
            }));
        }
        roomData.room.players.push(newPlayer);
        // console.log("updated players", roomData.room.players);
        const setToRoom = yield __1.redis.set(`room:${roomId}`, JSON.stringify(roomData));
        ws.send(JSON.stringify({
            event: "player-joined",
            data: {
                message: `Room joined successfully!`,
                room: roomData.room,
                gameType: roomData.gameType,
                wordsLimit: roomData.wordsLimit,
            },
        }));
        const clients = __1.roomSockets.get(roomId);
        // console.log(clients?.size);
        if (!clients) {
            console.log(`other player not in room`);
            ws.send(JSON.stringify({
                event: "game-error",
                data: {
                    message: "Room not found!!!",
                },
            }));
            return;
        }
        clients.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN)
                client.send(JSON.stringify({
                    event: "player-join",
                    data: {
                        message: `${userName} joined room`,
                        room: roomData.room,
                        gameType: roomData.gameType,
                        wordsLimit: roomData.wordsLimit,
                    },
                }));
        });
        (_a = __1.roomSockets.get(roomId)) === null || _a === void 0 ? void 0 : _a.add(ws);
    }
    if (event === "create-room") {
        const { gameType, wordsLimit } = data;
        const roomId = (0, types_1.getRoomId)();
        try {
            const room = yield userRoutes_1.prisma.game.create({
                data: {
                    roomId: roomId,
                    createdBy: Number(userId),
                    state: "WAITING",
                    players: {
                        connect: {
                            id: Number(userId),
                        },
                    },
                },
                select: {
                    roomId: true,
                    state: true,
                    createdBy: true,
                    finishAt: true,
                    startedAt: true,
                    players: {
                        select: {
                            id: true,
                            userName: true,
                            email: true,
                        },
                    },
                },
            });
            (0, types_1.createRoom)(roomId);
            const setToRedis = yield __1.redis.set(`room:${room.roomId}`, JSON.stringify({
                wordsLimit: wordsLimit,
                gameType: gameType,
                room: room,
            }));
            (0, types_1.addSocketToRoom)(roomId, ws);
            return ws.send(JSON.stringify({
                event: "room-created",
                data: { room: room, wordsLimit, gameType },
            }));
        }
        catch (error) {
            ws.send(JSON.stringify({
                event: "room-error",
                data: { message: "Room creation fails" },
            }));
        }
    }
});
exports.userEvents = userEvents;
