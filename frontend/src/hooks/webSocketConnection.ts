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
      try {
        const res: any = await axios.get(`${BACKEND_URL}/refresh`, {
          withCredentials: true, // Ensures cookies are sent
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

    getToken().then(() => {
      if (!token) return; // Ensure token is set before continuing

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
          window.location.href = "/signin";
        }
      };

      window.addEventListener("beforeunload", handleUnload);

      return () => {
        window.removeEventListener("beforeunload", handleUnload);
      };
    });
  }, [token]);
  return { soc: socket };
}
