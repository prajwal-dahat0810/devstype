import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { socketAtom } from "../store/atoms/socketAtom";
import axios from "axios";
const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL as string;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export function useWebSocket() {
  const [socket, setSocket] = useRecoilState(socketAtom);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (socket) return;

    const getToken = async () => {
      console.log('taking to get token')
      try {
        const res: any = await axios.get(`${BACKEND_URL}/refresh`, {
          withCredentials: true,
        });
        if (res.data.token) {
          setToken(res.data.token);
        } else {
          console.error("Token not received from server");
        }
      } catch (err) {
        console.error("Error getting token", err);
      }
    };

    getToken();
  }, [socket]);
  useEffect(() => {
    if (!token || socket) return;

    const ws = new WebSocket(`${WEBSOCKET_URL}?token=${token}`);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      setSocket(() => ws);
    };

    ws.onclose = () => {
      setSocket(() => null);
      console.log("WebSocket connection closed");
    };

    const handleUnload = () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
        console.log("websocket closed");
        window.location.href = "/signin";
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [token]);
  return { soc: socket };
}
