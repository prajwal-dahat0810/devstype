import { WebSocket } from "ws";
import { redis, roomSockets } from "..";
import { prisma } from "../routes/userRoutes";
import {
  addSocketToRoom,
  checkPlayer,
  createRoom,
  getRoomId,
  userWebSocket,
} from "../types";
import { removeSocketFromRoom } from "./redisEvents";

export const userEvents = async (ws: userWebSocket, eventData: any) => {
  const userId = ws.userId;

  const { event, data }: { event: string; data: any } = JSON.parse(eventData);
  if (event === "leave-room") {
    const { roomId, gameType, wordsLimit, player } = data;
    const redisRoomData = await redis.get(`room:${roomId}`);
    const roomData = JSON.parse(redisRoomData as string);
    const room = roomData.room;
    // console.log(`room:`, room);
    if (!roomData) {
      ws.send(
        JSON.stringify({
          event: "game-error",
          data: {
            message: "Room not found!!!",
          },
        })
      );
      return;
    }
    if (room.createdBy === Number(player.id)) {
      ///admin exit handle
      if (room.players.length === 1) {
        ///room deleted from db and redis
        try {
          const deleteRoom = await prisma.game.delete({
            where: {
              roomId: roomId,
            },
          });
          await redis.del(`room:${roomId}`);
          return ws.send(
            JSON.stringify({
              event: "room-deleted",
              data: { message: "Room deleted !" },
            })
          );
        } catch (err) {
          return ws.send(
            JSON.stringify({
              event: "room-error",
              data: { message: "Room deleted !", error: err },
            })
          );
        }
      } else {
        try {
          const filterPlayers = room.players.filter(
            (p: { id: number; email: string; userName: string }) => {
              return p.id !== Number(player.id);
            }
          );

          const admin = filterPlayers[0];
          roomData.room.createdBy = admin.id;
          roomData.room.players = filterPlayers;
          const updatedRoomInDb = await prisma.game.update({
            where: {
              roomId: roomId,
            },
            data: {
              createdBy: Number(admin.id),
              players: {
                set: filterPlayers.map((p: { id: any }) => ({
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

          await redis.set(`room:${roomId}`, JSON.stringify(roomData));
          const clients = roomSockets.get(roomId);
          // console.log(clients?.size);
          removeSocketFromRoom(roomId, ws);
          ws.send(
            JSON.stringify({
              event: "admin-leaved",
              data: { message: "Room admin leaved!", room: updatedRoomInDb },
            })
          );

          return clients?.forEach((client) => {
            client.send(
              JSON.stringify({
                event: "admin-room-leaved",
                data: {
                  message: "Room admin leaved!",
                  room: updatedRoomInDb,
                  player: player,
                  wordsLimit,
                  gameType,
                },
              })
            );
          });
        } catch (err) {
          // console.log(err);
          ws.send(
            JSON.stringify({
              event: "room-error",
              data: { message: "Admin  leaved failed!", error: err },
            })
          );
        }
      }
    } else {
      const filterPlayers = room.players.filter(
        (p: { id: number; email: string; userName: string }) => {
          return p.id !== Number(player.id);
        }
      );

      roomData.room.players = filterPlayers;
      await redis.set(`room:${roomId}`, JSON.stringify(roomData));
      ws.send(
        JSON.stringify({
          event: "room-leaved",
          data: { message: "Room player leaved!", room: roomData.room, player },
        })
      );
      const clients = roomSockets.get(roomId);
      removeSocketFromRoom(roomId, ws);
      if (clients) {
        clients.forEach((client) => {
          client.send(
            JSON.stringify({
              event: "room-leave",
              data: {
                message: "Room admin leaved!",
                room: roomData.room,
                player,
              },
            })
          );
        });
      }
    }
  }
  if (event === "send-message") {
    const { roomId, message, userName, id } = data;
    const clients = roomSockets.get(roomId);
    console.log(`clients`, clients?.size);
    if (!clients) {
      return ws.send(
        JSON.stringify({
          event: "game-error",
          data: {
            message: "Room not found!!!",
          },
        })
      );
    }
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN)
        console.log(`sending message`, message, client.userId);
      client.send(
        JSON.stringify({
          event: "get-message",
          data: { roomId, message, userName, id },
        })
      );
    });
  }
  if (event === "join-room") {
    const { userId, roomId, email, userName } = data;
    const getRoom = await redis.get(`room:${roomId}`);
    if (!getRoom) {
      return ws.send(
        JSON.stringify({
          event: "room-error",
          data: { message: "Room not found!" },
        })
      );
    }
    const roomClients = roomSockets.get(roomId);
    if (!roomClients) {
      return ws.send(
        JSON.stringify({
          event: "room-error",
          data: { message: "Room not found!" },
        })
      );
    }
    const roomData = JSON.parse(getRoom);
    if (roomData.room.state !== "WAITING") {
      return ws.send(
        JSON.stringify({
          event: "room-error",
          data: {
            message: `Room ${
              roomData.room.state === "COMPLETED" ? "completed" : "started"
            } already!!`,
          },
        })
      );
    }
    if (roomData.room.players.length + 1 > 10) {
      return ws.send(
        JSON.stringify({
          event: "room-error",
          data: { message: "Only 10 player allowed!" },
        })
      );
    }
    const newPlayer = { id: Number(userId), email, userName };
    const isPlayerJoined = roomData.room.players.some(
      (r: { id: number }) => r.id === Number(userId)
    );
    // console.log(`isjoined'`, isPlayerJoined);
    if (isPlayerJoined) {
      return ws.send(
        JSON.stringify({
          event: "room-joined-already",
          data: {
            message: `Room joined already!`,
            room: roomData.room,
            gameType: roomData.gameType,
            wordsLimit: roomData.wordsLimit,
          },
        })
      );
    }
    roomData.room.players.push(newPlayer);

    // console.log("updated players", roomData.room.players);
    const setToRoom = await redis.set(
      `room:${roomId}`,
      JSON.stringify(roomData)
    );
    ws.send(
      JSON.stringify({
        event: "player-joined",
        data: {
          message: `Room joined successfully!`,
          room: roomData.room,
          gameType: roomData.gameType,
          wordsLimit: roomData.wordsLimit,
        },
      })
    );
    const clients = roomSockets.get(roomId);
    if (!clients) {
      // console.log(`other player not in room`);
      ws.send(
        JSON.stringify({
          event: "game-error",
          data: {
            message: "Room not found!!!",
          },
        })
      );
      return;
    }

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN)
        client.send(
          JSON.stringify({
            event: "player-join",
            data: {
              message: `${userName} joined room`,
              room: roomData.room,
              gameType: roomData.gameType,
              wordsLimit: roomData.wordsLimit,
            },
          })
        );
    });
    roomSockets.get(roomId)?.add(ws);
  }

  if (event === "create-room") {
    const { gameType, wordsLimit } = data;
    const roomId = getRoomId();
    try {
      const room = await prisma.game.create({
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
      createRoom(roomId);
      const setToRedis = await redis.set(
        `room:${room.roomId}`,
        JSON.stringify({
          wordsLimit: wordsLimit,
          gameType: gameType,
          room: room,
        })
      );
      addSocketToRoom(roomId, ws);
      return ws.send(
        JSON.stringify({
          event: "room-created",
          data: { room: room, wordsLimit, gameType },
        })
      );
    } catch (error) {
      ws.send(
        JSON.stringify({
          event: "room-error",
          data: { message: "Room creation fails" },
        })
      );
    }
  }
};
