import { clearIntervals, redis, roomSockets } from "..";
import { userWebSocket } from "../types";


export function removeSocketFromRoom(roomId: string, ws: WebSocket): void {
  const room = roomSockets.get(roomId);
  if (room) {
    room.delete(ws);
    // console.log(`WebSocket removed from room: ${roomId}`);
  } else {
    console.log(`Room ${roomId} does not exist.`);
  }
}

export async function startSendingUpdates(
  roomId: string,
  updatedRoom: any,
  clients: Set<userWebSocket>
) {
  const timeInterval = setInterval(async () => {
    const progress = await Promise.all(
      updatedRoom.players.map(
        async (player: { id: number; userName: string }) => {
          const progress = await redis.get(`progress:${roomId}-${player.id}`);
          return {
            progress: progress
              ? JSON.parse(progress)
              : { time: 0, wpm: 0, accuracy: 0, totalTyped: 0 },
            userName: player.userName,
            id: player.id,
          };
        }
      )
    );
    // console.log("progress:", progress);

    clients.forEach((client) => {
      client.send(
        JSON.stringify({
          event: "progress-update",
          data: { progress },
        })
      );
    });
  }, 800);
  clearIntervals.set(roomId, timeInterval);
}
