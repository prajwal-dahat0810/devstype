import { WebSocket } from "ws";
import { clearIntervals, redis, roomSockets } from "..";
import { prisma } from "../routes/userRoutes";
import { userWebSocket } from "../types";
import { startSendingUpdates } from "./redisEvents";
const paragraphs: Record<number, string> = {
  15: "The sun sets behind the hills, painting the sky in shades of orange and purple.",
  30: "The quick brown fox jumps over the lazy dog. Smooth and accurate typing is essential for efficiency. Consistent practice helps develop speed and precision, making typing a seamless skill over time.",
  40: "Learning to type efficiently improves productivity. Touch typing allows you to focus on your thoughts instead of searching for keys. Consistency is important. Keep practicing daily, and soon your typing speed and accuracy will significantly improve over time.",
};
export const gameEvents = async (ws: userWebSocket, eventData: any) => {
  const userId = ws.userId;

  const { event, data }: { event: string; data: any } = JSON.parse(eventData);
  if (event === "update-score") {
    const { roomId, time, wpm, accuracy, totalTyped, wordsLimit } = data;
    const getRoom = await redis.get(`progress:${roomId}-${userId}`);
    const parsedRoom = JSON.parse(getRoom as string);
    parsedRoom.time = time;
    parsedRoom.wpm = wpm;
    parsedRoom.accuracy = accuracy;
    parsedRoom.totalTyped = totalTyped;
    const updatedProgress = await redis.set(
      `progress:${roomId}-${userId}`,
      JSON.stringify(
        parsedRoom || { wpm: 0, time: 0, accuracy: 0, totalTyped: 0 }
      )
    );
    // console.log("updated", updatedProgress);
    return;
  }
  if (event === "start-game") {
    const { roomId } = data;
    const getRoom = await redis.get(`room:${roomId}`);
    if (!getRoom) {
      console.log("room not found");
      //
      return ws.send(
        JSON.stringify({
          event: "game-error",
          data: {
            message: "Room not found!!!",
          },
        })
      );
    }
    const parsedRoomData: { room: any; wordsLimit: number; gameType: string } =
      JSON.parse(getRoom as string);
    // console.log(parsedRoomData.room.players);
    const wordsLimit = parsedRoomData.wordsLimit;
    const gameType = parsedRoomData.gameType;
    const timeLimit = wordsLimit === 40 ? 150 : wordsLimit === 30 ? 120 : 60;

    try {
      const updatedRoom = await prisma.game.update({
        where: {
          roomId: roomId,
        },
        data: {
          state: "IN_PROGRESS",
          startedAt: new Date().toISOString(),
          players: {
            set: parsedRoomData.room.players.map((p: { id: any }) => ({
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
      const updatedRedisRoom = await redis.set(
        `room:${roomId}`,
        JSON.stringify(parsedRoomData)
      );
      // console.log(updatedRedisRoom);
      const progress = await Promise.all(
        updatedRoom.players.map(
          async (player: { userName: string; id: number }) => {
            await redis.set(
              `progress:${roomId}-${player.id}`,
              JSON.stringify({ time: 0, wpm: 0, accuracy: 0, totalTyped: 0 })
            );
            return {
              id: player.id,
              userName: player.userName,
              progress: { time: 0, wpm: 0, accuracy: 0, totalTyped: 0 },
            };
          }
        )
      );

      const clients = roomSockets.get(roomId);
      // console.log(clients?.size);
      if (!clients) {
        return ws.send(
          JSON.stringify({
            event: "game-error",
            data: {
              message: "Some error happen!!!",
            },
          })
        );
      }
      clients.forEach((client) => {
        client.send(
          JSON.stringify({
            event: "game-started",
            data: {
              paragraph: paragraphs[parsedRoomData.wordsLimit || 15],
              wordsLimit,
              room: parsedRoomData.room,
              gameType,
            },
          })
        );
      });
      startSendingUpdates(roomId, updatedRoom, clients);
      setTimeout(async () => {
        clearInterval(clearIntervals.get(roomId));
        clearIntervals.delete(roomId);
        console.log("Stop sending updates to client");

        (async () => {
          const finishedRoom = await prisma.game.update({
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
          await Promise.all(
            finishedRoom.players.map(async (player) => {
              await redis.del(`progress:${roomId}-${player.id}`);
            })
          );

          const delRoom = await redis.del(`room:${roomId}`);
        })();
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN)
            client.send(
              JSON.stringify({
                event: "game-end",
                data: {
                  message: "Game completed and ended!!!",
                },
              })
            );
          //
        });
        roomSockets.delete(roomId);
      }, timeLimit * 1000);
    } catch (e) {
      return ws.send(
        JSON.stringify({
          event: "game-error",
          data: {
            message: "Room not found!!!",
            error: e,
          },
        })
      );
    }

    // "game-started"
  }
  // You can add more game logic here (e.g., typing progress, score updates)
};
