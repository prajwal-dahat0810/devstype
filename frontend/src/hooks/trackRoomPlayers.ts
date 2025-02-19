import { useRecoilState } from "recoil";
import { roomAtom } from "../store/atoms/testAtom";
import { useEffect } from "react";

export const useTrackRoomPlayers = (socket: WebSocket | null) => {
  const [room, setRoom] = useRecoilState(roomAtom);
  useEffect(() => {
    if (!room) return;
    const handleMessage = (event: MessageEvent) => {
      const { data } = JSON.parse(event.data);
      console.log(data);
    };
    socket?.addEventListener("message", handleMessage);
    return () => {
      socket?.removeEventListener("message", handleMessage);
    };
  }, [socket, setRoom]);

  return room;
};
