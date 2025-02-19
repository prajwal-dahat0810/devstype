import z, { number } from "zod";
import { roomSockets } from ".";
export const signupZodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  userName: z.string().min(3).max(20),
});
export const signinZodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});
export const getRoomId = () => {
  const length = 6;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let roomId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomId += characters[randomIndex];
  }

  return roomId;
};

export interface userWebSocket extends WebSocket {
  userId?: string;
}
export function createRoom(roomId: string): void {
  if (!roomSockets.has(roomId)) {
    roomSockets.set(roomId, new Set<WebSocket>());
    console.log(`Room ${roomId} created.`);
  }
}
export function addSocketToRoom(roomId: string, ws: WebSocket): void {
  // Check if room exists
  if (!roomSockets.has(roomId)) {
    console.log(`Room ${roomId} does not exist. Creating room...`);
    createRoom(roomId); // Create room if it doesn't exist
  }

  // Add the WebSocket to the room
  roomSockets.get(roomId)?.add(ws);
  console.log(`WebSocket added to room: ${roomId}`);
}

export function checkPlayer(userId: number, room: any) {
  room.players.map((player: { id: number }) => {
    if (player.id === userId) {
      return true;
    }
  });
  return false; 
}
